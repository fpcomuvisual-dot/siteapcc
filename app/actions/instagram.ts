'use server'

import { getInstagramFeed } from '@/lib/instagram'

export async function fetchInstagramFeed() {
    // This action can be called from Client Components
    const posts = await getInstagramFeed()
    return posts
}
