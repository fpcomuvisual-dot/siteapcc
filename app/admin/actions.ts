'use server'
// NOTA: Se após o deploy o Firestore retornar 0 docs, verifique na Vercel:
// Settings → Environment Variables → FIREBASE_PROJECT_ID = apcc-arquivo-site
// FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY devem ser idênticos ao .env.local
import { initAdmin } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

function slugify(text?: string): string {
    if (!text) return '';
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function normalizeNewsDoc(id: string, d: Record<string, any>) {
    const titulo = d.titulo ?? '';
    return {
        id,
        titulo,
        slug: d.slug || slugify(titulo) || id,
        categoria: d.categoria ?? 'Notícia',
        data: d.data ?? '',
        resumo: d.resumo ?? '',
        conteudo: d.conteudo ?? '',
        imagem: d.imagem ?? '',
        galeria: Array.isArray(d.galeria)
            ? d.galeria.filter((item: any) => typeof item === 'string')
            : [],
        createdAt: d.createdAt ?? '',
        // campos extras do WordPress (preservados se existirem)
        ...(d.wpId !== undefined && { wpId: d.wpId }),
        ...(d.origem !== undefined && { origem: d.origem }),
    };
}

function normalizeTransparencyDoc(id: string, d: Record<string, any>) {
    return {
        id,
        titulo: d.titulo ?? '',
        categoria: d.categoria ?? 'Outros',
        ano: typeof d.ano === 'number' ? d.ano : new Date().getFullYear(),
        arquivo: d.arquivo ?? '',
        descricao: d.descricao ?? '',
        data: d.data ?? '',
        createdAt: d.createdAt ?? '',
    };
}

export async function createNewsItem(formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');

        const app = await initAdmin();
        const bucket = getStorage(app).bucket();
        const db = getFirestore(app);

        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const date = formData.get('date') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File;
        const galleryFiles = formData.getAll('galeria')
            .filter((item): item is File => item instanceof File && item.size > 0);

        if (!image || image.size === 0) {
            throw new Error('Image is required');
        }

        // 1. Upload Image
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `news/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(buffer, {
            metadata: {
                contentType: image.type,
            },
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        // 1b. Upload gallery images (opcional)
        const galleryUrls: string[] = [];
        for (let i = 0; i < galleryFiles.length; i += 1) {
            const file = galleryFiles[i];
            if (!file.type.startsWith('image/')) {
                throw new Error('Apenas imagens são aceitas na galeria');
            }
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '') || `image-${i}.jpg`;
            const galleryFilename = `news/galeria/${Date.now()}-${i}-${safeName}`;
            const galleryFileRef = bucket.file(galleryFilename);
            const galleryBuffer = Buffer.from(await file.arrayBuffer());
            await galleryFileRef.save(galleryBuffer, { metadata: { contentType: file.type } });
            galleryUrls.push(`https://storage.googleapis.com/${bucket.name}/${galleryFilename}`);
        }

        // 2. Save to Firestore
        await db.collection('news').add({
            titulo: title,
            slug: slugify(title),
            categoria: category,
            data: date,
            resumo: content.substring(0, 150) + '...',
            conteudo: content,
            imagem: publicUrl,
            galeria: galleryUrls,
            createdAt: new Date().toISOString()
        });

        revalidatePath('/');
        return { success: true, message: 'Matéria publicada com sucesso!' };

    } catch (error) {
        console.error('Error creating news:', error);
        return { success: false, message: 'Erro ao publicar matéria.' };
    }
}

export async function getNewsItems() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());
        const snapshot = await db.collection('news').orderBy('data', 'desc').limit(3).get();
        return snapshot.docs
            .map(doc => { try { return normalizeNewsDoc(doc.id, doc.data()) } catch { return null } })
            .filter(Boolean);
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function getAllNewsItems() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());
        const snapshot = await db.collection('news').orderBy('data', 'desc').get();
        console.log('[news] docs encontrados:', snapshot.size); // diagnóstico: aparece nos Runtime Logs da Vercel
        return snapshot.docs
            .map(doc => { try { return normalizeNewsDoc(doc.id, doc.data()) } catch { return null } })
            .filter(Boolean);
    } catch (error) {
        console.error('Error fetching all news:', error);
        return [];
    }
}

