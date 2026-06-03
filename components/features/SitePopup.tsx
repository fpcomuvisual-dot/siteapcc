'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPopupSettings } from '@/app/admin/actions'

interface PopupData {
    ativo: boolean
    titulo: string
    mensagem: string
    imagemUrl?: string
    botaoTexto?: string
    botaoLink?: string
    versao: number
}

export default function SitePopup() {
    const pathname = usePathname()
    const [popup, setPopup]   = useState<PopupData | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Não exibir no painel admin
        if (pathname?.startsWith('/admin')) return

        getPopupSettings().then((p: any) => {
            if (!p?.ativo) return
            const key = `apcc_popup_dismissed_v${p.versao}`
            if (typeof window !== 'undefined' && localStorage.getItem(key)) return
            setPopup(p as PopupData)
            setTimeout(() => setVisible(true), 1500)
        })
    }, [pathname])

    const dismiss = () => {
        setVisible(false)
        if (popup) {
            localStorage.setItem(`apcc_popup_dismissed_v${popup.versao}`, '1')
        }
    }

    if (!popup || !visible) return null

    const isExternal = popup.botaoLink?.startsWith('http')

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={dismiss}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 fade-in duration-300"
                role="dialog"
                aria-modal="true"
                aria-labelledby="popup-title"
            >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30">
                    {/* Gradiente decorativo topo */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rosa-500 to-azul-500" />

                    {/* Fechar */}
                    <button
                        onClick={dismiss}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white transition-colors shadow-sm"
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Imagem (se houver) */}
                    {popup.imagemUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={popup.imagemUrl}
                                alt={popup.titulo}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                        </div>
                    )}

                    {/* Conteúdo */}
                    <div className="px-6 pb-6 pt-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">APCC</span>
                        </div>

                        <h2 id="popup-title" className="text-xl font-black text-gray-900 mb-2 leading-tight">
                            {popup.titulo}
                        </h2>

                        <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                            {popup.mensagem}
                        </p>

                        <div className="flex gap-3">
                            {popup.botaoTexto && popup.botaoLink && (
                                isExternal ? (
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700 text-white font-bold"
                                        asChild
                                        onClick={dismiss}
                                    >
                                        <a href={popup.botaoLink} target="_blank" rel="noopener noreferrer">
                                            {popup.botaoTexto}
                                        </a>
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700 text-white font-bold"
                                        asChild
                                        onClick={dismiss}
                                    >
                                        <Link href={popup.botaoLink}>{popup.botaoTexto}</Link>
                                    </Button>
                                )
                            )}
                            <Button variant="ghost" onClick={dismiss} className="text-gray-500 hover:text-gray-900">
                                Fechar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
