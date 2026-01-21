'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, ExternalLink, Instagram } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchInstagramFeed } from '@/app/actions/instagram'

interface InstagramPost {
    id: string
    caption: string
    media_url: string
    permalink: string
    timestamp: string
    like_count: number
    comments_count: number
}

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await fetchInstagramFeed()
                setPosts(data)
            } catch (error) {
                console.error("Failed to load Instagram posts", error)
            } finally {
                setLoading(false)
            }
        }
        loadPosts()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-slate-200 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div className="group relative aspect-square overflow-hidden rounded-xl bg-slate-900 cursor-pointer shadow-md">
                                {/* Image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.media_url}
                                    alt={post.caption}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-xs line-clamp-2 mb-3 font-medium">
                                            {post.caption}
                                        </p>
                                        <div className="flex items-center justify-between text-pink-400 text-xs font-bold">
                                            <div className="flex gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3 fill-current" /> {post.like_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3 fill-current" /> {post.comments_count}
                                                </span>
                                            </div>
                                            <ExternalLink className="w-3 h-3 " />
                                        </div>
                                    </div>
                                </div>

                                {/* Corner Icon */}
                                <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    <Instagram className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </a>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-pink-200"
                    asChild
                >
                    <a href="https://www.instagram.com/apccppta/" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" />
                        Ver Perfil Completo (@apccppta)
                    </a>
                </Button>
            </div>
        </div>
    )
}
