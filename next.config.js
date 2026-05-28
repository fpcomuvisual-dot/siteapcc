/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async headers() {
        return []
    },

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'storage.googleapis.com' },
            { protocol: 'https', hostname: 'apccppta.com.br' },
        ],
    },

    compress: true,
    poweredByHeader: false,
    generateEtags: true,
}

module.exports = nextConfig
