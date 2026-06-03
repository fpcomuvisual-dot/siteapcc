'use client'
import { useState, useEffect } from 'react'
import {
    analyzeDocument, saveThemeSettings, createNewsItem,
    createTransparencyDoc, getTransparencyDocs, deleteTransparencyDoc,
    getAllNewsItems, saveHeroSettings, getHeroSettings,
    savePopupSettings, getPopupSettings,
} from './actions'
import { TRANSPARENCY_CATEGORIES } from '@/lib/constants'
import {
    BarChart3, FileText, TrendingUp, Upload, Bot, CheckCircle2,
    LayoutDashboard, Settings, Sparkles, Menu, Calendar, Trash2, Plus, Shield,
    Image as ImageIcon, Megaphone, Eye, EyeOff,
} from 'lucide-react'
import { createCalendarEvent, getCalendarEvents, deleteCalendarEvent } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export default function AdminDashboard() {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [activeSection, setActiveSection] = useState('materias')
    const [newsCount, setNewsCount] = useState<number | null>(null)
    const [docsCount, setDocsCount] = useState<number | null>(null)

    useEffect(() => {
        getAllNewsItems().then(n => setNewsCount((n as any[]).length))
        getTransparencyDocs().then(d => setDocsCount((d as any[]).length))
    }, [])

    async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setAnalyzing(true)
        setAnalysisResult(null)
        const formData = new FormData(e.currentTarget)
        const result = await analyzeDocument(formData)
        setAnalyzing(false)
        if (result.success) setAnalysisResult(result.data)
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
                    <SidebarItem icon={BarChart3} label="Visão Geral" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                    <SidebarItem icon={FileText} label="Matérias e Notícias" active={activeSection === 'materias'} onClick={() => setActiveSection('materias')} />
                    <SidebarItem icon={Shield} label="Transparência" active={activeSection === 'transparencia'} onClick={() => setActiveSection('transparencia')} />
                    <SidebarItem icon={ImageIcon} label="Editor da Hero" active={activeSection === 'hero'} onClick={() => setActiveSection('hero')} />
                    <SidebarItem icon={Megaphone} label="Popup do Site" active={activeSection === 'popup'} onClick={() => setActiveSection('popup')} />
                    <SidebarItem icon={Calendar} label="Calendário" active={activeSection === 'calendario'} onClick={() => setActiveSection('calendario')} />
                    <SidebarItem icon={Sparkles} label="Personalização" active={activeSection === 'personalizacao'} onClick={() => setActiveSection('personalizacao')} />
                    <SidebarItem icon={Bot} label="Ferramentas IA" active={activeSection === 'ia'} onClick={() => setActiveSection('ia')} />
                    <SidebarItem icon={Settings} label="Configurações" />
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div className="md:hidden">
                        <Button size="icon" variant="ghost"><Menu className="text-slate-500" /></Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Painel de Controle</h1>
                        <div className="w-full md:w-72">
                            <Select value={activeSection} onValueChange={setActiveSection}>
                                <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="Selecione a seção" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="overview">Visão Geral</SelectItem>
                                    <SelectItem value="materias">Matérias e Notícias</SelectItem>
                                    <SelectItem value="transparencia">Transparência</SelectItem>
                                    <SelectItem value="hero">Editor da Hero (imagem + texto)</SelectItem>
                                    <SelectItem value="popup">Popup do Site</SelectItem>
                                    <SelectItem value="calendario">Calendário</SelectItem>
                                    <SelectItem value="personalizacao">Personalização Visual</SelectItem>
                                    <SelectItem value="ia">Ferramentas IA (Demo)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="border-slate-200 bg-white text-slate-600" asChild>
                            <a href="/" target="_blank">Ver Site</a>
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-pink-200">A</div>
                    </div>
                </header>

                {/* Visão Geral */}
                {activeSection === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <StatCard
                            title="Matérias Publicadas"
                            value={newsCount === null ? '...' : String(newsCount)}
                            icon={FileText}
                            color="text-purple-600"
                            bgColor="bg-purple-50"
                        />
                        <StatCard
                            title="Documentos de Transparência"
                            value={docsCount === null ? '...' : String(docsCount)}
                            icon={Shield}
                            color="text-azul-600"
                            bgColor="bg-blue-50"
                        />
                    </div>
                )}

                <div className="space-y-8">
                    {/* MATÉRIAS */}
                    {activeSection === 'materias' && (
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <FileText className="text-purple-600 w-5 h-5" />
                                    Gerenciar Matérias
                                </CardTitle>
                                <CardDescription>Adicione novas notícias ao site.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault()
                                        setAnalyzing(true)
                                        const formData = new FormData(e.currentTarget)
                                        const result = await createNewsItem(formData)
                                        setAnalyzing(false)
                                        if (result.success) {
                                            alert(result.message);
                                            (e.target as HTMLFormElement).reset()
                                            const preview = document.getElementById('preview-image')
                                            if (preview) preview.setAttribute('src', '')
                                            document.getElementById('upload-placeholder')?.classList.remove('hidden')
                                            document.getElementById('preview-container')?.classList.add('hidden')
                                            getAllNewsItems().then(n => setNewsCount((n as any[]).length))
                                        } else {
                                            alert(result.message)
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
                                                        <SelectItem value="doacao">Doação</SelectItem>
                                                        <SelectItem value="prevencao">Prevenção</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-slate-700">Data de Publicação</Label>
                                                <Input name="date" required type="date" className="bg-white border-slate-200" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700">Foto de Capa <span className="text-red-500">*</span></Label>
                                            <div className="border-2 border-dashed border-slate-200 rounded-lg h-full min-h-[200px] flex flex-col items-center justify-center p-4 relative group hover:border-purple-400 transition-colors bg-slate-50">
                                                <input
                                                    type="file" name="image" accept="image/*" required
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onload = (e) => {
                                                                const img = document.getElementById('preview-image') as HTMLImageElement
                                                                if (img && e.target?.result) img.src = e.target.result as string
                                                            }
                                                            reader.readAsDataURL(file)
                                                            document.getElementById('upload-placeholder')?.classList.add('hidden')
                                                            document.getElementById('preview-container')?.classList.remove('hidden')
                                                        }
                                                    }}
                                                />
                                                <div id="upload-placeholder" className="text-center space-y-2">
                                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
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

                    {/* TRANSPARÊNCIA */}
                    {activeSection === 'transparencia' && <TransparenciaAdmin onCountChange={setDocsCount} />}

                    {/* HERO */}
                    {activeSection === 'hero' && <HeroEditor />}

                    {activeSection === 'popup' && <PopupEditor />}

                    {/* PERSONALIZAÇÃO */}
                    {activeSection === 'personalizacao' && (
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="text-pink-600 w-5 h-5" />
                                    Personalização Visual
                                </CardTitle>
                                <CardDescription>Defina o tema das campanhas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={async (formData) => {
                                    const result = await saveThemeSettings(formData)
                                    alert(result.message)
                                }} className="space-y-8">
                                    <div className="space-y-4">
                                        <Label>Tema da Campanha</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { value: 'theme-rosa', label: 'Outubro Rosa', color: '#EE3A8C' },
                                                { value: 'theme-azul', label: 'Novembro Azul', color: '#3B82F6' },
                                                { value: 'theme-laranja', label: 'Dezembro Laranja', color: '#F97316' },
                                            ].map(t => (
                                                <label key={t.value} className="cursor-pointer">
                                                    <input type="radio" name="theme" value={t.value} className="peer sr-only" defaultChecked={t.value === 'theme-rosa'} />
                                                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-pink-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full shadow-sm" style={{ background: t.color }} />
                                                        <span className="font-semibold text-slate-700">{t.label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                            <Settings className="w-4 h-4" /> Salvar Configurações
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* CALENDÁRIO */}
                    {activeSection === 'calendario' && <CalendarManager />}

                    {/* IA — APENAS DEMONSTRAÇÃO */}
                    {activeSection === 'ia' && (
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <Bot className="text-pink-600 w-5 h-5" />
                                    Ferramentas IA
                                    <span className="ml-2 text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                        Demonstração
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    Upload de documentos para análise automática. <strong>Esta é uma demonstração</strong> — não está conectada a uma API de IA real no momento.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                    ⚠️ A análise abaixo simula o funcionamento. Para ativação real, conecte uma API Gemini/OpenAI nas configurações do servidor.
                                </div>
                                <form onSubmit={handleAnalyze} className="space-y-6">
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-pink-500/50 hover:bg-slate-50 text-center cursor-pointer relative bg-slate-50/50">
                                        <input type="file" name="docs" className="absolute inset-0 opacity-0 cursor-pointer" required />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-slate-600">Clique ou arraste arquivos aqui</p>
                                            <p className="text-xs text-slate-400">PDF, DOCX até 5MB</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={analyzing} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                                            {analyzing ? <><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Processando (demo)...</> : <><Bot className="mr-2 h-4 w-4" /> Processar (Demonstração)</>}
                                        </Button>
                                    </div>
                                </form>
                                <AnimatePresence>
                                    {analysisResult && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-slate-50 rounded-xl p-6 border border-pink-100">
                                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                                                <CheckCircle2 className="text-green-500 w-5 h-5" />
                                                <h4 className="font-semibold text-slate-900">Resultado da Demonstração</h4>
                                                <span className="text-xs text-slate-500 ml-auto">{analysisResult.date}</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Assunto</label>
                                                    <p className="text-slate-800 mt-1">{analysisResult.subject}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-pink-600 uppercase flex items-center gap-1"><Sparkles className="w-3 h-3" /> Texto Gerado</label>
                                                    <div className="mt-2 bg-white p-4 rounded-lg text-slate-600 text-sm border border-slate-200">{analysisResult.release}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}

// ─── Editor da Hero ───────────────────────────────────────────────────────────
function HeroEditor() {
    const [saving, setSaving]       = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    const [currentImg, setCurrentImg] = useState('')
    const [titulo, setTitulo]       = useState('')
    const [subtitulo, setSubtitulo] = useState('')

    useEffect(() => {
        getHeroSettings().then(s => {
            setTitulo(s.titulo || 'Juntos Salvamos Vidas')
            setSubtitulo(s.subtitulo || 'A APCC oferece apoio, tratamento e esperança para quem enfrenta o câncer.')
            setCurrentImg(s.heroImageUrl || '')
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData(e.currentTarget)
        const result = await saveHeroSettings(formData)
        setSaving(false)
        if (result.success) {
            alert(result.message)
            if (result.heroImageUrl) setCurrentImg(result.heroImageUrl)
            setPreviewUrl('')
        } else {
            alert(result.message)
        }
    }

    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="text-pink-600 w-5 h-5" />
                    Editor da Hero
                </CardTitle>
                <CardDescription>Imagem de fundo, título e subtítulo da página inicial.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-2">
                        <Label>Título Principal</Label>
                        <Input name="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <Label>Subtítulo</Label>
                        <Textarea name="subtitulo" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} className="bg-white border-slate-200 min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Imagem de Fundo da Hero</Label>
                        {(previewUrl || currentImg) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl || currentImg} alt="Preview Hero" className="w-full h-40 object-cover rounded-lg border border-slate-200 mb-2" />
                        )}
                        <Input
                            name="imagem"
                            type="file"
                            accept="image/*"
                            className="bg-white border-slate-200"
                            onChange={e => {
                                const f = e.target.files?.[0]
                                if (f) setPreviewUrl(URL.createObjectURL(f))
                            }}
                        />
                        <p className="text-xs text-slate-500">JPG, PNG, WebP. Recomendado: 1920×1080px. Deixe vazio para manter a imagem atual.</p>
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                            {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {saving ? 'Salvando...' : 'Salvar Hero'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

// ─── Editor do Popup ──────────────────────────────────────────────────────────
function PopupEditor() {
    const [saving, setSaving]       = useState(false)
    const [ativo, setAtivo]         = useState(false)
    const [titulo, setTitulo]       = useState('')
    const [mensagem, setMensagem]   = useState('')
    const [botaoTexto, setBotaoTexto] = useState('')
    const [botaoLink, setBotaoLink] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [currentImg, setCurrentImg] = useState('')

    useEffect(() => {
        getPopupSettings().then((p: any) => {
            setAtivo(!!p?.ativo)
            setTitulo(p?.titulo || '')
            setMensagem(p?.mensagem || '')
            setBotaoTexto(p?.botaoTexto || '')
            setBotaoLink(p?.botaoLink || '')
            setCurrentImg(p?.imagemUrl || '')
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData(e.currentTarget)
        if (ativo) formData.set('ativo', 'on')
        const result = await savePopupSettings(formData)
        setSaving(false)
        alert(result.message)
        if (result.success) setPreviewUrl('')
    }

    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Megaphone className="text-pink-600 w-5 h-5" />
                    Popup do Site
                </CardTitle>
                <CardDescription>
                    Aviso/banner modal que aparece UMA VEZ por visitante. Ao salvar, reaparece para todos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                    {/* Toggle ativo */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                            <p className="font-semibold text-slate-900">Popup ativo</p>
                            <p className="text-xs text-slate-500">Liga ou desliga o popup para todos os visitantes.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAtivo(!ativo)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ativo ? 'bg-pink-600' : 'bg-slate-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${ativo ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label>Título do Popup</Label>
                        <Input name="popupTitulo" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Campanha Outubro Rosa 2025" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <Label>Mensagem</Label>
                        <Textarea name="popupMensagem" value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Ex: Ajude-nos nesta campanha de prevenção. Cada doação faz a diferença!" className="bg-white border-slate-200 min-h-[80px]" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Texto do Botão (opcional)</Label>
                            <Input name="popupBotaoTexto" value={botaoTexto} onChange={e => setBotaoTexto(e.target.value)} placeholder="Ex: Quero ajudar" className="bg-white border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label>Link do Botão (opcional)</Label>
                            <Input name="popupBotaoLink" value={botaoLink} onChange={e => setBotaoLink(e.target.value)} placeholder="Ex: /doar ou https://..." className="bg-white border-slate-200" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Imagem (opcional)</Label>
                        {(previewUrl || currentImg) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl || currentImg} alt="Preview popup" className="w-full h-32 object-cover rounded-lg border border-slate-200 mb-2" />
                        )}
                        <Input
                            name="popupImagem"
                            type="file"
                            accept="image/*"
                            className="bg-white border-slate-200"
                            onChange={e => {
                                const f = e.target.files?.[0]
                                if (f) setPreviewUrl(URL.createObjectURL(f))
                            }}
                        />
                        <p className="text-xs text-slate-500">Deixe vazio para manter a imagem atual. Recomendado: 800×300px.</p>
                    </div>

                    {/* Preview */}
                    {(titulo || mensagem) && (
                        <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Preview do Popup</p>
                            <div className="bg-white rounded-xl shadow-sm border p-4 max-w-xs mx-auto">
                                <div className="h-1 bg-gradient-to-r from-rosa-500 to-azul-500 -mx-4 -mt-4 rounded-t-xl mb-4" />
                                {titulo  && <p className="font-black text-slate-900 text-sm mb-1">{titulo}</p>}
                                {mensagem && <p className="text-slate-600 text-xs leading-relaxed mb-3">{mensagem}</p>}
                                {botaoTexto && <div className="bg-gradient-to-r from-rosa-600 to-azul-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-block">{botaoTexto}</div>}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2 text-sm">
                            {ativo ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                            <span className={ativo ? 'text-green-600 font-medium' : 'text-slate-400'}>
                                {ativo ? 'Popup visível no site' : 'Popup desativado'}
                            </span>
                        </div>
                        <Button disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                            {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {saving ? 'Salvando...' : 'Salvar Popup'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

function TransparenciaAdmin({ onCountChange }: { onCountChange: (n: number) => void }) {
    const [docs, setDocs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    async function loadDocs() {
        const data = await getTransparencyDocs()
        setDocs(data as any[])
        onCountChange((data as any[]).length)
        setLoading(false)
    }

    useEffect(() => { loadDocs() }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const result = await createTransparencyDoc(formData)
        if (result.success) {
            alert(result.message);
            (e.target as HTMLFormElement).reset()
            await loadDocs()
        } else {
            alert(result.message)
        }
        setSubmitting(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Remover este documento?')) return
        await deleteTransparencyDoc(id)
        await loadDocs()
    }

    return (
        <div className="space-y-8">
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="text-azul-600 w-5 h-5" />
                        Publicar Documento de Transparência
                    </CardTitle>
                    <CardDescription>O PDF ficará disponível na página pública de Transparência.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input name="titulo" required placeholder="Ex: Balanço Financeiro 2025" className="bg-white border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select name="categoria" required>
                                    <SelectTrigger className="bg-white border-slate-200">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TRANSPARENCY_CATEGORIES.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Ano</Label>
                                <Input name="ano" type="number" required placeholder={String(new Date().getFullYear())} min="2000" max="2099" className="bg-white border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label>Data do Documento</Label>
                                <Input name="data" type="date" className="bg-white border-slate-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição (opcional)</Label>
                            <Textarea name="descricao" placeholder="Breve descrição do documento..." className="bg-white border-slate-200 h-20" />
                        </div>
                        <div className="space-y-2">
                            <Label>Arquivo PDF <span className="text-red-500">*</span></Label>
                            <Input name="arquivo" type="file" accept="application/pdf" required className="bg-white border-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button disabled={submitting} className="bg-azul-600 hover:bg-azul-700 text-white gap-2">
                                {submitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {submitting ? 'Publicando...' : 'Publicar Documento'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Documentos Publicados</CardTitle>
                    <CardDescription>{docs.length} documento{docs.length !== 1 ? 's' : ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-slate-400">Carregando...</p>
                    ) : docs.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Nenhum documento publicado ainda.</p>
                    ) : (
                        <div className="space-y-3">
                            {docs.map((doc: any) => (
                                <div key={doc.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-pink-300 transition-colors">
                                    <FileText className="w-5 h-5 text-azul-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{doc.titulo}</p>
                                        <p className="text-xs text-slate-500">{doc.categoria} · {doc.ano}</p>
                                    </div>
                                    <a href={doc.arquivo} target="_blank" rel="noopener noreferrer" className="text-xs text-azul-600 hover:underline shrink-0">Ver PDF</a>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0" onClick={() => handleDelete(doc.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function CalendarManager() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        getCalendarEvents(year, month).then(data => {
            if (mounted) { setEvents(data); setLoading(false) }
        })
        return () => { mounted = false }
    }, [year, month])

    const handleDelete = async (id: string) => {
        if (!confirm('Remover este evento?')) return
        setIsSubmitting(true)
        await deleteCalendarEvent(id)
        const data = await getCalendarEvents(year, month)
        setEvents(data)
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

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    return (
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-pink-600 w-5 h-5" />
                    Gerenciar Calendário
                </CardTitle>
                <CardDescription>Adicione eventos ao calendário da instituição.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Label>Ano</Label>
                                <Select value={year.toString()} onValueChange={v => setYear(parseInt(v))}>
                                    <SelectTrigger className="bg-white border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-2/3">
                                <Label>Mês</Label>
                                <Select value={month.toString()} onValueChange={v => setMonth(parseInt(v))}>
                                    <SelectTrigger className="bg-white border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center gap-2"><Plus className="w-4 h-4" /> Novo Evento</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs uppercase font-bold">Dia</Label>
                                    <Input name="day" type="number" min="1" max="31" required placeholder="Ex: 15" className="bg-white border-slate-200" />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold">Horário</Label>
                                    <Input name="time" type="text" placeholder="Ex: 14h00" className="bg-white border-slate-200" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs uppercase font-bold">Título</Label>
                                <Input name="title" required placeholder="Ex: Campanha de Doação" className="bg-white border-slate-200" />
                            </div>
                            <div>
                                <Label className="text-xs uppercase font-bold">Descrição</Label>
                                <Textarea name="description" placeholder="Detalhes do evento..." className="bg-white h-20 border-slate-200" />
                            </div>
                            <Button disabled={isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                {isSubmitting ? 'Salvando...' : 'Adicionar Evento'}
                            </Button>
                        </form>
                    </div>
                    <div className="flex-1 border-l border-slate-100 pl-6">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
                            {months[month - 1]} / {year}
                            {loading && <Sparkles className="w-4 h-4 animate-spin text-pink-500" />}
                        </h4>
                        {!loading && events.length === 0 && <p className="text-sm text-slate-400 italic">Nenhum evento neste mês.</p>}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {events.map(evt => (
                                <div key={evt.id} className="group relative bg-white border border-slate-200 p-3 rounded-lg hover:border-pink-300 transition-colors shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-pink-50 rounded-lg text-pink-700 border border-pink-100 flex-shrink-0">
                                            <span className="text-xl font-bold">{evt.day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-slate-900 truncate">{evt.title}</h5>
                                            <p className="text-xs text-slate-500">{evt.time || 'Dia todo'}</p>
                                            {evt.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{evt.description}</p>}
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(evt.id)}>
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

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-left ${active ? 'bg-pink-50 text-pink-600 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Icon size={18} />
            <span className="text-sm">{label}</span>
        </button>
    )
}

function StatCard({ title, value, icon: Icon, color, bgColor }: { title: string; value: string; icon: any; color: string; bgColor: string }) {
    return (
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
                <p className="text-sm text-slate-500">{title}</p>
            </CardContent>
        </Card>
    )
}
