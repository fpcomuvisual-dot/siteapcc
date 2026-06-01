import { searchContent } from '@/app/admin/actions'
import Link from 'next/link'
import { FileText, Newspaper, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = { title: 'Busca | APCC' }

type Props = { searchParams: Promise<{ q?: string }> }

export default async function BuscaPage({ searchParams }: Props) {
    const { q = '' } = await searchParams
    const results = q.length >= 2 ? await searchContent(q) : { news: [], docs: [] }
    const total = results.news.length + results.docs.length

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                    <Search className="h-7 w-7 text-primary shrink-0" />
                    <h1 className="text-3xl font-black text-foreground">
                        {q ? <>Resultados para: <span className="text-primary">&ldquo;{q}&rdquo;</span></> : 'Busca'}
                    </h1>
                </div>

                {q.length > 0 && q.length < 2 ? (
                    <p className="text-muted-foreground mt-4">Digite pelo menos 2 caracteres para buscar.</p>
                ) : !q ? (
                    <p className="text-muted-foreground mt-4">Use a lupa no menu para buscar notícias e documentos.</p>
                ) : total === 0 ? (
                    <div className="mt-12 text-center text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Nenhum resultado para <strong>&ldquo;{q}&rdquo;</strong>.</p>
                        <p className="text-sm mt-2">Tente outras palavras-chave.</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-10">
                        <p className="text-sm text-muted-foreground">{total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>

                        {results.news.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                                    <Newspaper className="h-5 w-5 text-primary" />
                                    Notícias ({results.news.length})
                                </h2>
                                <div className="space-y-3">
                                    {(results.news as any[]).map(n => (
                                        <Link key={n.id} href={`/noticias/${n.slug ?? n.id}`}>
                                            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                                                <CardContent className="p-4">
                                                    <span className="text-xs font-semibold text-primary">{n.categoria}</span>
                                                    <p className="font-semibold text-foreground mt-0.5">{n.titulo}</p>
                                                    {n.resumo && (
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.resumo}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {new Date(n.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.docs.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Documentos de Transparência ({results.docs.length})
                                </h2>
                                <div className="space-y-3">
                                    {(results.docs as any[]).map(d => (
                                        <a key={d.id} href={d.arquivo} target="_blank" rel="noopener noreferrer">
                                            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                                                <CardContent className="p-4">
                                                    <span className="text-xs font-semibold text-primary">
                                                        {d.categoria} · {d.ano}
                                                    </span>
                                                    <p className="font-semibold text-foreground mt-0.5">{d.titulo}</p>
                                                    {d.descricao && (
                                                        <p className="text-sm text-muted-foreground mt-1">{d.descricao}</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
