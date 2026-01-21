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
            {/* Navigation */}
            <motion.nav
                className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Heart className="h-8 w-8 text-rosa-500" />
                            </motion.div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-rosa-400 to-azul-400 bg-clip-text text-transparent">
                                APCC
                            </span>
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-gray-600 hover:text-rosa-500 transition-colors font-medium">
                                Início
                            </Link>
                            <Link href="/transparencia" className="text-gray-600 hover:text-azul-500 transition-colors font-medium">
                                Transparência
                            </Link>
                            <Link href="/doar">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700 border-0 font-bold">
                                        Doar
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>

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
                            <span className="block text-gray-900 mb-2">
                                Juntos
                            </span>
                            <span className="block bg-gradient-to-r from-rosa-500 via-rosa-400 to-azul-500 bg-clip-text text-transparent">
                                Salvamos Vidas
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-xl md:text-2xl text-gray-600 leading-relaxed text-center max-w-3xl mx-auto"
                            variants={fadeInUp}
                        >
                            A <strong className="text-rosa-500">APCC</strong> oferece apoio, tratamento e esperança
                            para quem enfrenta o câncer. Somos uma família unida pela solidariedade. 💪
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                            variants={fadeInUp}
                        >
                            <Link href="/doar">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700 text-white text-lg px-10 py-7 font-bold shadow-2xl shadow-rosa-500/50">
                                        <Heart className="mr-2 h-6 w-6" />
                                        Faça uma Doação
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/transparencia">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="border-2 border-azul-500 text-azul-600 hover:bg-azul-50 text-lg px-10 py-7 font-bold backdrop-blur-sm shadow-lg shadow-azul-100/50">
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
            <section className="bg-slate-50 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl font-black text-gray-900 mb-4">
                            Nosso Impacto em <span className="bg-gradient-to-r from-rosa-500 to-azul-500 bg-clip-text text-transparent">2024</span> 📊
                        </h2>
                        <p className="text-xl text-gray-600">
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
                                <Card className="bg-white border-rosa-100 hover:border-rosa-300 transition-all cursor-pointer overflow-hidden group shadow-lg shadow-gray-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rosa-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-gradient-to-br from-rosa-100 to-rosa-200 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Users className="h-8 w-8 text-rosa-600" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-rosa-500 to-rosa-400 bg-clip-text text-transparent">1.247</CardTitle>
                                        <CardDescription className="text-base text-gray-600">Pacientes Atendidos</CardDescription>
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
                                <Card className="bg-white border-azul-100 hover:border-azul-300 transition-all cursor-pointer overflow-hidden group shadow-lg shadow-gray-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-azul-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-gradient-to-br from-azul-100 to-azul-200 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Heart className="h-8 w-8 text-azul-600" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-azul-500 to-azul-400 bg-clip-text text-transparent">3.892</CardTitle>
                                        <CardDescription className="text-base text-gray-600">Sessões de Tratamento</CardDescription>
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
                                <Card className="bg-white border-rosa-100 hover:border-rosa-300 transition-all cursor-pointer overflow-hidden group shadow-lg shadow-gray-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rosa-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-gradient-to-br from-rosa-100 to-rosa-200 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Building2 className="h-8 w-8 text-rosa-600" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-rosa-500 to-rosa-400 bg-clip-text text-transparent">R$ 2.1M</CardTitle>
                                        <CardDescription className="text-base text-gray-600">Investidos em Infraestrutura</CardDescription>
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
                                <Card className="bg-white border-azul-100 hover:border-azul-300 transition-all cursor-pointer overflow-hidden group shadow-lg shadow-gray-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-azul-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="text-center relative z-10">
                                        <motion.div
                                            className="mx-auto w-16 h-16 bg-gradient-to-br from-azul-100 to-azul-200 rounded-full flex items-center justify-center mb-4 shadow-sm"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <TrendingUp className="h-8 w-8 text-azul-600" />
                                        </motion.div>
                                        <CardTitle className="text-5xl font-black bg-gradient-to-r from-azul-500 to-azul-400 bg-clip-text text-transparent">89%</CardTitle>
                                        <CardDescription className="text-base text-gray-600">Taxa de Sucesso</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-slate-50 py-12 md:py-16">
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
                            <Card className="bg-gradient-to-r from-rosa-600 to-azul-600 border-0 text-white overflow-hidden relative shadow-2xl shadow-rosa-500/50">
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
                                            <Button size="lg" className="bg-white text-rosa-600 hover:bg-gray-100 text-xl px-12 py-8 font-black shadow-2xl">
                                                <Heart className="mr-3 h-7 w-7" />
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
            <footer className="bg-gray-50 border-t border-gray-200 text-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-6 w-6 text-rosa-400" />
                                <span className="text-xl font-bold bg-gradient-to-r from-rosa-500 to-azul-500 bg-clip-text text-transparent">APCC</span>
                            </div>
                            <p className="text-gray-600">
                                Associação Paraguaçuense de Combate ao Câncer
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-rosa-600">Links Rápidos</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link href="/" className="hover:text-rosa-600 transition-colors">Início</Link></li>
                                <li><Link href="/transparencia" className="hover:text-azul-600 transition-colors">Transparência</Link></li>
                                <li><Link href="/doar" className="hover:text-rosa-600 transition-colors">Doar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-azul-600">Contato</h3>
                            <p className="text-gray-600">
                                Email: contato@apcc.org.br<br />
                                Telefone: (13) 3471-XXXX
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
                        <p>© 2024 APCC - Todos os direitos reservados | Lei 13.019/2014</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
