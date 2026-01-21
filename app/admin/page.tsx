'use client'
import { useState } from 'react'
import { analyzeDocument, saveSettings } from './actions'
import {
    BarChart3,
    FileText,
    Users,
    DollarSign,
    TrendingUp,
    Upload,
    Bot,
    CheckCircle2,
    LayoutDashboard,
    Settings,
    Sparkles,
    Search,
    Menu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import InstagramFeed from '@/components/features/InstagramFeed'

export default function AdminDashboard() {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('dashboard')

    async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setAnalyzing(true)
        setAnalysisResult(null)

        const formData = new FormData(e.currentTarget)
        const result = await analyzeDocument(formData)

        setAnalyzing(false)
        if (result.success) {
            setAnalysisResult(result.data)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-pink-500/30">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 sticky top-0 h-screen shadow-sm">
                <div className="flex items-center gap-3 mb-10 text-pink-600">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-lg text-slate-900">APCC Admin</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <SidebarItem icon={BarChart3} label="Visão Geral" active />
                    <SidebarItem icon={FileText} label="Documentos" />
                    <SidebarItem icon={Users} label="Doadores" />
                    <SidebarItem icon={Settings} label="Configurações" />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
                        <div className="flex items-center gap-2 text-pink-600 mb-2">
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase">Plano Pro</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">Sua licença de uso da IA está ativa.</p>
                        <Button size="sm" variant="secondary" className="w-full text-xs h-8 bg-white hover:bg-slate-50 text-slate-700 shadow-sm">
                            Gerenciar
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="md:hidden">
                        <Button size="icon" variant="ghost">
                            <Menu className="text-slate-500" />
                        </Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Painel de Controle</h1>
                        <p className="text-slate-500 text-sm">Bem-vindo de volta, Administrador.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm">
                            Ver Site
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-pink-200">
                            A
                        </div>
                    </div>
                </header>

                {/* KPI Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Pacientes Atendidos"
                        value="1,248"
                        trend="+12%"
                        icon={Users}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                        trendColor="text-blue-600 bg-blue-50"
                    />
                    <StatCard
                        title="Investimento Social"
                        value="R$ 45.2k"
                        trend="+5%"
                        icon={DollarSign}
                        color="text-green-600"
                        bgColor="bg-green-50"
                        trendColor="text-green-600 bg-green-50"
                    />
                    <StatCard
                        title="Taxa de Sucesso"
                        value="98.5%"
                        trend="+2%"
                        icon={TrendingUp}
                        color="text-pink-600"
                        bgColor="bg-pink-50"
                        trendColor="text-pink-600 bg-pink-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Hero Editor */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-pink-500 rounded-full" />
                                    Hero Section
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    Personalize a mensagem principal do site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-slate-700">Título Principal</Label>
                                    <Input
                                        defaultValue="Juntos Salvamos Vidas"
                                        className="bg-white border-slate-200 focus-visible:ring-pink-500 text-slate-900"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-700">Subtítulo</Label>
                                    <Textarea
                                        defaultValue="A APCC oferece apoio, tratamento e esperança para pacientes em combate ao câncer."
                                        className="bg-white border-slate-200 focus-visible:ring-pink-500 text-slate-900 min-h-[80px]"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-md shadow-pink-200">
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Document Analysis */}
                        <Card className="bg-white border-slate-200 overflow-hidden relative shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Bot className="w-24 h-24 text-slate-900 -rotate-12" />
                            </div>

                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <Sparkles className="text-pink-600 w-5 h-5" />
                                    Inteligência Artificial Gemini
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    Upload de documentos para análise automática e geração de releases.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleAnalyze} className="space-y-6">
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 transition-colors hover:border-pink-500/50 hover:bg-slate-50 group text-center cursor-pointer relative bg-slate-50/50">
                                        <input type="file" name="docs" className="absolute inset-0 opacity-0 cursor-pointer" required />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 group-hover:border-pink-200 flex items-center justify-center transition-colors">
                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-pink-500 transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-slate-600 group-hover:text-slate-900">
                                                    Clique ou arraste arquivos aqui
                                                </p>
                                                <p className="text-xs text-slate-400">PDF, DOCX até 5MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={analyzing}
                                            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-200"
                                        >
                                            {analyzing ? (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                                    Analisando com Gemini...
                                                </>
                                            ) : (
                                                <>
                                                    <Bot className="mr-2 h-4 w-4" />
                                                    Processar Documento
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                <AnimatePresence>
                                    {analysisResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 bg-slate-50 rounded-xl p-6 border border-pink-100 shadow-inner"
                                        >
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                                                    Análise Concluída
                                                </h4>
                                                <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
                                                    {analysisResult.date}
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assunto Identificado</label>
                                                    <p className="text-slate-800 mt-1 font-medium">{analysisResult.subject}</p>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        Release Gerado por IA
                                                    </label>
                                                    <div className="mt-2 bg-white p-4 rounded-lg text-slate-600 leading-relaxed border border-slate-200 text-sm shadow-sm">
                                                        {analysisResult.release}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-2">
                                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">Descartar</Button>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200">Aprovar e Publicar</Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - History & Recent */}
                    <div className="space-y-8">
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900 text-lg">Social Feed (Live)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InstagramFeed />
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-200 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-slate-900 text-lg">Histórico Recente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                                                <FileText className="w-5 h-5 text-slate-500 group-hover:text-pink-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Prestação de Contas Jul/{24}</p>
                                                <p className="text-xs text-slate-500">Processado via Gemini AI</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1
                ${active
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
        </a>
    )
}

function StatCard({ title, value, trend, icon: Icon, color, bgColor, trendColor }: any) {
    return (
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${trendColor}`}>
                        <TrendingUp className="w-3 h-3" /> {trend}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
                <p className="text-sm text-slate-500">{title}</p>
            </CardContent>
        </Card>
    )
}
