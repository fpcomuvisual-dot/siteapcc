import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Facebook, Newspaper, ArrowRight, MapPin, Clock } from "lucide-react";
import InstagramFeed from "./InstagramFeed";


// Mock data - substituir por API real
const noticias = [
    {
        id: 1,
        titulo: "APCC realiza campanha Outubro Rosa 2024",
        resumo: "Mais de 500 mulheres atendidas com exames gratuitos durante o mês de conscientização.",
        data: "2024-10-28",
        imagem: "/news-1.jpg",
        categoria: "Campanha"
    },
    {
        id: 2,
        titulo: "Nova parceria com Hospital Regional",
        resumo: "Acordo amplia atendimento e reduz tempo de espera para tratamentos.",
        data: "2024-11-15",
        imagem: "/news-2.jpg",
        categoria: "Parceria"
    },
    {
        id: 3,
        titulo: "Depoimento: História de superação de Maria",
        resumo: "Paciente vence câncer de mama e compartilha sua jornada de esperança.",
        data: "2024-11-20",
        imagem: "/news-3.jpg",
        categoria: "Depoimento"
    },
    {
        id: 4,
        titulo: "Bazar Beneficente bate recorde de arrecadação",
        resumo: "Graças à solidariedade de todos, conseguimos fundos para novos equipamentos.",
        data: "2024-12-05",
        imagem: "/news-4.jpg",
        categoria: "Evento"
    },
    {
        id: 5,
        titulo: "Equipe médica recebe prêmio de excelência",
        resumo: "Nossos profissionais foram reconhecidos pelo atendimento humanizado.",
        data: "2024-12-10",
        imagem: "/news-5.jpg",
        categoria: "Institucional"
    }
];

const eventos = [
    {
        id: 1,
        titulo: "Caminhada pela Vida",
        data: "2024-12-10",
        hora: "08:00",
        local: "Praça Central",
        descricao: "Caminhada de conscientização sobre prevenção ao câncer"
    },
    {
        id: 2,
        titulo: "Bazar Beneficente",
        data: "2024-12-15",
        hora: "14:00",
        local: "Sede APCC",
        descricao: "Venda de produtos artesanais para arrecadação de fundos"
    },
    {
        id: 3,
        titulo: "Palestra: Alimentação e Prevenção",
        data: "2024-12-20",
        hora: "19:00",
        local: "Auditório Municipal",
        descricao: "Nutricionista fala sobre hábitos saudáveis"
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

import { useEffect, useState } from "react";
import { getNewsItems } from "@/app/admin/actions";

export default function NoticiasEventos() {
    const [news, setNews] = useState<any[]>(noticias);

    useEffect(() => {
        const fetchNews = async () => {
            const fetched = await getNewsItems();
            if (fetched && fetched.length > 0) {
                setNews(fetched);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="bg-slate-50 py-12 md:py-16">
            <div className="container mx-auto px-4">

                {/* Redes Sociais - PRIMEIRO */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Instagram Feed */}
                        <InstagramFeed />

                        {/* Facebook Feed */}
                        <Card className="bg-card border-border shadow-lg shadow-muted/20">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Facebook className="h-6 w-6 text-primary" />
                                    Facebook
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    APCC Oficial
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Facebook className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500 mb-1">Há {i} dias</p>
                                                    <p className="text-gray-700 text-sm">
                                                        Post de exemplo do Facebook #{i}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                                    asChild
                                >
                                    <a href="https://facebook.com/apcc" target="_blank" rel="noopener noreferrer">
                                        <Facebook className="mr-2 h-4 w-4" />
                                        Curtir no Facebook
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Notícias - SEGUNDO */}
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
                            <span className="text-primary">
                                Notícias
                            </span> 📰
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Fique por dentro das nossas ações e histórias
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {news.slice(0, 3).map((noticia, index) => (
                            <motion.div
                                key={noticia.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden h-full shadow-lg shadow-muted/20">
                                    <div className="relative h-48 bg-muted overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                                {noticia.categoria}
                                            </span>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardDescription className="text-muted-foreground text-sm">
                                            {new Date(noticia.data).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
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
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10"
                        >
                            <Newspaper className="mr-2 h-4 w-4" />
                            Ver Todas as Notícias
                        </Button>
                    </div>
                </motion.div>

                {/* Calendário de Eventos - TERCEIRO */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    variants={fadeInUp}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black text-foreground mb-4">
                            Próximos <span className="text-primary">
                                Eventos
                            </span> 📅
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Participe das nossas ações e campanhas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {eventos.map((evento, index) => (
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
                                                    {new Date(evento.data).getDate()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(evento.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                        <CardTitle className="text-gray-900">{evento.titulo}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4 text-azul-600" />
                                            <span className="text-sm">{evento.hora}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4 text-rosa-600" />
                                            <span className="text-sm">{evento.local}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm pt-2 border-t border-gray-100">
                                            {evento.descricao}
                                        </p>
                                        <Button className="w-full bg-gradient-to-r from-azul-600 to-rosa-600 hover:from-azul-700 hover:to-rosa-700 mt-4 text-white">
                                            Participar
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            className="border-azul-500 text-azul-400 hover:bg-azul-500/10"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver Calendário Completo
                        </Button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
