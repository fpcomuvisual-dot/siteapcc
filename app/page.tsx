"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Building2, TrendingUp, ArrowDown, Sparkles } from "lucide-react";
import { useRef } from "react";
import NoticiasEventos from "@/components/features/NoticiasEventos";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleOnHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05
    }
};

export default function Home() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Background */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Background with Parallax */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ scale }}
                >
                    {/* Hero Image */}
                    <Image
                        src="/hero-background.jpg"
                        alt="APCC - Combate ao Câncer"
                        fill
                        className="object-cover object-center"
                        priority
                        quality={90}
                    />
                    {/* Dark Overlay with Rosa/Azul Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/50 to-white/75" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/30 to-white/80" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60" />
                </motion.div>

                {/* Content */}
                <motion.div
                    className="container mx-auto px-4 py-12 md:py-20 relative z-10"
                    style={{ opacity }}
                >
                    <motion.div
                        className="max-w-5xl mx-auto space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rosa-100 shadow-sm backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-rosa-500" />
                                <span className="text-sm font-semibold text-rosa-600">Transformando vidas desde 1995</span>
                            </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-center"
                            variants={fadeInUp}
                        >
                            <span className="block text-foreground mb-2">
                                Juntos
                            </span>
                            <span className="block text-primary">
                                Salvamos Vidas
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto"
                            variants={fadeInUp}
                        >
                            A <strong className="text-primary">APCC</strong> oferece apoio, tratamento e esperança
                            para quem enfrenta o câncer. Somos uma família unida pela solidariedade. 💪
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                            variants={fadeInUp}
                        >
                            <Link href="/doar">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 font-bold shadow-2xl shadow-primary/30">
                                        <Heart className="mr-2 h-6 w-6" />
                                        Faça uma Doação
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/transparencia">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-10 py-7 font-bold backdrop-blur-sm shadow-lg shadow-primary/10">
                                        Ver Transparência
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            variants={fadeInUp}
                            className="pt-12 flex justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <ArrowDown className="h-8 w-8 text-rosa-400 opacity-70" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-10" />
            </section>

            {/* Notícias e Eventos (Redes Sociais, Notícias, Calendário) */}
            <NoticiasEventos />

            {/* Impact Section - NOSSOS NÚMEROS */}
            <section className="bg-muted/10 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl font-black text-foreground mb-4">
                            Nosso Impacto em <span className="text-primary">2024</span> 📊
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Transparência é nosso compromisso com você
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div variants={fadeInUp}>
                            <motion.div
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                variants={scaleOnHover}
                            >
                                <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer overflow-hidden group shadow-lg shadow-muted/20">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Users className="h-8 w-8 text-primary" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black text-primary">1.247</CardTitle>
                                        <CardDescription className="text-base text-muted-foreground">Pacientes Atendidos</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <motion.div
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                variants={scaleOnHover}
                            >
                                <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer overflow-hidden group shadow-lg shadow-muted/20">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Heart className="h-8 w-8 text-primary" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black text-primary">3.892</CardTitle>
                                        <CardDescription className="text-base text-muted-foreground">Sessões de Tratamento</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <motion.div
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                variants={scaleOnHover}
                            >
                                <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer overflow-hidden group shadow-lg shadow-muted/20">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Building2 className="h-8 w-8 text-primary" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black text-primary">R$ 2.1M</CardTitle>
                                        <CardDescription className="text-base text-muted-foreground">Investidos em Infraestrutura</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <motion.div
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                variants={scaleOnHover}
                            >
                                <Card className="bg-card border-border hover:border-primary transition-all cursor-pointer overflow-hidden group shadow-lg shadow-muted/20">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <TrendingUp className="h-8 w-8 text-primary" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black text-primary">89%</CardTitle>
                                        <CardDescription className="text-base text-muted-foreground">Taxa de Sucesso</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-muted/30 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="bg-primary/90 border-0 text-primary-foreground overflow-hidden relative shadow-2xl shadow-primary/30">
                                <motion.div
                                    className="absolute inset-0 bg-white opacity-0"
                                    whileHover={{ opacity: 0.1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <CardContent className="p-16 text-center relative z-10">
                                    <h2 className="text-5xl font-black mb-6">
                                        Sua doação transforma vidas ✨
                                    </h2>
                                    <p className="text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
                                        Cada contribuição nos ajuda a oferecer tratamento de qualidade e esperança para quem precisa.
                                    </p>
                                    <Link href="/doar">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button size="lg" className="bg-background text-foreground hover:bg-muted text-xl px-12 py-8 font-black shadow-xl">
                                                <Heart className="mr-3 h-7 w-7 text-primary" />
                                                Quero Ajudar Agora
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted/10 border-t border-border text-foreground py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold text-primary">APCC</span>
                            </div>
                            <p className="text-muted-foreground">
                                Associação Paraguaçuense de Combate ao Câncer
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-primary">Links Rápidos</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
                                <li><Link href="/transparencia" className="hover:text-primary transition-colors">Transparência</Link></li>
                                <li><Link href="/doar" className="hover:text-primary transition-colors">Doar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-primary">Contato</h3>
                            <p className="text-muted-foreground">
                                Email: contato@apcc.org.br<br />
                                Telefone: (13) 3471-XXXX
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
                        <p>© 2024 APCC - Todos os direitos reservados | Lei 13.019/2014</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
