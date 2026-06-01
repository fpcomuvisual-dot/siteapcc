import 'server-only'
import admin from 'firebase-admin'

interface FirebaseAdminConfig {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}

function formatPrivateKey(key: string) {
    if (!key) {
        console.error('[firebase-admin] FIREBASE_PRIVATE_KEY indefinido — verifique as env vars na Vercel (Settings → Environment Variables).');
        return '';
    }
    return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdminConfig) {
    const privateKey = formatPrivateKey(params.privateKey)

    if (admin.apps.length > 0) {
        return admin.app()
    }

    const cert = admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey,
    })

    return admin.initializeApp({
        credential: cert,
        projectId: params.projectId,
        // Buckets novos usam .firebasestorage.app. Defina FIREBASE_STORAGE_BUCKET no .env se necessário.
        // O bucket precisa ter leitura pública: IAM → allUsers → Storage Object Viewer
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${params.projectId}.firebasestorage.app`,
    })
}

export async function initAdmin() {
    const params = {
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    }

    return createFirebaseAdminApp(params)
}
