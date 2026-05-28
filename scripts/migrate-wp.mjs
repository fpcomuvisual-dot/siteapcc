/**
 * Importa as notícias do WordPress antigo (apccppta.com.br) para o
 * Firestore + Firebase Storage, no MESMO formato usado pelo seu admin.
 *
 * Coleção "news": { titulo, categoria, data, resumo, conteudo, imagem, createdAt }
 * (este script adiciona também: wpId, slug, origem — úteis p/ evitar
 *  duplicatas em re-execuções e p/ montar redirecionamentos depois.)
 *
 * COMO RODAR (na raiz do projeto):
 *   node --env-file=.env.local scripts/migrate-wp.mjs
 * Rodar de novo NÃO duplica: ele pula posts já importados (pelo wpId).
 */

import admin from 'firebase-admin'

const WP_BASE = process.env.WP_BASE_URL || 'https://apccppta.com.br'
const STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET ||
  `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
const FALLBACK_IMAGE = process.env.FALLBACK_IMAGE || ''

function initFirebase() {
  if (admin.apps.length) return admin.app()
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.error('❌ Faltam variáveis FIREBASE_* no .env.local')
    process.exit(1)
  }
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: STORAGE_BUCKET,
  })
}

const decodeEntities = (s = '') =>
  s
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, '–')
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .trim()

const stripHtml = (html = '') =>
  decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim()

const makeResumo = (post) => {
  const base = stripHtml(post.excerpt?.rendered) || stripHtml(post.content?.rendered)
  return base.length > 150 ? base.slice(0, 150).trim() + '...' : base
}

const getCategoria = (post) => {
  const terms = post._embedded?.['wp:term']?.flat() || []
  const cat = terms.find((t) => t?.taxonomy === 'category' && t.name !== 'Sem categoria')
  return cat ? decodeEntities(cat.name) : 'Notícia'
}

const getFeaturedUrl = (post) =>
  post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null

async function fetchAllPosts() {
  const all = []
  let page = 1
  while (true) {
    const url = `${WP_BASE}/wp-json/wp/v2/posts?_embed&per_page=100&page=${page}&status=publish`
    const res = await fetch(url)
    if (res.status === 400) break
    if (!res.ok) throw new Error(`WP API erro ${res.status} em ${url}`)
    const batch = await res.json()
    if (!batch.length) break
    all.push(...batch)
    const totalPages = Number(res.headers.get('x-wp-totalpages') || page)
    if (page >= totalPages) break
    page++
  }
  return all
}

async function uploadImage(bucket, imageUrl, wpId) {
  if (!imageUrl) return FALLBACK_IMAGE
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const ext = (imageUrl.split('.').pop() || 'jpg').split('?')[0].slice(0, 5)
    const filename = `news/wp-${wpId}-${Date.now()}.${ext}`
    const fileRef = bucket.file(filename)
    await fileRef.save(buffer, { metadata: { contentType } })
    await fileRef.makePublic()
    return `https://storage.googleapis.com/${bucket.name}/${filename}`
  } catch (e) {
    console.warn(`  ⚠️  imagem do post ${wpId} falhou (${e.message}); usando fallback`)
    return FALLBACK_IMAGE
  }
}

async function main() {
  const app = initFirebase()
  const { getFirestore } = await import('firebase-admin/firestore')
  const { getStorage } = await import('firebase-admin/storage')
  const db = getFirestore(app)
  const bucket = getStorage(app).bucket()

  console.log(`📥 Buscando posts em ${WP_BASE} ...`)
  const posts = await fetchAllPosts()
  console.log(`   ${posts.length} posts encontrados.\n`)

  const existing = new Set()
  const snap = await db.collection('news').where('origem', '==', 'wordpress').get()
  snap.forEach((d) => existing.add(d.data().wpId))

  let importados = 0
  let pulados = 0

  for (const post of posts) {
    const titulo = decodeEntities(post.title?.rendered) || '(sem título)'
    if (existing.has(post.id)) {
      pulados++
      console.log(`⏭️  já existe: ${titulo}`)
      continue
    }
    console.log(`➡️  importando: ${titulo}`)
    const imagem = await uploadImage(bucket, getFeaturedUrl(post), post.id)

    await db.collection('news').add({
      titulo,
      categoria: getCategoria(post),
      data: post.date,
      resumo: makeResumo(post),
      conteudo: post.content?.rendered || '',
      imagem,
      createdAt: new Date().toISOString(),
      wpId: post.id,
      slug: post.slug,
      origem: 'wordpress',
    })
    importados++
  }

  console.log(`\n✅ Concluído. Importados: ${importados} | Já existiam: ${pulados}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('\n❌ Erro na migração:', e)
  process.exit(1)
})
