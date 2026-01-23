'use client'
import { useState, useEffect } from 'react'
import { analyzeDocument, saveSettings, createNewsItem, saveThemeSettings } from './actions'
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
    Menu,
    Calendar,
    Trash2,
    Plus
} from 'lucide-react'
import { createCalendarEvent, getCalendarEvents, deleteCalendarEvent } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import InstagramFeed from '@/components/features/InstagramFeed'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminDashboard() {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [activeSection, setActiveSection] = useState('documentos') // Default to AI Analysis/Docs

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
                    <SidebarItem icon={BarChart3} label="Visão Geral" active={activeSection === 'documentos'} onClick={() => setActiveSection('documentos')} />
                    <SidebarItem icon={FileText} label="Matérias e Notícias" active={activeSection === 'materias'} onClick={() => setActiveSection('materias')} />
                    <SidebarItem icon={LayoutDashboard} label="Editor da Hero" active={activeSection === 'hero'} onClick={() => setActiveSection('hero')} />
                    <SidebarItem icon={Calendar} label="Calendário" active={activeSection === 'calendario'} onClick={() => setActiveSection('calendario')} />
                    <SidebarItem icon={Sparkles} label="Personalização" active={activeSection === 'personalizacao'} onClick={() => setActiveSection('personalizacao')} />
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
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div className="md:hidden">
                        <Button size="icon" variant="ghost">
                            <Menu className="text-slate-500" />
                        </Button>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">Painel de Controle</h1>
                        </div>

                        {/* Section Selector for Mobile/Quick Access */}
                        <div className="w-full md:w-64">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                                Seção Atual
                            </label>
                            <Select value={activeSection} onValueChange={setActiveSection}>
                                <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="Selecione a seção" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="documentos">Documentos & IA</SelectItem>
                                    <SelectItem value="materias">Matérias e Notícias</SelectItem>
                                    <SelectItem value="hero">Editor da Home (Hero)</SelectItem>
                                    <SelectItem value="calendario">Calendário</SelectItem>
                                    <SelectItem value="personalizacao">Personalização Visual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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

                {/* KPI Stats - Only show on Documentos/Dashboard view */}
                {activeSection === 'documentos' && (
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
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* CONTENT: HERO EDITOR */}
                        {activeSection === 'hero' && (
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
                        )}

                        {/* CONTENT: DOCUMENTOS / IA */}
                        {activeSection === 'documentos' && (
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
                        )}

                        {/* CONTENT: MATÉRIAS */}
                        {activeSection === 'materias' && (
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 flex items-center gap-2">
                                        <FileText className="text-purple-600 w-5 h-5" />
                                        Gerenciar Matérias
                                    </CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Adicione, edite ou remova notícias do site.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setAnalyzing(true);
                                            const formData = new FormData(e.currentTarget);
                                            const result = await createNewsItem(formData);
                                            setAnalyzing(false);
                                            if (result.success) {
                                                alert(result.message);
                                                (e.target as HTMLFormElement).reset();
                                                const preview = document.getElementById('preview-image');
                                                if (preview) preview.setAttribute('src', '');
                                                document.getElementById('upload-placeholder')?.classList.remove('hidden');
                                                document.getElementById('preview-container')?.classList.add('hidden');
                                            } else {
                                                alert(result.message);
                                            }
                                        }}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label className="text-slate-700">Título da Matéria</Label>
                                                    <Input name="title" required placeholder="Ex: Campanha de vacinação..." className="bg-white border-slate-200" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-slate-700">Categoria</Label>
                                                    <Select name="category" required>
                                                        <SelectTrigger className="bg-white border-slate-200">
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="campanha">Campanha</SelectItem>
                                                            <SelectItem value="evento">Evento</SelectItem>
                                                            <SelectItem value="institucional">Institucional</SelectItem>
                                                            <SelectItem value="parceria">Parceria</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-slate-700">Data de Publicação</Label>
                                                    <Input name="date" required type="date" className="bg-white border-slate-200" />
                                                </div>
                                            </div>

                                            {/* Image Upload Area */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700">Foto de Capa <span className="text-red-500">*</span></Label>
                                                <div className="border-2 border-dashed border-slate-200 rounded-lg h-full min-h-[200px] flex flex-col items-center justify-center p-4 relative group hover:border-purple-400 transition-colors bg-slate-50">
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        accept="image/*"
                                                        required
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (e) => {
                                                                    const img = document.getElementById('preview-image') as HTMLImageElement;
                                                                    if (img && e.target?.result) img.src = e.target.result as string;
                                                                };
                                                                reader.readAsDataURL(file);
                                                                document.getElementById('upload-placeholder')?.classList.add('hidden');
                                                                document.getElementById('preview-container')?.classList.remove('hidden');
                                                            }
                                                        }}
                                                    />

                                                    <div id="upload-placeholder" className="text-center space-y-2">
                                                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-600">Clique para enviar foto</p>
                                                        <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
                                                    </div>

                                                    <div id="preview-container" className="hidden absolute inset-0 w-full h-full p-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img id="preview-image" src="" alt="Preview" className="w-full h-full object-cover rounded-md" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-slate-700">Conteúdo da Matéria</Label>
                                            <Textarea name="content" required placeholder="Escreva o conteúdo completo aqui..." className="min-h-[150px] bg-white border-slate-200" />
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-slate-100">
                                            <Button disabled={analyzing} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                                {analyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                {analyzing ? 'Publicando...' : 'Publicar Matéria'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* CONTENT: PERSONALIZAÇÃO */}
                        {activeSection === 'personalizacao' && (
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 flex items-center gap-2">
                                        <Sparkles className="text-pink-600 w-5 h-5" />
                                        Personalização Visual
                                    </CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Defina o tema das campanhas e o modo de exibição do site.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        action={async (formData) => {
                                            const result = await saveThemeSettings(formData);
                                            alert(result.message);
                                        }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-slate-700">Tema da Campanha</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <label className="cursor-pointer">
                                                    <input type="radio" name="theme" value="theme-rosa" className="peer sr-only" defaultChecked />
                                                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-pink-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full bg-[#EE3A8C] shadow-sm" />
                                                        <span className="font-semibold text-slate-700">Outubro Rosa</span>
                                                    </div>
                                                </label>

                                                <label className="cursor-pointer">
                                                    <input type="radio" name="theme" value="theme-azul" className="peer sr-only" />
                                                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full bg-[#3B82F6] shadow-sm" />
                                                        <span className="font-semibold text-slate-700">Novembro Azul</span>
                                                    </div>
                                                </label>

                                                <label className="cursor-pointer">
                                                    <input type="radio" name="theme" value="theme-laranja" className="peer sr-only" />
                                                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full bg-[#F97316] shadow-sm" />
                                                        <span className="font-semibold text-slate-700">Dezembro Laranja</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <Label className="text-slate-700">Preferências de Exibição</Label>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base text-slate-900">Modo Escuro (Dark Mode)</Label>
                                                    <p className="text-sm text-slate-500">Ativar tema escuro para todos os visitantes.</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" name="darkMode" className="w-6 h-6 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                                <Settings className="w-4 h-4" />
                                                Salvar Configurações
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {/* CONTENT: CALENDÁRIO */}
                        {activeSection === 'calendario' && (
                            <CalendarManager />
                        )}
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

function CalendarManager() {
    const [year, setYear] = useState(2026)
    const [month, setMonth] = useState(1) // 1 = Janeiro
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch events when year/month changes
    useEffect(() => {
        let isMounted = true
        async function load() {
            setLoading(true)
            const data = await getCalendarEvents(year, month)
            if (isMounted && data) {
                setEvents(data)
                setLoading(false)
            } else if (isMounted) {
                setEvents([])
                setLoading(false)
            }
        }
        load()
        return () => { isMounted = false }
    }, [year, month])

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este evento?')) return
        setIsSubmitting(true)
        const result = await deleteCalendarEvent(id)
        if (result.success) {
            const data = await getCalendarEvents(year, month)
            setEvents(data)
        } else {
            alert(result.message)
        }
        setIsSubmitting(false)
    }

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        formData.append('year', year.toString())
        formData.append('month', month.toString())

        const result = await createCalendarEvent(formData)
        if (result.success) {
            (e.target as HTMLFormElement).reset()
            const data = await getCalendarEvents(year, month)
            setEvents(data)
        } else {
            alert(result.message)
        }
        setIsSubmitting(false)
    }

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                    <Calendar className="text-pink-600 w-5 h-5" />
                    Gerenciar Calendário
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Adicione eventos ao calendário da instituição.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Controls & Form */}
                    <div className="flex-1 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Label className="text-slate-700">Ano</Label>
                                <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                                    <SelectTrigger className="bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2026">2026</SelectItem>
                                        <SelectItem value="2027">2027</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-2/3">
                                <Label className="text-slate-700">Mês</Label>
                                <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                                    <SelectTrigger className="bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((m, i) => (
                                            <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Novo Evento
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-700 text-xs uppercase font-bold">Dia</Label>
                                    <Input name="day" type="number" min="1" max="31" required placeholder="Ex: 15" className="bg-white border-slate-200" />
                                </div>
                                <div>
                                    <Label className="text-slate-700 text-xs uppercase font-bold">Horário</Label>
                                    <Input name="time" type="text" placeholder="Ex: 14h00" className="bg-white border-slate-200" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-slate-700 text-xs uppercase font-bold">Título</Label>
                                <Input name="title" required placeholder="Ex: Campanha de Doação" className="bg-white border-slate-200" />
                            </div>
                            <div>
                                <Label className="text-slate-700 text-xs uppercase font-bold">Descrição (Detalhes)</Label>
                                <Textarea name="description" placeholder="Detalhes do evento..." className="bg-white h-20 border-slate-200" />
                            </div>
                            <Button disabled={isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                {isSubmitting ? 'Salvando...' : 'Adicionar Evento'}
                            </Button>
                        </form>
                    </div>

                    {/* Right: List */}
                    <div className="flex-1 border-l border-slate-100 pl-6">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
                            Eventos em {months[month - 1]} / {year}
                            {loading && <Sparkles className="w-4 h-4 animate-spin text-pink-500" />}
                        </h4>

                        {!loading && events.length === 0 && (
                            <p className="text-sm text-slate-400 italic">Nenhum evento cadastrado neste mês.</p>
                        )}

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {events.map((evt) => (
                                <div key={evt.id} className="group relative bg-white border border-slate-200 p-3 rounded-lg hover:border-pink-300 transition-colors shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-pink-50 rounded-lg text-pink-700 border border-pink-100 flex-shrink-0">
                                            <span className="text-xl font-bold leading-none">{evt.day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-slate-900 truncate">{evt.title}</h5>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                <span>{evt.time || 'Dia todo'}</span>
                                            </p>
                                            {evt.description && (
                                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{evt.description}</p>
                                            )}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                                            onClick={() => handleDelete(evt.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-left
                ${active
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
        </button>
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
