import { getNewsBySlug } from '@/app/admin/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sanitizeHtml from 'sanitize-html';

export const revalidate = 60;

// Tags e atributos permitidos no corpo das matérias
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
    allowedTags: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u',
        'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img',
        'blockquote', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
    ],
    allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height', 'loading'],
        '*': ['class'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
};

function safeHtml(raw: unknown): string {
    try {
        return sanitizeHtml((raw as string) ?? '', SANITIZE_OPTS);
    } catch {
        // Fallback: remove todas as tags se sanitize-html falhar
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

    const titulo = String(noticia.titulo ?? '');
    const categoria = displayCategory(noticia.categoria);
    const dataStr = safeDate(noticia.data);
    const imagem = isValidHttpUrl(noticia.imagem) ? String(noticia.imagem) : '';
    const cleanHtml = safeHtml(noticia.conteudo);

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
                        {categoria}
                    </span>
                    {dataStr && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                            <Calendar className="h-3 w-3" />
                            {dataStr}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
                    {titulo || 'Sem título'}
                </h1>

                {imagem ? (
                    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10 shadow-lg">
                        <Image
                            src={imagem}
                            alt={titulo}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-full h-48 rounded-xl mb-10 bg-muted flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                )}

                {/* TODO: imagens inline no conteúdo ainda apontam para apccppta.com.br.
                    Se o WordPress sair do ar, essas imagens quebrarão. Melhoria futura:
                    re-hospedar imagens do corpo no Firebase Storage. */}
                {cleanHtml ? (
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />
                ) : (
                    <p className="text-muted-foreground italic">Conteúdo não disponível.</p>
                )}
            </article>
        </div>
    );
}