export async function getNewsBySlug(slug: string) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        const snap = await db.collection('news').where('slug', '==', slug).limit(1).get();
        if (!snap.empty) {
            return normalizeNewsDoc(snap.docs[0].id, snap.docs[0].data());
        }

        // Fallback: busca pelo ID do documento
        const docById = await db.collection('news').doc(slug).get();
        if (docById.exists) {
            return normalizeNewsDoc(docById.id, docById.data() ?? {});
        }

        return null;
    } catch (error) {
        console.error('Error fetching news by slug:', error);
        return null;
    }
}

// --- TRANSPARENCY ACTIONS ---

export async function createTransparencyDoc(formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app = await initAdmin();
        const bucket = getStorage(app).bucket();
        const db = getFirestore(app);

        const titulo = formData.get('titulo') as string;
        const categoria = formData.get('categoria') as string;
        const ano = parseInt(formData.get('ano') as string);
        const descricao = (formData.get('descricao') as string) || '';
        const data = (formData.get('data') as string) || new Date().toISOString();
        const arquivo = formData.get('arquivo') as File;

        if (!arquivo || arquivo.size === 0) throw new Error('PDF é obrigatório');
        if (arquivo.type !== 'application/pdf') throw new Error('Apenas PDFs são aceitos');

        const buffer = Buffer.from(await arquivo.arrayBuffer());
        const filename = `transparency/${Date.now()}-${arquivo.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        const fileRef = bucket.file(filename);
        await fileRef.save(buffer, { metadata: { contentType: 'application/pdf' } });
        // O bucket precisa ter leitura pública: IAM → allUsers → Storage Object Viewer
        const arquivoUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        await db.collection('transparency_docs').add({
            titulo, categoria, ano, descricao, data, arquivo: arquivoUrl,
            createdAt: new Date().toISOString(),
        });

        revalidatePath('/transparencia');
        revalidatePath('/admin');
        return { success: true, message: 'Documento publicado com sucesso!' };
    } catch (error) {
        console.error('Error creating transparency doc:', error);
        const msg = error instanceof Error ? error.message : 'Erro ao publicar documento.';
        return { success: false, message: msg };
    }
}

export async function getTransparencyDocs() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());
        const snapshot = await db.collection('transparency_docs').orderBy('ano', 'desc').get();
        return snapshot.docs
            .map(doc => { try { return normalizeTransparencyDoc(doc.id, doc.data()) } catch { return null } })
            .filter(Boolean);
    } catch (error) {
        console.error('Error fetching transparency docs:', error);
        return [];
    }
}

export async function deleteTransparencyDoc(id: string) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const { getStorage } = await import('firebase-admin/storage');
        const app = await initAdmin();
        const db = getFirestore(app);

        const doc = await db.collection('transparency_docs').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data?.arquivo) {
                try {
                    const bucket = getStorage(app).bucket();
                    const url = new URL(data.arquivo);
                    const filePath = decodeURIComponent(url.pathname.replace(`/${bucket.name}/`, ''));
                    await bucket.file(filePath).delete();
                } catch { /* ignora se arquivo já não existir */ }
            }
            await db.collection('transparency_docs').doc(id).delete();
        }

        revalidatePath('/transparencia');
        revalidatePath('/admin');
        return { success: true, message: 'Documento removido.' };
    } catch (error) {
        console.error('Error deleting transparency doc:', error);
        return { success: false, message: 'Erro ao remover documento.' };
    }
}

// --- SEARCH ---

export async function searchContent(query: string) {
    // Para acervos maiores (milhares de docs), migrar para Algolia/Typesense.
    // Hoje, filtro em memória é suficiente e instantâneo para ~100 docs.
    const normalize = (s: string) =>
        s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const q = normalize(query.trim());
    if (!q || q.length < 2) return { news: [], docs: [] };

    const [news, docs] = await Promise.all([getAllNewsItems(), getTransparencyDocs()]);

    const matchedNews = (news as any[]).filter(n =>
        normalize(n.titulo || '').includes(q) ||
        normalize(n.resumo || '').includes(q) ||
        normalize(n.categoria || '').includes(q)
    );
    const matchedDocs = (docs as any[]).filter(d =>
        normalize(d.titulo || '').includes(q) ||
        normalize(d.categoria || '').includes(q) ||
        normalize(d.descricao || '').includes(q)
    );
    return { news: matchedNews, docs: matchedDocs };
}

// --- AI DEMO (apenas demonstração, não conectado a API real) ---

export async function analyzeDocument(formData: FormData) {
    // Simulate network/processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const file = formData.get('docs') as File
    const fileName = file ? file.name : 'documento.pdf'

    // Return mocked "Gemini" analysis
    return {
        success: true,
        data: {
            date: new Date().toLocaleDateString('pt-BR'),
            subject: `Análise Financeira - ${fileName}`,
            // Engaging institutional release with emojis
            release: "✨ Trazemos ótimas notícias! Nossa análise financeira demonstra a solidez dos investimentos realizados neste trimestre. 💪 Com transparência e dedicação, garantimos que cada centavo doado está transformando vidas. Juntos somos mais fortes! 🚀",
            confidence: 0.98
        }
    }
}

// --- HERO SETTINGS ---

export async function getHeroSettings() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());
        const doc = await db.collection('settings').doc('global').get();
        const d = doc.data() || {};
        return {
            titulo:      (d.heroTitulo     as string) || '',
            subtitulo:   (d.heroSubtitulo  as string) || '',
            heroImageUrl:(d.heroImageUrl   as string) || '',
        };
    } catch (error) {
        console.error('Error fetching hero settings:', error);
        return { titulo: '', subtitulo: '', heroImageUrl: '' };
    }
}

export async function saveHeroSettings(formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app    = await initAdmin();
        const db     = getFirestore(app);
        const titulo    = formData.get('titulo')    as string;
        const subtitulo = formData.get('subtitulo') as string;
        const imagem    = formData.get('imagem')    as File;

        const update: Record<string, unknown> = {
            heroTitulo:    titulo    || '',
            heroSubtitulo: subtitulo || '',
            updatedAt:     new Date().toISOString(),
        };

        if (imagem && imagem.size > 0) {
            if (!imagem.type.startsWith('image/')) throw new Error('Apenas imagens são aceitas');
            const bucket   = getStorage(app).bucket();
            const ext      = (imagem.name.split('.').pop() || 'jpg').toLowerCase();
            const filename = `hero/hero-${Date.now()}.${ext}`;
            await bucket.file(filename).save(Buffer.from(await imagem.arrayBuffer()), { metadata: { contentType: imagem.type } });
            update.heroImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        }

        await db.collection('settings').doc('global').set(update, { merge: true });
        revalidatePath('/');
        return { success: true, message: 'Hero atualizada com sucesso!', heroImageUrl: update.heroImageUrl as string || null };
    } catch (error) {
        console.error('Error saving hero settings:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Erro ao salvar.' };
    }
}

// --- POPUP SETTINGS ---

export async function getPopupSettings() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db  = getFirestore(await initAdmin());
        const doc = await db.collection('settings').doc('global').get();
        const d   = (doc.data() || {}) as Record<string, unknown>;
        return (d.popup as Record<string, unknown>) || { ativo: false, titulo: '', mensagem: '', botaoTexto: '', botaoLink: '', versao: 1, imagemUrl: '' };
    } catch (error) {
        console.error('Error fetching popup settings:', error);
        return { ativo: false, titulo: '', mensagem: '', botaoTexto: '', botaoLink: '', versao: 1, imagemUrl: '' };
    }
}

export async function savePopupSettings(formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app = await initAdmin();
        const db  = getFirestore(app);

        const docRef  = db.collection('settings').doc('global');
        const current = ((await docRef.get()).data() || {}) as Record<string, unknown>;
        const prev    = (current.popup as Record<string, unknown>) || {};

        const ativo      = formData.get('ativo')           === 'on';
        const titulo     = (formData.get('popupTitulo')     as string) || '';
        const mensagem   = (formData.get('popupMensagem')   as string) || '';
        const botaoTexto = (formData.get('popupBotaoTexto') as string) || '';
        const botaoLink  = (formData.get('popupBotaoLink')  as string) || '';
        const imagem     = formData.get('popupImagem')      as File;

        const popup: Record<string, unknown> = {
            ...prev,
            ativo, titulo, mensagem, botaoTexto, botaoLink,
            versao: ((prev.versao as number) || 0) + 1,
        };

        if (imagem && imagem.size > 0) {
            if (!imagem.type.startsWith('image/')) throw new Error('Apenas imagens são aceitas');
            const bucket   = getStorage(app).bucket();
            const ext      = (imagem.name.split('.').pop() || 'jpg').toLowerCase();
            const filename = `popup/popup-${Date.now()}.${ext}`;
            await bucket.file(filename).save(Buffer.from(await imagem.arrayBuffer()), { metadata: { contentType: imagem.type } });
            popup.imagemUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        }

        await docRef.set({ popup }, { merge: true });
        revalidatePath('/');
        return { success: true, message: 'Popup atualizado com sucesso!' };
    } catch (error) {
        console.error('Error saving popup settings:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Erro ao salvar.' };
    }
}

export async function saveThemeSettings(formData: FormData) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        const theme = formData.get('theme') as string;
        const darkMode = formData.get('darkMode') === 'on';

        await db.collection('settings').doc('global').set({
            theme,
            darkMode,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        revalidatePath('/');
        return { success: true, message: 'Tema atualizado com sucesso!' };
    } catch (error) {
        console.error('Error saving theme:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: `Erro ao salvar tema: ${errorMessage}` };
    }
}

export async function getThemeSettings() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        const doc = await db.collection('settings').doc('global').get();
        if (doc.exists) {
            return doc.data();
        }
        return { theme: 'theme-rosa', darkMode: false };
    } catch (error) {
        console.error('Error fetching theme:', error);
        return { theme: 'theme-rosa', darkMode: false };
    }
}

export async function saveSettings(formData: FormData) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Here we would save to DB
    return { success: true }
}

// --- CALENDAR ACTIONS ---

export async function createCalendarEvent(formData: FormData) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        const day = formData.get('day') as string;
        const month = parseInt(formData.get('month') as string);
        const year = parseInt(formData.get('year') as string);
        const title = formData.get('title') as string;
        const time = formData.get('time') as string;
        const description = formData.get('description') as string;

        // Create a sortable date field for easier ordering: YYYY-MM-DD
        // Assuming day is just the number "7" or "07"
        const paddedDay = day.padStart(2, '0');
        const paddedMonth = month.toString().padStart(2, '0');
        const sortDate = `${year}-${paddedMonth}-${paddedDay}`;

        await db.collection('calendar_events').add({
            day,
            month, // 0-based or 1-based? Let's assume 1-based (1=Jan) to match UI usually
            year,
            title,
            time,
            description,
            sortDate,
            createdAt: new Date().toISOString()
        });

        revalidatePath('/calendario');
        revalidatePath('/admin');
        return { success: true, message: 'Evento adicionado com sucesso!' };

    } catch (error) {
        console.error('Error creating calendar event:', error);
        return { success: false, message: 'Erro ao adicionar evento.' };
    }
}

export async function getCalendarEvents(year?: number, month?: number) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        let query = db.collection('calendar_events').orderBy('sortDate', 'asc');

        if (year) {
            query = query.where('year', '==', year);
        }
        if (month) {
            query = query.where('month', '==', month);
        }

        const snapshot = await query.get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
}

export async function deleteCalendarEvent(id: string) {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());

        await db.collection('calendar_events').doc(id).delete();

        revalidatePath('/calendario');
        revalidatePath('/admin');
        return { success: true, message: 'Evento removido com sucesso!' };
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        return { success: false, message: 'Erro ao remover evento.' };
    }
}

// --- VOLUNTEERS ACTIONS ---

export async function getVolunteers() {
    try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore(await initAdmin());
        const snapshot = await db.collection('volunteers').orderBy('ordem', 'asc').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome ?? '',
            role: doc.data().role ?? '',
            imagemUrl: doc.data().imagemUrl ?? '',
            ordem: doc.data().ordem ?? 0,
            createdAt: doc.data().createdAt ?? '',
        }));
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        return [];
    }
}

export async function createVolunteer(formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app = await initAdmin();
        const bucket = getStorage(app).bucket();
        const db = getFirestore(app);

        const nome = formData.get('nome') as string;
        const role = (formData.get('role') as string) || 'Voluntário(a)';
        const imagem = formData.get('imagem') as File;

        if (!nome) throw new Error('Nome é obrigatório');
        if (!imagem || imagem.size === 0) throw new Error('Foto é obrigatória');
        if (!imagem.type.startsWith('image/')) throw new Error('Apenas imagens são aceitas');

        const buffer = Buffer.from(await imagem.arrayBuffer());
        const safeName = slugify(nome) || `vol-${Date.now()}`;
        const ext = (imagem.name.split('.').pop() || 'png').toLowerCase();
        const filename = `volunteers/${safeName}-${Date.now()}.${ext}`;
        const fileRef = bucket.file(filename);
        await fileRef.save(buffer, { metadata: { contentType: imagem.type } });
        const imagemUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        // Determinar a próxima ordem
        const lastDoc = await db.collection('volunteers').orderBy('ordem', 'desc').limit(1).get();
        const nextOrdem = lastDoc.empty ? 1 : ((lastDoc.docs[0].data().ordem as number) || 0) + 1;

        await db.collection('volunteers').add({
            nome,
            role,
            imagemUrl,
            ordem: nextOrdem,
            createdAt: new Date().toISOString(),
        });

        revalidatePath('/sobre');
        revalidatePath('/admin');
        return { success: true, message: 'Voluntário(a) adicionado(a) com sucesso!' };
    } catch (error) {
        console.error('Error creating volunteer:', error);
        const msg = error instanceof Error ? error.message : 'Erro ao adicionar voluntário(a).';
        return { success: false, message: msg };
    }
}

export async function updateVolunteer(id: string, formData: FormData) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app = await initAdmin();
        const db = getFirestore(app);

        const nome = formData.get('nome') as string;
        const role = (formData.get('role') as string) || 'Voluntário(a)';
        const imagem = formData.get('imagem') as File;

        if (!nome) throw new Error('Nome é obrigatório');

        const update: Record<string, unknown> = {
            nome,
            role,
            updatedAt: new Date().toISOString(),
        };

        // Se enviou nova foto, faz upload e deleta a antiga
        if (imagem && imagem.size > 0) {
            if (!imagem.type.startsWith('image/')) throw new Error('Apenas imagens são aceitas');

            const bucket = getStorage(app).bucket();

            // Deletar foto anterior
            const currentDoc = await db.collection('volunteers').doc(id).get();
            if (currentDoc.exists) {
                const oldUrl = currentDoc.data()?.imagemUrl;
                if (oldUrl) {
                    try {
                        const url = new URL(oldUrl);
                        const filePath = decodeURIComponent(url.pathname.replace(`/${bucket.name}/`, ''));
                        await bucket.file(filePath).delete();
                    } catch { /* ignora se arquivo já não existir */ }
                }
            }

            const buffer = Buffer.from(await imagem.arrayBuffer());
            const safeName = slugify(nome) || `vol-${Date.now()}`;
            const ext = (imagem.name.split('.').pop() || 'png').toLowerCase();
            const filename = `volunteers/${safeName}-${Date.now()}.${ext}`;
            await bucket.file(filename).save(buffer, { metadata: { contentType: imagem.type } });
            update.imagemUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        }

        await db.collection('volunteers').doc(id).update(update);

        revalidatePath('/sobre');
        revalidatePath('/admin');
        return { success: true, message: 'Voluntário(a) atualizado(a) com sucesso!' };
    } catch (error) {
        console.error('Error updating volunteer:', error);
        const msg = error instanceof Error ? error.message : 'Erro ao atualizar voluntário(a).';
        return { success: false, message: msg };
    }
}

export async function deleteVolunteer(id: string) {
    try {
        const { getStorage } = await import('firebase-admin/storage');
        const { getFirestore } = await import('firebase-admin/firestore');
        const app = await initAdmin();
        const db = getFirestore(app);

        const doc = await db.collection('volunteers').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            if (data?.imagemUrl) {
                try {
                    const bucket = getStorage(app).bucket();
                    const url = new URL(data.imagemUrl);
                    const filePath = decodeURIComponent(url.pathname.replace(`/${bucket.name}/`, ''));
                    await bucket.file(filePath).delete();
                } catch { /* ignora se arquivo já não existir */ }
            }
            await db.collection('volunteers').doc(id).delete();
        }

        revalidatePath('/sobre');
        revalidatePath('/admin');
        return { success: true, message: 'Voluntário(a) removido(a).' };
    } catch (error) {
        console.error('Error deleting volunteer:', error);
        return { success: false, message: 'Erro ao remover voluntário(a).' };
    }
}
