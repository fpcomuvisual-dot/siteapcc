'use client'

// Para ativar o feed real:
// 1. Crie uma conta no Behold.so (behold.so) e conecte o perfil @apccppta
// 2. Copie o Feed ID e defina a variável de ambiente NEXT_PUBLIC_BEHOLD_FEED_ID
// 3. O componente exibirá automaticamente as fotos reais do Instagram
// Alternativa: usar a API oficial do Instagram via Meta for Developers (mais complexo).
// NÃO usar scraping — instável e contra os termos de serviço.

import { Instagram, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Script from 'next/script'

const BEHOLD_FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID

export default function InstagramFeed() {
    if (BEHOLD_FEED_ID) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <Script src="https://w.behold.so/widget.js" type="module" strategy="afterInteractive" />
                {/* @ts-ignore — Behold.so web component */}
                <behold-widget feed-id={BEHOLD_FEED_ID} />
                <div className="flex justify-center mt-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" asChild>
                        <a href="https://www.instagram.com/apccppta/" target="_blank" rel="noopener noreferrer">
                            <Instagram className="mr-2 h-4 w-4" />
                            Ver Perfil Completo (@apccppta)
                        </a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-pink-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Instagram className="h-6 w-6" />
                    Instagram
                </CardTitle>
                <CardDescription className="text-purple-600">@apccppta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-700">
                    Acompanhe nossas campanhas, ações e histórias de superação no Instagram.
                </p>
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    asChild
                >
                    <a href="https://www.instagram.com/apccppta/" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" />
                        Seguir @apccppta
                        <ExternalLink className="ml-2 h-3 w-3 opacity-70" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
