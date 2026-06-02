/**
 * relink-images.mjs
 * Lê o dump SQL do WordPress, mapeia wpId → arquivo de imagem no backup do cPanel,
 * sobe cada foto para o Firebase Storage e atualiza o campo `imagem` no Firestore.
 *
 * COMO RODAR:
 *   node --use-system-ca --env-file=.env.local scripts/relink-images.mjs
 *
 * Para forçar re-envio de quem já tem imagem:
 *   FORCE=1 node --use-system-ca --env-file=.env.local scripts/relink-images.mjs
 */

import { createReadStream, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { createInterface } from 'readline'
import { resolve, extname, join, dirname, basename } from 'path'
import admin from 'firebase-admin'

// ─── Caminhos descobertos ────────────────────────────────────────────────────
const ROOT       = resolve(import.meta.dirname, '..')
const SQL_FILE   = join(ROOT, 'wordpress_backup', 'softsql.sql')
const UPLOADS    = join(ROOT, 'backup-6.1.2026_21-17-35_apccpp69',
                              'homedir', 'public_html', 'wp-content', 'uploads')
const FORCE      = process.env.FORCE === '1'

// ─── Firebase ────────────────────────────────────────────────────────────────
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

// ─── Parse SQL (linha a linha, sem carregar tudo na memória) ─────────────────
async function parseSql() {
    // thumbnailMap: wpPostId  → attachmentPostId (via _thumbnail_id)
    // fileMap:      attachId  → relativePath    (via _wp_attached_file)
    const thumbMap = new Map()
    const fileMap  = new Map()

    const rl = createInterface({ input: createReadStream(SQL_FILE, 'utf8'), crlfDelay: Infinity })

    for await (const line of rl) {
        // (meta_id, post_id, '_thumbnail_id', 'attach_id'),
        const t = line.match(/\(\d+,\s*(\d+),\s*'_thumbnail_id',\s*'(\d+)'\)/)
        if (t) thumbMap.set(Number(t[1]), Number(t[2]))

        // (meta_id, attach_id, '_wp_attached_file', 'year/month/file.jpg'),
        const f = line.match(/\(\d+,\s*(\d+),\s*'_wp_attached_file',\s*'([^']+)'\)/)
        if (f) fileMap.set(Number(f[1]), f[2])
    }

    return { thumbMap, fileMap }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MIME = { '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png',
               '.webp':'image/webp', '.gif':'image/gif', '.svg':'image/svg+xml' }

function mime(p) { return MIME[extname(p).toLowerCase()] || 'image/jpeg' }

/** Localiza o arquivo original (sem sufixo de thumb) */
function findFile(relPath) {
    const full = join(UPLOADS, relPath)
    if (existsSync(full)) return full

    // Tenta remover sufixo de miniatura: "foo-300x200.jpg" → "foo.jpg"
    const ext  = extname(relPath)
    const base = basename(relPath, ext).replace(/-\d+x\d+$/, '') + ext
    const orig = join(UPLOADS, dirname(relPath), base)
    return existsSync(orig) ? orig : null
}

/** Extrai caminho relativo de uma URL do WordPress */
function urlToRelPath(url) {
    const m = url.match(/\/uploads\/(.+)$/)
    return m ? m[1] : null
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔧 Inicializando Firebase...')
    const app  = initFirebase()
    const { getFirestore } = await import('firebase-admin/firestore')
    const { getStorage }   = await import('firebase-admin/storage')
    const db     = getFirestore(app)
    const bucket = getStorage(app).bucket()

    console.log(`📖 Parseando SQL: ${SQL_FILE}`)
    const { thumbMap, fileMap } = await parseSql()
    console.log(`   ${thumbMap.size} registros _thumbnail_id`)
    console.log(`   ${fileMap.size}  registros _wp_attached_file\n`)

    console.log('📰 Lendo coleção news do Firestore...')
    const snap = await db.collection('news').get()
    console.log(`   ${snap.size} documentos\n`)

    let enviadas = 0, puladas = 0, sem_arquivo = 0, falhas = 0

    for (const doc of snap.docs) {
        const d      = doc.data()
        const wpId   = d.wpId
        const titulo = (d.titulo || '(sem título)').slice(0, 55)

        if (!wpId) {
            console.log(`⏭️   sem wpId — pula: ${titulo}`)
            puladas++; continue
        }

        const jaTemImagem = d.imagem && String(d.imagem).includes('storage.googleapis.com')
        if (!FORCE && jaTemImagem) {
            console.log(`✅  já tem imagem — pula: ${titulo}`)
            puladas++; continue
        }

        // ── Estratégia A: SQL → thumbnail_id → attached_file ──────────────
        let localFile = null

        const attachId = thumbMap.get(wpId)
        if (attachId) {
            const relPath = fileMap.get(attachId)
            if (relPath) localFile = findFile(relPath)
        }

        // ── Estratégia B: extrair URL do campo imagem ou do conteúdo ──────
        if (!localFile) {
            const candidates = []
            if (d.imagem)   candidates.push(d.imagem)
            if (d.conteudo) {
                const imgs = d.conteudo.match(/https?:\/\/apccppta\.com\.br\/wp-content\/uploads\/[^"'\s<>]+/g) || []
                candidates.push(...imgs)
            }
            for (const url of candidates) {
                const rel = urlToRelPath(url)
                if (!rel) continue
                const f = findFile(rel)
                if (f) { localFile = f; break }
            }
        }

        if (!localFile) {
            console.log(`📭  sem arquivo local (wpId=${wpId}): ${titulo}`)
            sem_arquivo++; continue
        }

        // ── Upload para Storage + update Firestore ────────────────────────
        try {
            const ext      = extname(localFile)
            const filename = `news/wp-${wpId}${ext}`
            const fileRef  = bucket.file(filename)
            const buffer   = await readFile(localFile)

            await fileRef.save(buffer, { metadata: { contentType: mime(localFile) } })
            const url = `https://storage.googleapis.com/${bucket.name}/${filename}`
            await doc.ref.update({ imagem: url })

            console.log(`📤  enviado (wpId=${wpId}): ${titulo}`)
            enviadas++
        } catch (e) {
            console.error(`❌  falha (wpId=${wpId}): ${titulo} — ${e.message}`)
            falhas++
        }
    }

    console.log('\n─────────────────────────────────────')
    console.log(`✅  RESUMO FINAL`)
    console.log(`   Enviadas ao Storage:    ${enviadas}`)
    console.log(`   Já tinham imagem (skip): ${puladas}`)
    console.log(`   Sem arquivo no backup:   ${sem_arquivo}`)
    console.log(`   Falhas de upload:        ${falhas}`)
    console.log(`   TOTAL com imagem agora:  ${enviadas + (puladas - (snap.size - enviadas - sem_arquivo - falhas - puladas) < 0 ? 0 : 0)}`)
    console.log('─────────────────────────────────────')
    process.exit(0)
}

main().catch(e => { console.error('❌  ERRO FATAL:', e.message); process.exit(1) })
