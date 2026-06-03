import { getNewsBySlug } from '@/app/admin/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoverImage } from '@/components/features/CoverImage';
import { NewsGallery } from '@/components/features/NewsGallery';
import sanitizeHtml from 'sanitize-html';

export const revalidate = 60;

// Não permitimos <img> inline: as imagens do WordPress apontam para apccppta.com.br
// e aparecem quebradas. A foto de capa já é servida pelo Firebase Storage separadamente.
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
    allowedTags: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a',
        'blockquote', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'hr',
    ],
    allowedAttributes: {
        a: ['href', 'target', 'rel'],
        '*': ['class'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
};

function safeHtml(raw: unknown): string {
    try {
        return sanitizeHtml(String(raw ?? ''), SANITIZE_OPTS);
    } catch {
        return String(raw ?? '').replace(/<[^>]*>/g, '');
    }
}

function safeDate(raw: unknown): string {
    if (!raw) return '';
    try {
        const d = new Date(raw as string);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return '';
    }
}

function displayCategory(cat: unknown): string {
    const c = String(cat ?? '');
    if (!c || c === 'Uncategorized' || c === 'uncategorized' || c === 'Sem categoria') return 'Notícia';
    return c;
}

function isValidHttpUrl(s: unknown): boolean {
    try {
        const url = new URL(String(s ?? ''));
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
    try {
        const { slug } = await params;
        const noticia = await getNewsBySlug(slug);
        if (!noticia) return { title: 'Notícia não encontrada | APCC' };
        return {
            title: `${noticia.titulo || 'Notícia'} | APCC`,
            description: noticia.resumo || '',
            openGraph: {
                title: noticia.titulo || 'APCC',
                description: noticia.resumo || '',
                images: isValidHttpUrl(noticia.imagem) ? [{ url: noticia.imagem as string }] : [],
                type: 'article' as const,
            },
        };
    } catch {
        return { title: 'APCC' };
    }
}

export default async function NoticiaPage({ params }: Props) {
    const { slug } = await params;

    let noticia: Record<string, unknown> | null = null;
    try {
        noticia = await getNewsBySlug(slug);
    } catch {
        notFound();
    }

    if (!noticia) notFound();

    const titulo    = String(noticia.titulo ?? '');
    const categoria = displayCategory(noticia.categoria);
    const dataStr   = safeDate(noticia.data);
    const imagem    = isValidHttpUrl(noticia.imagem) ? String(noticia.imagem) : '';
    const resumo    = String(noticia.resumo ?? '');
    const galeria   = Array.isArray(noticia.galeria)
        ? noticia.galeria.filter((item): item is string => typeof item === 'string' && isValidHttpUrl(item))
        : [];
    const cleanHtml = safeHtml(noticia.conteudo);

    return (
        <div className="min-h-screen bg-background">
            {/* Barra de navegação do artigo */}
            <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-16 z-30">
                <div className="container mx-auto px-4 max-w-3xl py-3">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary -ml-2" asChild>
                        <Link href="/noticias">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Notícias
                        </Link>
                    </Button>
                </div>
            </div>

            <article className="container mx-auto px-4 max-w-3xl py-10">

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        <Tag className="h-3 w-3" />
                        {categoria}
                    </span>
                    {dataStr && (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            {dataStr}
                        </span>
                    )}
                </div>

                {/* Título */}
                <h1 className="text-3xl md:text-5xl font-black text-foreground mb-5 leading-tight tracking-tight">
                    {titulo || 'Sem título'}
                </h1>

                {/* Resumo destacado */}
                {resumo && (
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4 italic">
                        {resumo}
                    </p>
                )}

                {/* Foto de capa — client component com fallback onError */}
                <CoverImage src={imagem} alt={titulo} categoria={categoria} />

                {/* Corpo do artigo */}
                {cleanHtml ? (
                    <div
                        className="prose prose-lg max-w-none
                            prose-headings:font-black prose-headings:text-foreground
                            prose-p:text-foreground/80 prose-p:leading-relaxed
                            prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-foreground prose-strong:font-bold
                            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                            prose-ul:text-foreground/80 prose-ol:text-foreground/80
                            prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />
                ) : (
                    <p className="text-muted-foreground italic text-center py-12">
                        Conteúdo não disponível.
                    </p>
                )}

                {galeria.length > 0 && (
                    <div className="mt-16">
                        <NewsGallery images={galeria} />
                    </div>
                )}

                {/* Rodapé do artigo */}
                <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                    <Button variant="outline" asChild>
                        <Link href="/noticias">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Ver todas as notícias
                        </Link>
                    </Button>
                    <Button variant="ghost" className="text-primary" asChild>
                        <Link href="/doar">
                            Doe agora
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </article>
        </div>
    );
}
