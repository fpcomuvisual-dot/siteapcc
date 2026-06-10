import { getAllNewsItems } from '@/app/admin/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Newspaper } from 'lucide-react';

function displayCategory(cat: unknown): string {
    const c = String(cat ?? '');
    if (!c || c === 'Uncategorized' || c === 'uncategorized' || c === 'Sem categoria') return 'Notícia';
    return c;
}

export const revalidate = 60;

export const metadata = {
    title: 'Notícias | APCC',
    description: 'Acompanhe as últimas notícias da Associação Paraguaçuense de Combate ao Câncer.',
};

export default async function NoticiasPage() {
    const news = await getAllNewsItems();

    return (
        <div className="min-h-screen bg-background">
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Newspaper className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-5xl font-black text-foreground mb-4">
                            <span className="text-primary">Notícias</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Fique por dentro das nossas ações, campanhas e histórias de superação.
                        </p>
                    </div>

                    {news.length === 0 ? (
                        <p className="text-center text-muted-foreground py-16">
                            Nenhuma notícia encontrada.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((noticia: any) => (
                                <Link
                                    key={noticia.id}
                                    href={`/noticias/${noticia.slug ?? noticia.id}`}
                                    className="block h-full"
                                >
                                    <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden h-full shadow-md hover:shadow-lg">
                                        <div className="relative h-48 bg-muted overflow-hidden">
                                            {noticia.imagem && String(noticia.imagem).startsWith('http') ? (
                                                <Image
                                                    src={noticia.imagem}
                                                    alt={noticia.titulo ?? ''}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    style={{ objectPosition: noticia.focalPointY !== undefined ? `50% ${noticia.focalPointY}%` : 'center' }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                    <Newspaper className="h-12 w-12 text-primary/20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                                    {displayCategory(noticia.categoria)}
                                                </span>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardDescription className="text-muted-foreground text-sm">
                                                {noticia.data ? new Date(noticia.data).toLocaleDateString('pt-BR', {
                                                    day: '2-digit', month: 'long', year: 'numeric',
                                                }) : ''}
                                            </CardDescription>
                                            <CardTitle className="text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {noticia.titulo}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-4 line-clamp-3">{noticia.resumo}</p>
                                            <span className="inline-flex items-center text-primary text-sm font-medium">
                                                Ler mais <ArrowRight className="ml-1 h-4 w-4" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
