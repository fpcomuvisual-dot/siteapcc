'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogClose,
    DialogTitle,
} from '@/components/ui/dialog'

interface NewsGalleryProps {
    images: string[];
}

export function NewsGallery({ images }: NewsGalleryProps) {
    const [open, setOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleOpen = (index: number) => {
        setCurrentIndex(index)
        setOpen(true)
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Galeria</h2>
                    <p className="text-sm text-muted-foreground">Clique nas imagens para ampliar e navegar entre as fotos.</p>
                </div>
                <p className="text-xs text-slate-500">A capa permanece exclusiva nos cards e na abertura da matéria.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((src, index) => (
                    <button
                        type="button"
                        key={`${src}-${index}`}
                        onClick={() => handleOpen(index)}
                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition-shadow hover:shadow-xl"
                    >
                        <div className="relative aspect-[4/3] w-full">
                            <Image
                                src={src}
                                alt={`Foto ${index + 1}`}
                                fill
                                className="object-cover transition duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </button>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 shadow-2xl rounded-3xl max-w-6xl mx-auto bg-transparent">
                    <DialogOverlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
                    <div className="relative z-20 mx-auto flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                            <div>
                                <DialogTitle className="text-base font-bold text-white">Foto {currentIndex + 1} de {images.length}</DialogTitle>
                                <p className="text-xs text-slate-400">Use as setas ou clique fora para fechar.</p>
                            </div>
                            <DialogClose asChild>
                                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                                    <X className="h-4 w-4" />
                                </button>
                            </DialogClose>
                        </div>
                        <div className="relative flex-1 overflow-hidden bg-slate-950">
                            <Image
                                src={images[currentIndex]}
                                alt={`Foto ampliada ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-950 px-4 py-3">
                            <Button variant="ghost" onClick={handlePrev} className="gap-2 text-white">
                                <ArrowLeft className="h-4 w-4" /> Anterior
                            </Button>
                            <Button variant="ghost" onClick={handleNext} className="gap-2 text-white">
                                Próxima <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
