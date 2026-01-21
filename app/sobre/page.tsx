"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, MapPin, Users, Award, Calendar } from "lucide-react";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const volunteers = [
    { name: "Maria Regina Alfredo Plazza", img: "https://apccppta.com.br/wp-content/uploads/2022/09/France.png" }, // Placeholder mapping based on list, using available URLs
    { name: "Francelina Gonçalves Matheus", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Foto-France-Quadrado.png" },
    { name: "Silvia Barbosa de Sá Pinheiro", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Silvia.png" },
    { name: "Márcia Regina Deperon", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Marcia.png" },
    { name: "Maria de Lourdes Santos Bertolla", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Lourdes.png" },
    { name: "Mara Rosana Peralta Romeiro", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Mara.png" },
    { name: "Maria Cuerin Parisotto", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Maria.png" },
    { name: "Maria Antônia Aliotti de Lima", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Maria-Antonia.png" },
    { name: "Marlei Regina da Luz Durães", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Marlei.png" },
    { name: "Matilde Ribeiro de Melo", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Matilde.png" },
    { name: "Neide Aparecida Teodoro de Lima", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Neide.png" },
    { name: "Oclesia Maria Maróstica Hortal", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Oclesia.png" },
    { name: "Cidinha", img: "https://apccppta.com.br/wp-content/uploads/2022/09/Cidinha.png" },
    // Adding generic placeholders for others listed but without explicit matching filname found in main scrape list immediately
];

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-muted/30 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl font-black text-foreground mb-6">
                            Sobre <span className="text-primary">Nós</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Uma história de amor, solidariedade e compromisso com a vida.
                            Conheça a trajetória da Associação Paraguaçuense de Combate ao Câncer.
                        </p>
                    </motion.div>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            </section>

            <div className="container mx-auto px-4 py-16 space-y-20">

                {/* History Section */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white shadow-primary/20">
                            {/* Using the 30 years logo or main image found */}
                            <Image
                                src="https://apccppta.com.br/wp-content/uploads/2020/10/cropped-logo-30-anos.png"
                                alt="APCC 30 Anos"
                                fill
                                className="object-contain bg-white p-8"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-foreground">
                            Nossa História
                        </h2>
                        <div className="prose prose-lg text-muted-foreground">
                            <p>
                                A Associação Paraguaçuense de Combate ao Câncer surgiu a partir de uma entidade voluntária que abrange o Estado de São Paulo.
                                No entanto, com o crescente número de pacientes carentes em nossa região, os recursos destinados tornaram-se insuficientes.
                            </p>
                            <p>
                                Foi então que decidimos criar uma força local. Uma janela aberta para a vida.
                                Somos uma Entidade Filantrópica, sem fins lucrativos, guiada pelo amor e pela satisfação em promover o bem-estar.
                            </p>
                            <p>
                                Nosso trabalho é embasado por um Estatuto Social e Regimento Interno, com transparência e seriedade.
                                Oferecemos assistência alimentar, medicamentos e, principalmente, apoio humano para quem enfrenta o câncer.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                <Clock className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-bold text-foreground">Horário</h3>
                                <p className="text-sm text-muted-foreground">Seg-Sex: 8h às 18h</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                <Award className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-bold text-foreground">Missão</h3>
                                <p className="text-sm text-muted-foreground">Apoio Integral</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Volunteers Section */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-foreground mb-4">
                            Nossos <span className="text-primary">Voluntários</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Conheça as pessoas que dedicam seu tempo e amor para fazer a diferença.
                        </p>
                    </div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {volunteers.map((vol, index) => (
                            <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5 }}>
                                <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all text-center h-full">
                                    <div className="relative w-full aspect-square bg-muted">
                                        <Image
                                            src={vol.img}
                                            alt={vol.name}
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-foreground text-sm md:text-base">{vol.name}</h3>
                                        <p className="text-xs text-primary mt-1">Voluntário(a)</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* CTA / Community */}
                <section className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-foreground mb-4">Faça Parte Dessa Comunidade</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Seja um voluntário ou contribua com nossa causa. Cada gesto de solidariedade ajuda a salvar vidas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {/* Links to be implemented or reusing existing ones */}
                        </div>
                    </motion.div>
                </section>

            </div>
        </div>
    );
}
