"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Heart,
    Home,
    FileText,
    BarChart3,
    Image as ImageIcon,
    Save,
    Eye,
    Settings
} from "lucide-react";

export default function AdminDashboard() {
    // Estados para edição
    const [stats, setStats] = useState({
        pacientes: "1.247",
        sessoes: "3.892",
        investimento: "R$ 2.1M",
        sucesso: "89%"
    });

    const [heroText, setHeroText] = useState({
        titulo: "Juntos Salvamos Vidas",
        subtitulo: "A APCC oferece apoio, tratamento e esperança para quem enfrenta o câncer."
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Aqui você conectaria com backend/database
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Heart className="h-8 w-8 text-rosa-500" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-rosa-400 to-azul-400 bg-clip-text text-transparent">
                                APCC Admin
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" className="border-azul-500 text-azul-400 hover:bg-azul-500/10">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Site
                                </Button>
                            </Link>
                            <Button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {saved ? "Salvo! ✓" : "Salvar Tudo"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white">Menu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-rosa-400 hover:bg-rosa-500/10">
                                    <Home className="mr-2 h-4 w-4" />
                                    Página Inicial
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-gray-800">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Estatísticas
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-gray-800">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documentos
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-gray-800">
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Imagens
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-gray-800">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configurações
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Hero Section Editor */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-gray-900 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Home className="h-5 w-5 text-rosa-500" />
                                        Editar Hero Section
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Texto principal da página inicial
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="titulo" className="text-gray-300">Título Principal</Label>
                                        <Input
                                            id="titulo"
                                            value={heroText.titulo}
                                            onChange={(e) => setHeroText({ ...heroText, titulo: e.target.value })}
                                            className="bg-gray-800 border-gray-700 text-white mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="subtitulo" className="text-gray-300">Subtítulo</Label>
                                        <Input
                                            id="subtitulo"
                                            value={heroText.subtitulo}
                                            onChange={(e) => setHeroText({ ...heroText, subtitulo: e.target.value })}
                                            className="bg-gray-800 border-gray-700 text-white mt-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Statistics Editor */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card className="bg-gray-900 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-azul-500" />
                                        Editar Estatísticas 2024
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Números de impacto exibidos na página inicial
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="pacientes" className="text-gray-300">Pacientes Atendidos</Label>
                                            <Input
                                                id="pacientes"
                                                value={stats.pacientes}
                                                onChange={(e) => setStats({ ...stats, pacientes: e.target.value })}
                                                className="bg-gray-800 border-gray-700 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="sessoes" className="text-gray-300">Sessões de Tratamento</Label>
                                            <Input
                                                id="sessoes"
                                                value={stats.sessoes}
                                                onChange={(e) => setStats({ ...stats, sessoes: e.target.value })}
                                                className="bg-gray-800 border-gray-700 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="investimento" className="text-gray-300">Investimento</Label>
                                            <Input
                                                id="investimento"
                                                value={stats.investimento}
                                                onChange={(e) => setStats({ ...stats, investimento: e.target.value })}
                                                className="bg-gray-800 border-gray-700 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="sucesso" className="text-gray-300">Taxa de Sucesso</Label>
                                            <Input
                                                id="sucesso"
                                                value={stats.sucesso}
                                                onChange={(e) => setStats({ ...stats, sucesso: e.target.value })}
                                                className="bg-gray-800 border-gray-700 text-white mt-2"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Preview Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="bg-gray-900 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-rosa-500" />
                                        Preview
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Visualização das alterações
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-800 rounded-lg p-8 text-center space-y-4">
                                        <h2 className="text-4xl font-black bg-gradient-to-r from-rosa-400 to-azul-400 bg-clip-text text-transparent">
                                            {heroText.titulo}
                                        </h2>
                                        <p className="text-gray-300 text-lg">
                                            {heroText.subtitulo}
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                            <div className="bg-gray-900 p-4 rounded-lg border border-rosa-500/30">
                                                <div className="text-3xl font-black text-rosa-400">{stats.pacientes}</div>
                                                <div className="text-xs text-gray-400 mt-1">Pacientes</div>
                                            </div>
                                            <div className="bg-gray-900 p-4 rounded-lg border border-azul-500/30">
                                                <div className="text-3xl font-black text-azul-400">{stats.sessoes}</div>
                                                <div className="text-xs text-gray-400 mt-1">Sessões</div>
                                            </div>
                                            <div className="bg-gray-900 p-4 rounded-lg border border-rosa-500/30">
                                                <div className="text-3xl font-black text-rosa-400">{stats.investimento}</div>
                                                <div className="text-xs text-gray-400 mt-1">Investimento</div>
                                            </div>
                                            <div className="bg-gray-900 p-4 rounded-lg border border-azul-500/30">
                                                <div className="text-3xl font-black text-azul-400">{stats.sucesso}</div>
                                                <div className="text-xs text-gray-400 mt-1">Sucesso</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-gradient-to-r from-rosa-600 to-azul-600 border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between text-white">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">💡 Dica</h3>
                                            <p className="text-sm opacity-90">
                                                Clique em &quot;Salvar Tudo&quot; para aplicar as mudanças ao site
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-white text-rosa-600 hover:bg-gray-100 font-bold"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Salvar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
