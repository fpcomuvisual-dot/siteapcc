'use server'
import { initAdmin } from '@/lib/firebase-admin'

import { revalidatePath } from 'next/cache'

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

        // Make pbulic
        await fileRef.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        // 2. Save to Firestore
        await db.collection('news').add({
            titulo: title,
            categoria: category,
            data: date,
            resumo: content.substring(0, 150) + '...', // Simple summary
            conteudo: content,
            imagem: publicUrl,
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

        const snapshot = await db.collection('news')
            .orderBy('data', 'desc')
            .limit(3) // Fetch only latest 3
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

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
