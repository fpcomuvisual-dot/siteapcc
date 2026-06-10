"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Facebook, Newspaper, ArrowRight, MapPin, Clock } from "lucide-react";
import InstagramFeed from "./InstagramFeed";
import { getNewsItems, getCalendarEvents } from "@/app/admin/actions";

function displayCategory(cat: unknown): string {
    const c = String(cat ?? '');
    if (!c || c === 'Uncategorized' || c === 'uncategorized' || c === 'Sem categoria') return 'Notícia';
    return c;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

function NewsCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full shadow-lg shadow-muted/20 animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-5 bg-muted rounded w-full mb-1" />
                <div className="h-5 bg-muted rounded w-2/3" />
            </CardHeader>
            <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-4/5" />
            </CardContent>
        </Card>
    );
}

function EventCardSkeleton() {
    return (
        <Card className="h-full shadow-lg shadow-gray-100 animate-pulse">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="space-y-1">
                        <div className="h-6 bg-muted rounded w-8" />
                        <div className="h-3 bg-muted rounded w-12" />
                    </div>
                </div>
                <div className="h-5 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
            </CardContent>
        </Card>
    );
}

export default function NoticiasEventos() {
    const [news, setNews] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        getNewsItems().then((data) => {
            setNews(data as any[]);
            setLoadingNews(false);
        });

        getCalendarEvents().then((data) => {
            const today = new Date().toISOString().split('T')[0];
            const all = data as any[];
            const upcoming = all.filter(e => e.sortDate >= today).slice(0, 3);
            setEvents(upcoming.length > 0 ? upcoming : all.slice(0, 3));
            setLoadingEvents(false);
        });
    }, []);

    return (
        <div className="bg-slate-50 py-12 md:py-16">
            <div className="container mx-auto px-4">

                {/* Redes Sociais */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeInUp}
                    className="mb-12 md:mb-16"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black text-foreground mb-4">
                            Siga-nos nas <span className="text-primary">
                                Redes Sociais
                            </span> 📱
                        </h2>
                        <p className="text-xl text-gray-600">
                            Acompanhe nosso dia a dia e histórias inspiradoras
                        </p>
                    </div>

                    <div className="w-full flex justify-center">
                        <InstagramFeed />
                    </div>
                </motion.div>

                {/* Notícias */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    variants={fadeInUp}
                    className="mb-12 md:mb-16"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black text-foreground mb-4">
                            <span className="text-primary">Notícias</span> 📰
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Fique por dentro das nossas ações e histórias
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {loadingNews
                            ? [0, 1, 2].map(i => <NewsCardSkeleton key={i} />)
                            : news.slice(0, 3).map((noticia, index) => (
                                <motion.div
                                    key={noticia.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/noticias/${noticia.slug ?? noticia.id}`} className="block h-full">
                                        <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden h-full shadow-lg shadow-muted/20">
                                            <div className="relative h-48 bg-muted overflow-hidden">
                                                {noticia.imagem && String(noticia.imagem).startsWith('http') ? (
                                                    <Image
                                                        src={noticia.imagem}
                                                        alt={noticia.titulo ?? ''}
                                                        fill
                                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                        <Newspaper className="h-12 w-12 text-primary/20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                                        {displayCategory(noticia.categoria)}
                                                    </span>
                                                </div>
                                            </div>
                                            <CardHeader>
                                                <CardDescription className="text-muted-foreground text-sm">
                                                    {noticia.data ? new Date(noticia.data).toLocaleDateString('pt-BR', {
                                                        day: '2-digit', month: 'long', year: 'numeric'
                                                    }) : ''}
                                                </CardDescription>
                                                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                                                    {noticia.titulo}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground mb-4">{noticia.resumo}</p>
                                                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 hover:bg-transparent">
                                                    Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        }
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10"
                            asChild
                        >
                            <Link href="/noticias">
                                <Newspaper className="mr-2 h-4 w-4" />
                                Ver Todas as Notícias
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Eventos */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    variants={fadeInUp}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black text-foreground mb-4">
                            Próximos <span className="text-primary">Eventos</span> 📅
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Participe das nossas ações e campanhas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {loadingEvents
                            ? [0, 1, 2].map(i => <EventCardSkeleton key={i} />)
                            : events.map((evento, index) => (
                                <motion.div
                                    key={evento.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Card className="bg-white border-azul-100 hover:border-azul-300 transition-all h-full shadow-lg shadow-gray-100">
                                        <CardHeader>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-azul-500 to-azul-600 rounded-lg flex items-center justify-center">
                                                    <Calendar className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-black text-azul-600">
                                                        {String(evento.day).padStart(2, '0')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(evento.sortDate + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                            <CardTitle className="text-gray-900">{evento.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {evento.time && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="h-4 w-4 text-azul-600" />
                                                    <span className="text-sm">{evento.time}</span>
                                                </div>
                                            )}
                                            <p className="text-gray-600 text-sm pt-2 border-t border-gray-100">
                                                {evento.description}
                                            </p>
                                            <Button
                                                className="w-full bg-gradient-to-r from-azul-600 to-rosa-600 hover:from-azul-700 hover:to-rosa-700 mt-4 text-white"
                                                asChild
                                            >
                                                <Link href="/calendario">Ver Calendário</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        }
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            className="border-azul-500 text-azul-400 hover:bg-azul-500/10"
                            asChild
                        >
                            <Link href="/calendario">
                                <Calendar className="mr-2 h-4 w-4" />
                                Ver Calendário Completo
                            </Link>
                        </Button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
