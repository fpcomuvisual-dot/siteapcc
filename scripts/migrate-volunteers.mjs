/**
 * migrate-volunteers.mjs
 * Lê os voluntários locais do array estático da página sobre,
 * faz o upload das imagens locais da pasta public/voluntarios para o Firebase Storage
 * e insere os documentos correspondentes na coleção 'volunteers' do Firestore.
 *
 * RODAR:
 *   node --use-system-ca --env-file=.env.local scripts/migrate-volunteers.mjs
 *
 * Para forçar o re-upload de tudo (limpando a coleção existente antes ou sobrescrevendo):
 *   FORCE=1 node --use-system-ca --env-file=.env.local scripts/migrate-volunteers.mjs
 */

import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { join, resolve } from 'path'
import admin from 'firebase-admin'

// ─── Caminhos ─────────────────────────────────────────────────────────────────
const ROOT = resolve(import.meta.dirname, '..')
const VOLS_DIR = join(ROOT, 'public', 'voluntarios')
const FORCE = process.env.FORCE === '1'

const fallbackVolunteers = [
    { nome: "Ana Luiza Henrique da Silva", role: "Voluntário(a)", imgFile: "ana-luiza-henrique-da-silva.png", ordem: 1 },
    { nome: "Aparecida de Jesus Tomazini Pelegrini", role: "Voluntário(a)", imgFile: "aparecida-de-jesus-tomazini-pelegrini.png", ordem: 2 },
    { nome: "Eliane Cardozo Salum", role: "Voluntário(a)", imgFile: "eliane-cardozo-salum.png", ordem: 3 },
    { nome: "Fatima AP. Moreira Lacerda", role: "Voluntário(a)", imgFile: "fatima-ap-moreira-lacerda.png", ordem: 4 },
    { nome: "Fernanda Santos Hipólito Ferreira", role: "Voluntário(a)", imgFile: "fernanda-santos-hipolito-ferreira.png", ordem: 5 },
    { nome: "Francelina Gonçalves Matheus", role: "Fundadora", imgFile: "francelina-goncalves-matheus.png", ordem: 6 },
    { nome: "Magali Pangoni Soares", role: "Voluntário(a)", imgFile: "magali-pangoni-soares.png", ordem: 7 },
    { nome: "Mara Rosana Peralta Romeiro", role: "Voluntário(a)", imgFile: "mara-rosana-peralta-romeiro.png", ordem: 8 },
    { nome: "Maria Antônia Aliotti de Lima", role: "Voluntário(a)", imgFile: "maria-antonia-aliotti-de-lima.png", ordem: 9 },
    { nome: "Maria Carolina Casanova", role: "Voluntário(a)", imgFile: "maria-carolina-casanova.png", ordem: 10 },
    { nome: "Maria Cuerin Parisotto", role: "Voluntário(a)", imgFile: "maria-cuerin-parisotto.png", ordem: 11 },
    { nome: "Maria de Lourdes Santos Bertolla", role: "Voluntário(a)", imgFile: "maria-de-lourdes-santos-bertolla.png", ordem: 12 },
    { nome: "Maria Regina Plaza", role: "Voluntário(a)", imgFile: "maria-regina-plaza.png", ordem: 13 },
    { nome: "Marlei Regina da Luz Durães", role: "Voluntário(a)", imgFile: "marlei-regina-da-luz-duraes.png", ordem: 14 },
    { nome: "Márcia Regina Deperon", role: "Atual Presidente", imgFile: "marcia-regina-deperon.png", ordem: 15 },
    { nome: "Matilde Ribeiro de Melo", role: "Voluntário(a)", imgFile: "matilde-ribeiro-de-melo.png", ordem: 16 },
    { nome: "Oclesia Maria Maróstica Hortal", role: "Voluntário(a)", imgFile: "oclesia-maria-marostica-hortal.png", ordem: 17 },
    { nome: "Sander Figueiredo Salum", role: "Voluntário(a)", imgFile: "sander-figueiredo-salum.png", ordem: 18 },
    { nome: "Silvia Affini Jorge", role: "Voluntário(a)", imgFile: "silvia-affini-jorge.png", ordem: 19 },
    { nome: "Silvia Barbosa de Sá Pinheiro", role: "Voluntário(a)", imgFile: "silvia-barbosa-de-sa-pinheiro.png", ordem: 20 }
];

// ─── Firebase ─────────────────────────────────────────────────────────────────
function initFirebase() {
    if (admin.apps.length) return admin.app()
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    if (!process.env.FIREBASE_PROJECT_ID || !privateKey) {
        console.error('❌  Faltam variáveis FIREBASE_* no .env.local'); process.exit(1)
    }
    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId:   process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ||
                       `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔧 Inicializando Firebase...')
    const app = initFirebase()
    const { getFirestore } = await import('firebase-admin/firestore')
    const { getStorage } = await import('firebase-admin/storage')
    const db = getFirestore(app)
    const bucket = getStorage(app).bucket()

    console.log(`📁 Buscando fotos na pasta local: ${VOLS_DIR}\n`)

    // Carregar voluntários existentes no Firestore para evitar duplicidade
    const existingSnap = await db.collection('volunteers').get()
    const existingNames = new Set(existingSnap.docs.map(d => d.data().nome))

    if (FORCE && existingSnap.size > 0) {
        console.log(`⚠️   FORCE=1 ativo. Limpando ${existingSnap.size} voluntários da coleção 'volunteers'...`)
        for (const doc of existingSnap.docs) {
            await doc.ref.delete()
        }
        existingNames.clear()
        console.log('✅  Coleção limpa.\n')
    }

    let enviados = 0, pulados = 0, falhas = 0, sem_arquivo = 0

    for (const vol of fallbackVolunteers) {
        if (!FORCE && existingNames.has(vol.nome)) {
            console.log(`⏭️   Voluntário(a) '${vol.nome}' já existe no Firestore. Pulando...`)
            pulados++
            continue
        }

        const localPath = join(VOLS_DIR, vol.imgFile)
        if (!existsSync(localPath)) {
            console.log(`❌  Foto não encontrada para '${vol.nome}': ${vol.imgFile}`)
            sem_arquivo++
            continue
        }

        try {
            const storagePath = `volunteers/${vol.imgFile}`
            const fileRef = bucket.file(storagePath)

            console.log(`📤  Fazendo upload da imagem de '${vol.nome}'...`)
            const buffer = await readFile(localPath)
            await fileRef.save(buffer, {
                metadata: {
                    contentType: 'image/png'
                }
            })

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

            await db.collection('volunteers').add({
                nome: vol.nome,
                role: vol.role,
                imagemUrl: publicUrl,
                ordem: vol.ordem,
                createdAt: new Date().toISOString()
            })

            console.log(`✅  Salvo com sucesso: '${vol.nome}' (Ordem: ${vol.ordem})`)
            enviados++
        } catch (e) {
            console.error(`❌  Falha ao processar '${vol.nome}': ${e.message}`)
            falhas++
        }
    }

    console.log('\n─────────────────────────────────────')
    console.log('✅  RESUMO FINAL DA MIGRAÇÃO')
    console.log(`   Migrados / Enviados:           ${enviados}`)
    console.log(`   Já cadastrados (pulados):      ${pulados}`)
    console.log(`   Fotos não localizadas:         ${sem_arquivo}`)
    console.log(`   Falhas operacionais:           ${falhas}`)
    console.log('─────────────────────────────────────')
    process.exit(0)
}

main().catch(e => { console.error('❌  ERRO FATAL:', e.message); process.exit(1) })
