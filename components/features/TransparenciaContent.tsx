'use client'

import { useState, useMemo } from 'react'
import { Download, FileText, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TRANSPARENCY_CATEGORIES } from '@/lib/constants'

type Doc = {
    id: string
    titulo: string
    categoria: string
    ano: number
    arquivo: string
    descricao?: string
    data: string
}

export default function TransparenciaContent({ docs }: { docs: Doc[] }) {
    const [filterCat, setFilterCat] = useState('')
    const [filterAno, setFilterAno] = useState('')

    const anos = useMemo(
        () => [...new Set(docs.map(d => d.ano))].sort((a, b) => b - a),
        [docs]
    )

    const filtered = useMemo(() => {
        return docs.filter(d => {
            if (filterCat && d.categoria !== filterCat) return false
            if (filterAno && String(d.ano) !== filterAno) return false
            return true
        })
    }, [docs, filterCat, filterAno])

    const grouped = useMemo(() => {
        const map: Record<string, Record<string, Doc[]>> = {}
        for (const doc of filtered) {
            if (!map[doc.categoria]) map[doc.categoria] = {}
            const ano = String(doc.ano)
            if (!map[doc.categoria][ano]) map[doc.categoria][ano] = []
            map[doc.categoria][ano].push(doc)
        }
        return map
    }, [filtered])

    if (docs.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-14 w-14 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Documentos em breve.</p>
                <p className="text-sm mt-2">Os documentos de transparência serão publicados em breve.</p>
            </div>
        )
    }

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-3 mb-8 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterCat} onValueChange={setFilterCat}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        {TRANSPARENCY_CATEGORIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterAno} onValueChange={setFilterAno}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos os anos</SelectItem>
                        {anos.map(a => (
                            <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {(filterCat || filterAno) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFilterCat(''); setFilterAno('') }}
                        className="text-muted-foreground"
                    >
                        Limpar filtros
                    </Button>
                )}

                <span className="ml-auto text-sm text-muted-foreground">
                    {filtered.length} documento{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    Nenhum documento encontrado para os filtros selecionados.
                </p>
            ) : (
                <div className="space-y-10">
                    {TRANSPARENCY_CATEGORIES.filter(cat => grouped[cat]).map(cat => (
                        <div key={cat}>
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {cat}
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(grouped[cat])
                                    .sort(([a], [b]) => Number(b) - Number(a))
                                    .map(([ano, docList]) => (
                                        <div key={ano}>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                                {ano}
                                            </h3>
                                            <div className="space-y-2">
                                                {docList.map(doc => (
                                                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4 flex items-center justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-foreground truncate">{doc.titulo}</p>
                                                                {doc.descricao && (
                                                                    <p className="text-sm text-muted-foreground mt-0.5">{doc.descricao}</p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(doc.data).toLocaleDateString('pt-BR')}
                                                                </p>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                                <a href={doc.arquivo} target="_blank" rel="noopener noreferrer">
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Baixar PDF
                                                                </a>
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
