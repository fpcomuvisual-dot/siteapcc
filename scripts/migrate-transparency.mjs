/**
 * migrate-transparency.mjs
 * Lê os 48 PDFs da pasta transparencia do backup do cPanel,
 * faz upload ao Firebase Storage e grava os docs no Firestore.
 *
 * RODAR:
 *   node --use-system-ca --env-file=.env.local scripts/migrate-transparency.mjs
 *
 * Para re-enviar tudo (sem pular quem já existe):
 *   FORCE=1 node --use-system-ca --env-file=.env.local scripts/migrate-transparency.mjs
 */

import { readdirSync, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { join, resolve, extname, basename } from 'path'
import admin from 'firebase-admin'

// ─── Caminhos ─────────────────────────────────────────────────────────────────
const ROOT         = resolve(import.meta.dirname, '..')
const TRANSP_DIR   = join(ROOT, 'backup-6.1.2026_21-17-35_apccpp69',
                                'homedir', 'public_html',
                                'wp-content', 'uploads', 'transparencia')
const FORCE        = process.env.FORCE === '1'

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

// ─── Categorização por nome de arquivo ────────────────────────────────────────
function categorize(filename) {
    const f = filename.toLowerCase()

    if (f.includes('estatuto'))                                      return 'Estatuto'
    if (f.startsWith('ata') || f.includes('assembleia') ||
        f.includes('assembléia') || f.includes('assemblÉia'))       return 'Atas'
    if (f.includes('parecer'))                                       return 'Pareceres'
    if (f.startsWith('rp') || f.includes(' rp ') ||
        f.includes('rp-') || f.includes('-rp-') ||
        f.includes('relat'))                                         return 'Prestação de Contas'
    if (f.includes('extrato'))                                       return 'Demonstrações Financeiras'
    if (f.includes('certid') || f.includes('certificado') ||
        f.includes('utilidade') || f.includes('apostilamento') &&
        f.startsWith('certid'))                                      return 'Certidões'
    if (f.includes('declara'))                                       return 'Declarações'
    if (f.includes('plano') || f.includes('p trab') ||
        f.startsWith('pl ') || f.startsWith('pl_') ||
        f.includes('pl proosta') || f.includes('pl proposta'))       return 'Planos de Trabalho'
    if (f.includes('termo') || f.includes('aditivo') ||
        f.startsWith('tf ') || f.startsWith('tf\t') ||
        /^tf\s/.test(f) || f.includes(' tf ') ||
        f.includes('fomento') || /^tf\d/.test(f))                    return 'Termos de Fomento'

    return 'Outros'
}

// ─── Extrai ano do nome do arquivo ────────────────────────────────────────────
function extractYear(filename) {
    const m = filename.match(/20(2[0-9])/g)
    if (m) return parseInt(m[m.length - 1]) // usa o último ano encontrado (mais provável ser o doc)
    return new Date().getFullYear()
}

// ─── Sanitiza nome para Storage (sem espaços/acentos) ────────────────────────
function sanitizeStorageName(filename) {
    return filename
        .normalize('NFD').replace(/[̀-ͯ]/g, '')   // remove acentos
        .replace(/[^\w\s.-]/g, '')                   // remove chars especiais exceto . e -
        .replace(/\s+/g, '-')                        // espaços → hífens
        .replace(/-+/g, '-')                         // hífens duplos
        .toLowerCase()
}

// ─── Título legível a partir do nome ─────────────────────────────────────────
function toTitle(filename) {
    return filename
        .replace(/\.pdf0?$/i, '')  // remove extensão
        .replace(/_/g, ' ')
        .trim()
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔧 Inicializando Firebase...')
    const app    = initFirebase()
    const { getFirestore } = await import('firebase-admin/firestore')
    const { getStorage }   = await import('firebase-admin/storage')
    const db     = getFirestore(app)
    const bucket = getStorage(app).bucket()

    // Verificar pasta
    if (!existsSync(TRANSP_DIR)) {
        console.error('❌ Pasta não encontrada:', TRANSP_DIR); process.exit(1)
    }

    const files = readdirSync(TRANSP_DIR).filter(f =>
        f.toLowerCase().endsWith('.pdf') || f.toLowerCase().endsWith('.pdf0')
    )
    console.log(`📁 ${files.length} PDFs encontrados em ${TRANSP_DIR}\n`)

    // Carregar docs existentes para idempotência
    const existingSnap = await db.collection('transparency_docs')
        .where('origem', '==', 'wordpress').get()
    const existingNames = new Set(existingSnap.docs.map(d => d.data().arquivoOriginal))
    console.log(`📊 ${existingNames.size} docs já existem no Firestore\n`)

    let enviados = 0, pulados = 0, falhas = 0, sem_arquivo = 0

    for (const filename of files) {
        const titulo    = toTitle(filename)
        const categoria = categorize(filename)
        const ano       = extractYear(filename)

        if (!FORCE && existingNames.has(filename)) {
            console.log(`⏭️   já existe — pula: ${titulo.slice(0, 55)}`)
            pulados++; continue
        }

        const localPath = join(TRANSP_DIR, filename)
        if (!existsSync(localPath)) {
            console.log(`📭  não encontrado: ${filename}`)
            sem_arquivo++; continue
        }

        try {
            // Sanitiza extensão (.pdf0 → .pdf)
            const ext          = filename.toLowerCase().endsWith('.pdf0') ? '.pdf' : extname(filename)
            const storageName  = sanitizeStorageName(basename(filename, extname(filename))) + ext
            const storagePath  = `transparency/${storageName}`
            const fileRef      = bucket.file(storagePath)

            const buffer = await readFile(localPath)
            await fileRef.save(buffer, { metadata: { contentType: 'application/pdf' } })

            const arquivoUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

            await db.collection('transparency_docs').add({
                titulo,
                categoria,
                ano,
                arquivo:         arquivoUrl,
                descricao:       '',
                data:            new Date().toISOString(),
                createdAt:       new Date().toISOString(),
                origem:          'wordpress',
                arquivoOriginal: filename,
            })

            console.log(`📤  [${categoria}/${ano}] ${titulo.slice(0, 50)}`)
            enviados++
        } catch (e) {
            console.error(`❌  falha: ${filename} — ${e.message}`)
            falhas++
        }
    }

    console.log('\n─────────────────────────────────────')
    console.log('✅  RESUMO FINAL')
    console.log(`   Enviados ao Storage + Firestore: ${enviados}`)
    console.log(`   Já existiam (pulados):           ${pulados}`)
    console.log(`   Sem arquivo no backup:           ${sem_arquivo}`)
    console.log(`   Falhas:                          ${falhas}`)
    console.log('─────────────────────────────────────')
    process.exit(0)
}

main().catch(e => { console.error('❌  ERRO FATAL:', e.message); process.exit(1) })
