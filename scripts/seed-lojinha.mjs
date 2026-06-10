/**
 * seed-lojinha.mjs
 * Cadastra as duas camisetas iniciais (Rosa e Azul) no Firestore
 * com a grade de tamanhos e quantidades do Lote 1.
 *
 * RODAR:
 *   node --use-system-ca --env-file=.env.local scripts/seed-lojinha.mjs
 */

import admin from 'firebase-admin'

// Preço padrão da camiseta
const PRECO_PADRAO = 45.00

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
        })
    })
}

const SEED_PRODUCTS = [
    {
        nome: "Camiseta Rosa APCC",
        cor: "Rosa",
        descricao: "Camiseta oficial da campanha APCC na cor rosa. Vista essa causa e apoie nossos pacientes!",
        preco: PRECO_PADRAO,
        fotoUrl: "https://placehold.co/600x600/db2777/ffffff?text=Camiseta+Rosa",
        ativo: true,
        tamanhos: [
            { tamanho: "12", quantidade: 8 },
            { tamanho: "14", quantidade: 28 },
            { tamanho: "16", quantidade: 22 },
            { tamanho: "PP", quantidade: 60 },
            { tamanho: "M",  quantidade: 63 },
            { tamanho: "G",  quantidade: 47 },
            { tamanho: "GG", quantidade: 28 },
            { tamanho: "X1", quantidade: 12 },
            { tamanho: "X2", quantidade: 5 }
        ]
    },
    {
        nome: "Camiseta Azul APCC",
        cor: "Azul",
        descricao: "Camiseta oficial da campanha APCC na cor azul. Vista essa causa e apoie nossos pacientes!",
        preco: PRECO_PADRAO,
        fotoUrl: "https://placehold.co/600x600/2563eb/ffffff?text=Camiseta+Azul",
        ativo: true,
        tamanhos: [
            { tamanho: "12", quantidade: 3 },
            { tamanho: "14", quantidade: 7 },
            { tamanho: "16", quantidade: 8 },
            { tamanho: "PP", quantidade: 28 },
            { tamanho: "M",  quantidade: 45 },
            { tamanho: "G",  quantidade: 30 },
            { tamanho: "GG", quantidade: 25 },
            { tamanho: "X1", quantidade: 10 },
            { tamanho: "X2", quantidade: 0 }
        ]
    }
];

async function main() {
    console.log('🔧 Inicializando Firebase...')
    const app = initFirebase()
    const { getFirestore } = await import('firebase-admin/firestore')
    const db = getFirestore(app)

    console.log('📊 Verificando se produtos já existem...')
    const snapshot = await db.collection('produtos').get()

    if (snapshot.size > 0) {
        console.log(`⚠️  Já existem ${snapshot.size} produtos cadastrados. Pulando seed...`)
        process.exit(0)
    }

    console.log('🌱 Cadastrando produtos e inserindo movimentações de entrada do Lote 1...')

    for (const prod of SEED_PRODUCTS) {
        const docRef = await db.collection('produtos').add({
            ...prod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        // Registra a movimentação de entrada inicial
        await db.collection('movimentacoes').add({
            tipo: "entrada",
            produtoId: docRef.id,
            produtoNome: prod.nome,
            itens: prod.tamanhos,
            origem: "central",
            responsavel: "Seed Script (Lote 1)",
            observacao: "Entrada inicial de estoque - Lote 1",
            data: new Date().toISOString(),
            createdAt: new Date().toISOString()
        })

        console.log(`✅ Produto '${prod.nome}' cadastrado com sucesso! ID: ${docRef.id}`)
    }

    console.log('🌱 Seed finalizado com sucesso!')
    process.exit(0)
}

main().catch(e => { console.error('❌ ERRO FATAL:', e.message); process.exit(1) })
