import { getNewsBySlug } from '@/app/admin/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'isomorphic-dompurify';

export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const noticia = await getNewsBySlug(slug);
    if (!noticia) return {};
    return {
        title: `${noticia.titulo} | APCC`,
        description: noticia.resumo,
        openGraph: {
            title: noticia.titulo,
            description: noticia.resumo,
            images: noticia.imagem ? [{ url: noticia.imagem }] : [],
            type: 'article',
        },
    };
}

export default async function NoticiaPage({ params }: Props) {
    const { slug } = await params;
    const noticia = await getNewsBySlug(slug);

    if (!noticia) notFound();

    // TODO: imagens dentro do corpo ainda apontam para apccppta.com.br.
    // A capa já está no Firebase Storage, mas imagens inline quebrarão se o WordPress sair do ar.
    // Melhoria futura: re-hospedar imagens inline no Storage.
    const cleanHtml = DOMPurify.sanitize(noticia.conteudo || '');

    return (
        <div className="min-h-screen bg-background">
            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary -ml-2" asChild>
                        <Link href="/noticias">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Notícias
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        <Tag className="h-3 w-3" />
                        {noticia.categoria}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(noticia.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
                    {noticia.titulo}
                </h1>

                {noticia.imagem && (
                    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10 shadow-lg">
                        <Image
                            src={noticia.imagem}
                            alt={noticia.titulo}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
            </article>
        </div>
    );
}
