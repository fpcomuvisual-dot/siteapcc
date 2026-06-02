'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Newspaper } from 'lucide-react'

interface Props {
    src: string
    alt: string
    categoria: string
}

export function CoverImage({ src, alt, categoria }: Props) {
    const [failed, setFailed] = useState(false)

    if (!src || failed) {
        return (
            <div className="w-full h-56 md:h-80 rounded-2xl mb-10 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex flex-col items-center justify-center gap-3 shadow-inner">
                <Newspaper className="h-16 w-16 text-primary/30" />
                <span className="text-sm text-muted-foreground font-medium">{categoria}</span>
            </div>
        )
    }

    return (
        <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-xl">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
                onError={() => setFailed(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
    )
}
