'use client'
import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import {
    analyzeDocument, saveThemeSettings, createNewsItem,
    createTransparencyDoc, getTransparencyDocs, deleteTransparencyDoc,
    getAllNewsItems, saveHeroSettings, getHeroSettings,
    savePopupSettings, getPopupSettings,
    getVolunteers, createVolunteer, updateVolunteer, deleteVolunteer,
    updateVolunteersOrder,
    // Lojinha Actions:
    getProdutos, criarProduto, editarProduto, darEntradaEstoque,
    registrarConsignacao, registrarVenda, registrarDevolucao,
    ajusteManual, getConsignacoes, getMovimentacoes
} from './actions'
import { TRANSPARENCY_CATEGORIES } from '@/lib/constants'
import {
    BarChart3, FileText, TrendingUp, Upload, Bot, CheckCircle2,
    LayoutDashboard, Settings, Sparkles, Menu, Calendar, Trash2, Plus, Shield,
    Image as ImageIcon, Megaphone, Eye, EyeOff, Users, Pencil, GripVertical,
    // Lojinha Icons:
    ShoppingBag, Package, History, DollarSign, Undo2, ArrowDownLeft, ArrowUpRight, Tag, Coins
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
    const [galleryFiles, setGalleryFiles] = useState<File[]>([])
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
    const [publishingError, setPublishingError] = useState<string | null>(null)
    const [publishingSuccess, setPublishingSuccess] = useState<string | null>(null)
    const [coverPreviewSrc, setCoverPreviewSrc] = useState<string | null>(null)
    const [focalPointY, setFocalPointY] = useState(50)

    useEffect(() => {
        getAllNewsItems().then(n => setNewsCount((n as any[]).length))
        getTransparencyDocs().then(d => setDocsCount((d as any[]).length))
    }, [])

    useEffect(() => {
        const urls = galleryFiles.map(file => URL.createObjectURL(file))
        setGalleryPreviews(urls)
        return () => urls.forEach(URL.revokeObjectURL)
    }, [galleryFiles])

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
                    <SidebarItem icon={Users} label="Voluntários" active={activeSection === 'voluntarios'} onClick={() => setActiveSection('voluntarios')} />
                    <SidebarItem icon={ShoppingBag} label="Lojinha APCC" active={activeSection === 'lojinha'} onClick={() => setActiveSection('lojinha')} />
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
                                    <SelectItem value="voluntarios">Voluntários</SelectItem>
                                    <SelectItem value="lojinha">Lojinha APCC</SelectItem>
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
                                        setPublishingError(null)
                                        setPublishingSuccess(null)
                                        setAnalyzing(true)

                                        try {
                                            const formData = new FormData(e.currentTarget)
                                            formData.set('focalPointY', String(focalPointY))
                                            
                                            // Compress cover image
                                            const coverInput = e.currentTarget.querySelector('input[name="image"]') as HTMLInputElement
                                            if (coverInput?.files?.[0]) {
                                                const coverFile = coverInput.files[0]
                                                const compressedCover = await imageCompression(coverFile, {
                                                    maxSizeMB: 1,
                                                    maxWidthOrHeight: 1920,
                                                    useWebWorker: true,
                                                })
                                                formData.set('image', compressedCover, compressedCover.name)
                                            }

                                            // Compress gallery images
                                            formData.delete('galeria')
                                            for (const galleryFile of galleryFiles) {
                                                const compressedGallery = await imageCompression(galleryFile, {
                                                    maxSizeMB: 1,
                                                    maxWidthOrHeight: 1920,
                                                    useWebWorker: true,
                                                })
                                                formData.append('galeria', compressedGallery, compressedGallery.name)
                                            }

                                            const result = await createNewsItem(formData)
                                            
                                            if (result.success) {
                                                setPublishingSuccess(result.message)
                                                setTimeout(() => {
                                                    (e.target as HTMLFormElement).reset()
                                                    setGalleryFiles([])
                                                    setGalleryPreviews([])
                                                    setCoverPreviewSrc(null)
                                                    setFocalPointY(50)
                                                    getAllNewsItems().then(n => setNewsCount((n as any[]).length))
                                                    setPublishingSuccess(null)
                                                }, 2000)
                                            } else {
                                                setPublishingError(result.message || 'Erro ao publicar matéria')
                                            }
                                        } catch (error) {
                                            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao publicar'
                                            setPublishingError(errorMessage)
                                            console.error('[Admin] Erro ao publicar matéria:', error)
                                        } finally {
                                            setAnalyzing(false)
                                        }
                                    }}
                                    className="space-y-6"
                                >
                                    {publishingError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                            <p className="font-medium">❌ Erro ao publicar</p>
                                            <p className="text-red-600">{publishingError}</p>
                                        </div>
                                    )}
                                    {publishingSuccess && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                            <p className="font-medium">✅ {publishingSuccess}</p>
                                        </div>
                                    )}
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
                                             <div className="space-y-2">
                                            <Label className="text-slate-700">Foto de Capa <span className="text-red-500">*</span></Label>
                                            <div className="border-2 border-dashed border-slate-200 rounded-lg min-h-[200px] flex flex-col items-center justify-center p-4 relative group hover:border-purple-400 transition-colors bg-slate-50 overflow-hidden">
                                                <input
                                                    type="file" name="image" accept="image/*" required
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onload = (ev) => {
                                                                if (ev.target?.result) setCoverPreviewSrc(ev.target.result as string)
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                />
                                                {!coverPreviewSrc ? (
                                                    <div className="text-center space-y-2">
                                                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-600">Clique para enviar foto</p>
                                                        <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 w-full h-full p-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={coverPreviewSrc}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover rounded-md"
                                                            style={{ objectPosition: `50% ${focalPointY}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {coverPreviewSrc && (
                                                <div className="pt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                                        <span>Corte: Topo</span>
                                                        <span>Centro</span>
                                                        <span>Base</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={focalPointY}
                                                        onChange={(e) => setFocalPointY(Number(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-row-resize accent-purple-600"
                                                    />
                                                    <p className="text-xs text-slate-500 text-center font-medium">
                                                        Ajuste o enquadramento vertical da imagem para o card.
                                                    </p>
                                                </div>
                                            )}
                                        </div>                                    </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-slate-700">Fotos da Galeria <span className="text-slate-500 text-sm">(opcional)</span></Label>
                                            <input
                                                type="file"
                                                name="galeria"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith('image/'))
                                                    if (files.length > 0) {
                                                        setGalleryFiles((prev) => [...prev, ...files])
                                                    }
                                                    e.target.value = ''
                                                }}
                                                className="block w-full text-sm text-slate-700 file:border-2 file:border-dashed file:border-slate-300 file:bg-slate-50 file:px-4 file:py-3 file:rounded-lg file:text-sm file:font-medium hover:file:border-slate-400"
                                            />
                                            <p className="text-xs text-slate-400">Selecione várias imagens para a galeria da notícia. Não afeta a capa.</p>
                                        </div>
                                        {galleryPreviews.length > 0 && (
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {galleryPreviews.map((preview, index) => (
                                                    <div key={preview} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                                        <div className="relative h-40 w-full">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={preview} alt={`Preview galeria ${index + 1}`} className="h-full w-full object-cover" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryFiles((prev) => prev.filter((_, i) => i !== index))}
                                                            className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1 text-white transition hover:bg-slate-900"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-slate-700">Conteúdo da Matéria</Label>
                                        <Textarea name="content" required placeholder="Escreva o conteúdo completo aqui..." className="min-h-[150px] bg-white border-slate-200" />
                                    </div>
                                    <div className="flex justify-end pt-4 border-t border-slate-100">
                                        <Button disabled={analyzing} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                            {analyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            {analyzing ? 'Otimizando imagens...' : 'Publicar Matéria'}
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

                    {/* VOLUNTÁRIOS */}
                    {activeSection === 'voluntarios' && <VoluntariosManager />}

                    {/* LOJINHA */}
                    {activeSection === 'lojinha' && <LojinhaManager />}

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
        
        // Compress hero image if provided
        const heroInput = e.currentTarget.querySelector('input[name="imagem"]') as HTMLInputElement
        if (heroInput?.files?.[0]) {
            const heroFile = heroInput.files[0]
            const compressedHero = await imageCompression(heroFile, {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            })
            formData.set('imagem', compressedHero, compressedHero.name)
        }
        
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
        
        // Compress popup image if provided
        const popupInput = e.currentTarget.querySelector('input[name="popupImagem"]') as HTMLInputElement
        if (popupInput?.files?.[0]) {
            const popupFile = popupInput.files[0]
            const compressedPopup = await imageCompression(popupFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            })
            formData.set('popupImagem', compressedPopup, compressedPopup.name)
        }
        
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

// ─── Gerenciador de Voluntários ───────────────────────────────────────────────
function VoluntariosManager() {
    const [volunteers, setVolunteers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editNome, setEditNome] = useState('')
    const [editRole, setEditRole] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === index) return
        setDragOverIndex(index)
    }

    const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === targetIndex) return

        const reordered = [...volunteers]
        const [movedItem] = reordered.splice(draggedIndex, 1)
        reordered.splice(targetIndex, 0, movedItem)

        setVolunteers(reordered)
        setDraggedIndex(null)
        setDragOverIndex(null)

        setSubmitting(true)
        const orderedIds = reordered.map(v => v.id)
        const result = await updateVolunteersOrder(orderedIds)
        if (!result.success) {
            alert(result.message)
            await loadVolunteers()
        }
        setSubmitting(false)
    }

    async function loadVolunteers() {
        const data = await getVolunteers()
        setVolunteers(data as any[])
        setLoading(false)
    }

    useEffect(() => { loadVolunteers() }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)

        // Compress image
        const imgInput = e.currentTarget.querySelector('input[name="imagem"]') as HTMLInputElement
        if (imgInput?.files?.[0]) {
            const compressed = await imageCompression(imgInput.files[0], {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            })
            formData.set('imagem', compressed, compressed.name)
        }

        const result = await createVolunteer(formData)
        if (result.success) {
            (e.target as HTMLFormElement).reset()
            setPreviewUrl('')
            await loadVolunteers()
        }
        alert(result.message)
        setSubmitting(false)
    }

    async function handleUpdate(id: string) {
        setSubmitting(true)
        const formData = new FormData()
        formData.set('nome', editNome)
        formData.set('role', editRole)

        // Verificar se há nova foto no input de edição
        const editImgInput = document.getElementById(`edit-img-${id}`) as HTMLInputElement
        if (editImgInput?.files?.[0]) {
            const compressed = await imageCompression(editImgInput.files[0], {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            })
            formData.set('imagem', compressed, compressed.name)
        }

        const result = await updateVolunteer(id, formData)
        if (result.success) {
            setEditingId(null)
            await loadVolunteers()
        }
        alert(result.message)
        setSubmitting(false)
    }

    async function handleDelete(id: string, nome: string) {
        if (!confirm(`Remover ${nome} da lista de voluntários?`)) return
        setSubmitting(true)
        const result = await deleteVolunteer(id)
        if (result.success) await loadVolunteers()
        alert(result.message)
        setSubmitting(false)
    }

    function startEdit(vol: any) {
        setEditingId(vol.id)
        setEditNome(vol.nome)
        setEditRole(vol.role)
    }

    return (
        <div className="space-y-8">
            {/* Formulário de cadastro */}
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="text-pink-600 w-5 h-5" />
                        Adicionar Voluntário(a)
                    </CardTitle>
                    <CardDescription>Cadastre novos voluntários para a página Sobre.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome Completo <span className="text-red-500">*</span></Label>
                                <Input name="nome" required placeholder="Ex: Maria da Silva" className="bg-white border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label>Função / Cargo <span className="text-slate-400 text-sm">(opcional)</span></Label>
                                <Input name="role" placeholder="Ex: Presidente, Fundadora, etc." className="bg-white border-slate-200" />
                                <p className="text-xs text-slate-400">Deixe vazio para exibir &quot;Voluntário(a)&quot;</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Foto <span className="text-red-500">*</span></Label>
                            <div className="flex items-center gap-4">
                                {previewUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-pink-200" />
                                )}
                                <Input
                                    name="imagem"
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="bg-white border-slate-200"
                                    onChange={e => {
                                        const f = e.target.files?.[0]
                                        if (f) setPreviewUrl(URL.createObjectURL(f))
                                    }}
                                />
                            </div>
                            <p className="text-xs text-slate-400">JPG ou PNG. Recomendado: foto quadrada, mínimo 400×400px.</p>
                        </div>
                        <div className="flex justify-end">
                            <Button disabled={submitting} className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                                {submitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {submitting ? 'Adicionando...' : 'Adicionar Voluntário(a)'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de voluntários */}
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Voluntários Cadastrados</CardTitle>
                    <CardDescription>{volunteers.length} voluntário{volunteers.length !== 1 ? 's' : ''} na página Sobre</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-slate-400">Carregando...</p>
                    ) : volunteers.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Nenhum voluntário cadastrado ainda. Adicione acima ou execute a migração.</p>
                    ) : (
                        <div className="grid gap-3">
                            {volunteers.map((vol: any, index: number) => (
                                <div
                                    key={vol.id}
                                    draggable={editingId === null}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className={`flex items-center gap-4 p-3 border rounded-lg transition-all select-none ${
                                        draggedIndex === index
                                            ? 'border-dashed border-pink-400 bg-pink-50/20 opacity-50 cursor-grabbing'
                                            : dragOverIndex === index
                                            ? 'border-pink-500 bg-pink-50/50 scale-[1.01] cursor-grabbing'
                                            : 'border-slate-200 bg-white hover:border-pink-300 cursor-grab'
                                    }`}
                                >
                                    {/* Drag Handle */}
                                    {editingId === null && (
                                        <div className="text-slate-400 cursor-grab active:cursor-grabbing shrink-0">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    )}

                                    {/* Foto */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={vol.imagemUrl}
                                        alt={vol.nome}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
                                    />

                                    {editingId === vol.id ? (
                                        /* Modo edição */
                                        <div className="flex-1 space-y-2">
                                            <div className="grid md:grid-cols-2 gap-2">
                                                <Input
                                                    value={editNome}
                                                    onChange={e => setEditNome(e.target.value)}
                                                    placeholder="Nome"
                                                    className="bg-white border-slate-200 h-9 text-sm"
                                                />
                                                <Input
                                                    value={editRole}
                                                    onChange={e => setEditRole(e.target.value)}
                                                    placeholder="Função (opcional)"
                                                    className="bg-white border-slate-200 h-9 text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id={`edit-img-${vol.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="bg-white border-slate-200 h-9 text-xs flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    disabled={submitting}
                                                    onClick={() => handleUpdate(vol.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white h-9 px-3"
                                                >
                                                    {submitting ? 'Salvando...' : 'Salvar'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditingId(null)}
                                                    className="h-9 px-3 text-slate-500"
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Modo visualização */
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{vol.nome}</p>
                                                <p className="text-xs text-pink-600">{vol.role || 'Voluntário(a)'}</p>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-400 hover:text-blue-600 shrink-0"
                                                onClick={() => startEdit(vol)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0"
                                                onClick={() => handleDelete(vol.id, vol.nome)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
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

// ─── Componente LojinhaManager ────────────────────────────────────────────────
function LojinhaManager() {
    const [subTab, setSubTab] = useState<'produtos' | 'entrada' | 'consignacao' | 'venda' | 'devolucao' | 'extrato'>('produtos')
    const [produtos, setProdutos] = useState<any[]>([])
    const [consignacoes, setConsignacoes] = useState<any[]>([])
    const [movimentacoes, setMovimentacoes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Estados de formulário/modal de produto
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [prodNome, setProdNome] = useState('')
    const [prodCor, setProdCor] = useState('')
    const [prodPreco, setProdPreco] = useState('')
    const [prodDesc, setProdDesc] = useState('')
    const [prodAtivo, setProdAtivo] = useState(true)
    const [prodTamanhos, setProdTamanhos] = useState<{ tamanho: string; quantidade: number }[]>([])
    const [newTamanhoNome, setNewTamanhoNome] = useState('')
    const [newTamanhoQtd, setNewTamanhoQtd] = useState('')
    const [prodFoto, setProdFoto] = useState<File | null>(null)
    const [prodFotoPreview, setProdFotoPreview] = useState('')
    const [submittingProduct, setSubmittingProduct] = useState(false)

    // Estados da Entrada de Estoque
    const [entradaProdId, setEntradaProdId] = useState('')
    const [entradaQuantidades, setEntradaQuantidades] = useState<Record<string, number>>({})
    const [entradaResponsavel, setEntradaResponsavel] = useState('')
    const [submittingEntrada, setSubmittingEntrada] = useState(false)

    // Estados da Consignação
    const [consVendedora, setConsVendedora] = useState('')
    const [consProdId, setConsProdId] = useState('')
    const [consQuantidades, setConsQuantidades] = useState<Record<string, number>>({})
    const [consObs, setConsObs] = useState('')
    const [consResponsavel, setConsResponsavel] = useState('')
    const [submittingConsignacao, setSubmittingConsignacao] = useState(false)

    // Estados do Registro de Venda
    const [vendaProdId, setVendaProdId] = useState('')
    const [vendaOrigem, setVendaOrigem] = useState<'central' | 'consignado'>('central')
    const [vendaConsignacaoId, setVendaConsignacaoId] = useState('')
    const [vendaQuantidades, setVendaQuantidades] = useState<Record<string, number>>({})
    const [vendaValorTotal, setVendaValorTotal] = useState('')
    const [vendaVendedora, setVendaVendedora] = useState('')
    const [vendaResponsavel, setVendaResponsavel] = useState('')
    const [vendaObs, setVendaObs] = useState('')
    const [submittingVenda, setSubmittingVenda] = useState(false)

    // Estados da Devolução
    const [devolucaoConsId, setDevolucaoConsId] = useState('')
    const [devolucaoQuantidades, setDevolucaoQuantidades] = useState<Record<string, number>>({})
    const [devolucaoResponsavel, setDevolucaoResponsavel] = useState('')
    const [submittingDevolucao, setSubmittingDevolucao] = useState(false)

    // Filtros de Extrato
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [filtroProdId, setFiltroProdId] = useState('todos')
    const [filtroVendedora, setFiltroVendedora] = useState('')

    const carregarDados = async () => {
        setLoading(true)
        try {
            const [prods, cons, movs] = await Promise.all([
                getProdutos(),
                getConsignacoes(),
                getMovimentacoes()
            ])
            setProdutos(prods || [])
            setConsignacoes(cons || [])
            setMovimentacoes(movs || [])
        } catch (err) {
            console.error('Erro ao carregar dados da lojinha:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    // Recalcula o valor sugerido de venda
    useEffect(() => {
        if (!vendaProdId) return
        const prod = produtos.find(p => p.id === vendaProdId)
        if (!prod) return

        let totalItens = 0
        Object.keys(vendaQuantidades).forEach(k => {
            totalItens += vendaQuantidades[k] || 0
        })

        setVendaValorTotal((prod.preco * totalItens).toFixed(2))
    }, [vendaQuantidades, vendaProdId, produtos])

    // Preenche a vendedora automaticamente caso seja venda de consignado
    useEffect(() => {
        if (vendaOrigem === 'consignado' && vendaConsignacaoId) {
            const cons = consignacoes.find(c => c.id === vendaConsignacaoId)
            if (cons) setVendaVendedora(cons.vendedora)
        } else if (vendaOrigem === 'central') {
            setVendaVendedora('site')
        }
    }, [vendaOrigem, vendaConsignacaoId, consignacoes])

    const carregarGradePadrao = () => {
        setProdTamanhos([
            { tamanho: "12", quantidade: 0 },
            { tamanho: "14", quantidade: 0 },
            { tamanho: "16", quantidade: 0 },
            { tamanho: "PP", quantidade: 0 },
            { tamanho: "M",  quantidade: 0 },
            { tamanho: "G",  quantidade: 0 },
            { tamanho: "GG", quantidade: 0 },
            { tamanho: "X1", quantidade: 0 },
            { tamanho: "X2", quantidade: 0 }
        ])
    }

    const handleAddTamanho = () => {
        if (!newTamanhoNome.trim()) return
        const qtd = parseInt(newTamanhoQtd) || 0
        if (prodTamanhos.some(t => t.tamanho.toUpperCase() === newTamanhoNome.toUpperCase().trim())) {
            alert('Tamanho já adicionado.')
            return
        }
        setProdTamanhos([...prodTamanhos, { tamanho: newTamanhoNome.toUpperCase().trim(), quantidade: qtd }])
        setNewTamanhoNome('')
        setNewTamanhoQtd('')
    }

    const handleRemoveTamanho = (index: number) => {
        setProdTamanhos(prodTamanhos.filter((_, i) => i !== index))
    }

    const handleEditQuantity = (index: number, val: string) => {
        const updated = [...prodTamanhos]
        updated[index].quantidade = Math.max(0, parseInt(val) || 0)
        setProdTamanhos(updated)
    }

    const openCreateProduct = () => {
        setEditingProduct(null)
        setProdNome('')
        setProdCor('')
        setProdPreco('')
        setProdDesc('')
        setProdAtivo(true)
        setProdTamanhos([])
        setProdFoto(null)
        setProdFotoPreview('')
        setIsProductModalOpen(true)
    }

    const openEditProduct = (prod: any) => {
        setEditingProduct(prod)
        setProdNome(prod.nome)
        setProdCor(prod.cor || '')
        setProdPreco(prod.preco.toString())
        setProdDesc(prod.descricao || '')
        setProdAtivo(prod.ativo)
        setProdTamanhos(prod.tamanhos || [])
        setProdFoto(null)
        setProdFotoPreview(prod.fotoUrl || '')
        setIsProductModalOpen(true)
    }

    // Gravar Produto (Criar / Editar)
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prodNome) { alert('Nome é obrigatório'); return }
        if (!prodPreco || isNaN(parseFloat(prodPreco))) { alert('Preço inválido'); return }

        setSubmittingProduct(true)
        try {
            const formData = new FormData()
            formData.set('nome', prodNome)
            formData.set('cor', prodCor)
            formData.set('preco', prodPreco)
            formData.set('descricao', prodDesc)
            formData.set('ativo', prodAtivo ? 'true' : 'false')
            formData.set('tamanhos', JSON.stringify(prodTamanhos))
            formData.set('responsavel', 'Central GESTOR')

            if (prodFoto) {
                // Compressão de imagem do produto no cliente (limite de 1MB, tamanho ideal)
                const compressed = await imageCompression(prodFoto, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                })
                formData.set('foto', compressed, compressed.name)
            }

            let res
            if (editingProduct) {
                res = await editarProduto(editingProduct.id, formData)
            } else {
                res = await criarProduto(formData)
            }

            if (res.success) {
                alert(res.message)
                setIsProductModalOpen(false)
                carregarDados()
            } else {
                alert(res.message)
            }
        } catch (err) {
            console.error('Erro ao salvar produto:', err)
            alert('Ocorreu um erro ao salvar o produto.')
        } finally {
            setSubmittingProduct(false)
        }
    }

    // Entrada de Estoque
    const handleRegisterEntrada = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!entradaProdId) { alert('Selecione o produto'); return }

        const itens = Object.keys(entradaQuantidades)
            .map(tamanho => ({ tamanho, quantidade: entradaQuantidades[tamanho] }))
            .filter(item => item.quantidade > 0)

        if (itens.length === 0) { alert('Preencha quantidades maiores que zero'); return }

        setSubmittingEntrada(true)
        try {
            const res = await darEntradaEstoque(entradaProdId, itens, entradaResponsavel || 'Gestor Central')
            if (res.success) {
                alert(res.message)
                setEntradaQuantidades({})
                setEntradaProdId('')
                carregarDados()
            } else {
                alert(res.message)
            }
        } catch (err) {
            console.error(err)
            alert('Erro ao registrar entrada.')
        } finally {
            setSubmittingEntrada(false)
        }
    }

    // Registrar Consignação
    const handleRegisterConsignacao = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!consVendedora.trim()) { alert('Preencha o nome da vendedora'); return }
        if (!consProdId) { alert('Selecione o produto'); return }

        const itens = Object.keys(consQuantidades)
            .map(tamanho => ({ tamanho, quantidade: consQuantidades[tamanho] }))
            .filter(item => item.quantidade > 0)

        if (itens.length === 0) { alert('Insira pelo menos um item a consignar'); return }

        setSubmittingConsignacao(true)
        try {
            const res = await registrarConsignacao(
                consVendedora.trim(),
                consProdId,
                itens,
                consObs,
                consResponsavel || 'Gestor Central'
            )
            if (res.success) {
                alert(res.message)
                setConsQuantidades({})
                setConsVendedora('')
                setConsObs('')
                carregarDados()
            } else {
                alert(res.message)
            }
        } catch (err) {
            console.error(err)
            alert('Erro ao registrar consignação.')
        } finally {
            setSubmittingConsignacao(false)
        }
    }

    // Registrar Venda
    const handleRegisterVenda = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!vendaProdId) { alert('Selecione o produto'); return }
        if (vendaOrigem === 'consignado' && !vendaConsignacaoId) { alert('Selecione a consignação'); return }

        const itens = Object.keys(vendaQuantidades)
            .map(tamanho => ({ tamanho, quantidade: vendaQuantidades[tamanho] }))
            .filter(item => item.quantidade > 0)

        if (itens.length === 0) { alert('Insira quantidades vendidas'); return }

        setSubmittingVenda(true)
        try {
            const res = await registrarVenda({
                produtoId: vendaProdId,
                itens,
                origem: vendaOrigem,
                consignacaoId: vendaOrigem === 'consignado' ? vendaConsignacaoId : undefined,
                vendedora: vendaVendedora || (vendaOrigem === 'central' ? 'site' : ''),
                valorTotal: parseFloat(vendaValorTotal) || 0,
                responsavel: vendaResponsavel || 'Gestor Central',
                observacao: vendaObs
            })

            if (res.success) {
                alert(res.message)
                setVendaQuantidades({})
                setVendaProdId('')
                setVendaConsignacaoId('')
                setVendaObs('')
                carregarDados()
            } else {
                alert(res.message)
            }
        } catch (err) {
            console.error(err)
            alert('Erro ao registrar venda.')
        } finally {
            setSubmittingVenda(false)
        }
    }

    // Registrar Devolução
    const handleRegisterDevolucao = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!devolucaoConsId) { alert('Selecione a consignação'); return }

        const itens = Object.keys(devolucaoQuantidades)
            .map(tamanho => ({ tamanho, quantidade: devolucaoQuantidades[tamanho] }))
            .filter(item => item.quantidade > 0)

        if (itens.length === 0) { alert('Insira quantidades a devolver'); return }

        setSubmittingDevolucao(true)
        try {
            const res = await registrarDevolucao(devolucaoConsId, itens, devolucaoResponsavel || 'Gestor Central')
            if (res.success) {
                alert(res.message)
                setDevolucaoQuantidades({})
                setDevolucaoConsId('')
                carregarDados()
            } else {
                alert(res.message)
            }
        } catch (err) {
            console.error(err)
            alert('Erro ao registrar devolução.')
        } finally {
            setSubmittingDevolucao(false)
        }
    }

    // Filtragem das movimentações
    const movsFiltradas = movimentacoes.filter(mov => {
        if (filtroTipo !== 'todos' && mov.tipo !== filtroTipo) return false
        if (filtroProdId !== 'todos' && mov.produtoId !== filtroProdId) return false
        if (filtroVendedora.trim() && !mov.vendedora?.toLowerCase().includes(filtroVendedora.toLowerCase().trim())) return false
        return true
    })

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Sub Abas */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 bg-white p-4 rounded-xl shadow-sm">
                <Button variant={subTab === 'produtos' ? 'default' : 'ghost'} className={subTab === 'produtos' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('produtos')}>
                    <Package className="w-4 h-4 mr-2" /> Produtos
                </Button>
                <Button variant={subTab === 'entrada' ? 'default' : 'ghost'} className={subTab === 'entrada' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('entrada')}>
                    <ArrowDownLeft className="w-4 h-4 mr-2" /> Entrada Central
                </Button>
                <Button variant={subTab === 'consignacao' ? 'default' : 'ghost'} className={subTab === 'consignacao' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('consignacao')}>
                    <Users className="w-4 h-4 mr-2" /> Consignação
                </Button>
                <Button variant={subTab === 'venda' ? 'default' : 'ghost'} className={subTab === 'venda' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('venda')}>
                    <DollarSign className="w-4 h-4 mr-2" /> Registrar Venda
                </Button>
                <Button variant={subTab === 'devolucao' ? 'default' : 'ghost'} className={subTab === 'devolucao' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('devolucao')}>
                    <Undo2 className="w-4 h-4 mr-2" /> Devolução
                </Button>
                <Button variant={subTab === 'extrato' ? 'default' : 'ghost'} className={subTab === 'extrato' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'text-slate-600'} onClick={() => setSubTab('extrato')}>
                    <History className="w-4 h-4 mr-2" /> Extrato e Relatório
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12 text-slate-400">
                    <Sparkles className="w-6 h-6 animate-spin text-pink-600 mr-2" />
                    <span>Carregando dados da Lojinha...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* ─── ABA PRODUTOS ─── */}
                    {subTab === 'produtos' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">Camisetas &amp; Produtos</h3>
                                <Button onClick={openCreateProduct} className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                                    <Plus className="w-4 h-4" /> Cadastrar Produto
                                </Button>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {produtos.map(prod => (
                                    <Card key={prod.id} className={`bg-white border-slate-200 shadow-sm relative overflow-hidden flex flex-col ${!prod.ativo ? 'opacity-60' : ''}`}>
                                        <div className="h-48 bg-slate-100 relative">
                                            {prod.fotoUrl ? (
                                                <img src={prod.fotoUrl} alt={prod.nome} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><ImageIcon className="w-12 h-12" /></div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-white font-bold">
                                                R$ {prod.preco.toFixed(2)}
                                            </div>
                                        </div>
                                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 leading-snug">{prod.nome}</h4>
                                                    <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded border border-pink-100 font-medium">{prod.cor}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{prod.descricao || 'Sem descrição cadastrada.'}</p>
                                                
                                                {/* Grade de tamanhos */}
                                                <div className="mb-4">
                                                    <p className="text-xs uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Estoque Central</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {prod.tamanhos?.map((t: any) => (
                                                            <div key={t.tamanho} className={`text-xs px-2 py-1 rounded border flex items-center gap-1.5 ${t.quantidade === 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                                                <span className="font-bold">{t.tamanho}:</span>
                                                                <span>{t.quantidade}</span>
                                                            </div>
                                                        ))}
                                                        {(!prod.tamanhos || prod.tamanhos.length === 0) && (
                                                            <span className="text-xs text-slate-400 italic">Nenhum tamanho configurado.</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                                <span className={`text-xs font-semibold ${prod.ativo ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {prod.ativo ? '• Ativo na Vitrine' : '• Inativo'}
                                                </span>
                                                <Button size="sm" variant="outline" onClick={() => openEditProduct(prod)} className="border-slate-200 hover:bg-slate-50 gap-1.5">
                                                    <Pencil className="w-3.5 h-3.5" /> Editar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Modal de Criar/Editar Produto */}
                            {isProductModalOpen && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                                            {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                                        </h3>
                                        <form onSubmit={handleSaveProduct} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label>Nome do Produto *</Label>
                                                    <Input required value={prodNome} onChange={e => setProdNome(e.target.value)} placeholder="Ex: Camiseta Rosa Campanha" className="bg-white" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label>Cor *</Label>
                                                        <Input required value={prodCor} onChange={e => setProdCor(e.target.value)} placeholder="Ex: Rosa" className="bg-white" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Preço (R$) *</Label>
                                                        <Input required type="number" step="0.01" min="0" value={prodPreco} onChange={e => setProdPreco(e.target.value)} placeholder="Ex: 45.00" className="bg-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label>Descrição</Label>
                                                <Textarea value={prodDesc} onChange={e => setProdDesc(e.target.value)} placeholder="Informações detalhadas do produto para a vitrine..." className="bg-white h-16" />
                                            </div>

                                            <div className="flex items-center gap-2 py-2">
                                                <input type="checkbox" id="prodAtivoCheck" checked={prodAtivo} onChange={e => setProdAtivo(e.target.checked)} className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 w-4 h-4" />
                                                <Label htmlFor="prodAtivoCheck" className="cursor-pointer select-none font-medium">Exibir produto ativo na vitrine</Label>
                                            </div>

                                            {/* Grade de Tamanhos e Quantidades */}
                                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-sm text-slate-800">Grade de Tamanhos</span>
                                                    <Button type="button" size="sm" variant="outline" onClick={carregarGradePadrao} className="text-xs">
                                                        Carregar Tamanhos Padrão (Lote 1)
                                                    </Button>
                                                </div>

                                                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                                                    {prodTamanhos.map((t, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-1 shadow-sm">
                                                            <span className="font-bold text-xs uppercase text-slate-600">{t.tamanho}:</span>
                                                            <input type="number" min="0" value={t.quantidade} onChange={e => handleEditQuantity(idx, e.target.value)} className="w-12 text-center text-xs h-6 border-slate-200 rounded font-semibold bg-slate-50 focus:bg-white" />
                                                            <button type="button" onClick={() => handleRemoveTamanho(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold px-0.5 ml-1">✕</button>
                                                        </div>
                                                    ))}
                                                    {prodTamanhos.length === 0 && (
                                                        <p className="text-xs text-slate-400 italic">Nenhum tamanho adicionado na grade. Adicione abaixo.</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 items-end border-t border-slate-200 pt-3">
                                                    <div className="w-1/2 space-y-1">
                                                        <Label className="text-xs">Tamanho (Ex: GG, M, 14)</Label>
                                                        <Input size={10} value={newTamanhoNome} onChange={e => setNewTamanhoNome(e.target.value)} placeholder="Tamanho" className="bg-white h-8 text-xs" />
                                                    </div>
                                                    <div className="w-1/2 space-y-1">
                                                        <Label className="text-xs">Qtd Inicial Estoque</Label>
                                                        <Input type="number" min="0" value={newTamanhoQtd} onChange={e => setNewTamanhoQtd(e.target.value)} placeholder="Qtd" className="bg-white h-8 text-xs" />
                                                    </div>
                                                    <Button type="button" size="sm" onClick={handleAddTamanho} className="bg-slate-700 hover:bg-slate-800 text-white text-xs h-8">Adicionar</Button>
                                                </div>
                                            </div>

                                            {/* Foto do produto */}
                                            <div className="space-y-1">
                                                <Label>Foto do Produto</Label>
                                                <div className="flex items-center gap-4">
                                                    {prodFotoPreview && (
                                                        <img src={prodFotoPreview} alt="Preview" className="w-16 h-16 rounded object-cover border border-slate-200" />
                                                    )}
                                                    <Input type="file" accept="image/*" onChange={e => {
                                                        const f = e.target.files?.[0]
                                                        if (f) {
                                                            setProdFoto(f)
                                                            setProdFotoPreview(URL.createObjectURL(f))
                                                        }
                                                    }} className="bg-white" />
                                                </div>
                                                <p className="text-[10px] text-slate-400">Imagens quadradas são ideais. A imagem será compactada no cliente antes do envio.</p>
                                            </div>

                                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                                                <Button type="button" variant="ghost" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
                                                <Button type="submit" disabled={submittingProduct} className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                                                    {submittingProduct ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    {submittingProduct ? 'Salvando...' : 'Confirmar e Salvar'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── ABA ENTRADA DE ESTOQUE ─── */}
                    {subTab === 'entrada' && (
                        <Card className="bg-white border-slate-200 shadow-sm max-w-xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <ArrowDownLeft className="text-green-600 w-5 h-5" />
                                    Dar Entrada de Lote
                                </CardTitle>
                                <CardDescription>Adicione novas peças recém-chegadas ao estoque central do produto selecionado.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRegisterEntrada} className="space-y-5">
                                    <div className="space-y-1">
                                        <Label>Selecionar Produto</Label>
                                        <Select value={entradaProdId} onValueChange={v => { setEntradaProdId(v); setEntradaQuantidades({}) }}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione o produto..." /></SelectTrigger>
                                            <SelectContent>
                                                {produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome} ({p.cor})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {entradaProdId && (
                                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 animate-fadeIn">
                                            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Lançar Quantidades por Tamanho</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                {produtos.find(p => p.id === entradaProdId)?.tamanhos?.map((t: any) => (
                                                    <div key={t.tamanho} className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center gap-1 shadow-sm">
                                                        <span className="font-bold text-xs text-slate-700 uppercase">{t.tamanho}</span>
                                                        <span className="text-[10px] text-slate-400">Saldo atual: {t.quantidade}</span>
                                                        <Input type="number" min="0" value={entradaQuantidades[t.tamanho] || ''} onChange={e => {
                                                            setEntradaQuantidades({
                                                                ...entradaQuantidades,
                                                                [t.tamanho]: Math.max(0, parseInt(e.target.value) || 0)
                                                            })
                                                        }} className="text-center h-8 font-semibold w-16" placeholder="0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <Label>Responsável pelo Lançamento</Label>
                                        <Input value={entradaResponsavel} onChange={e => setEntradaResponsavel(e.target.value)} placeholder="Ex: Fabricio - Gestor" className="bg-white" />
                                    </div>

                                    <Button type="submit" disabled={submittingEntrada || !entradaProdId} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                                        {submittingEntrada ? 'Registrando entrada...' : 'Confirmar e Somar ao Estoque'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* ─── ABA CONSIGNAÇÃO ─── */}
                    {subTab === 'consignacao' && (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1 h-fit">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 flex items-center gap-2">
                                        <Users className="text-pink-600 w-5 h-5" />
                                        Registrar Consignação
                                    </CardTitle>
                                    <CardDescription>Retira peças do estoque central e atribui a uma vendedora para eventos.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRegisterConsignacao} className="space-y-4">
                                        <div className="space-y-1">
                                            <Label>Vendedora (Nome Livre) *</Label>
                                            <Input required value={consVendedora} onChange={e => setConsVendedora(e.target.value)} placeholder="Ex: Fabricio" className="bg-white" />
                                        </div>

                                        <div className="space-y-1">
                                            <Label>Selecionar Produto *</Label>
                                            <Select value={consProdId} onValueChange={v => { setConsProdId(v); setConsQuantidades({}) }}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione o produto..." /></SelectTrigger>
                                                <SelectContent>
                                                    {produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome} ({p.cor})</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {consProdId && (
                                            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                                                <h4 className="font-bold text-xs uppercase text-slate-500">Quantidades Levadas</h4>
                                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                                    {produtos.find(p => p.id === consProdId)?.tamanhos?.map((t: any) => (
                                                        <div key={t.tamanho} className="bg-white px-3 py-1.5 rounded border border-slate-200 flex justify-between items-center shadow-sm text-xs">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-800 uppercase">Tamanho {t.tamanho}</span>
                                                                <span className="text-[10px] text-slate-400">Central: {t.quantidade} disponíveis</span>
                                                            </div>
                                                            <Input type="number" min="0" max={t.quantidade} value={consQuantidades[t.tamanho] || ''} onChange={e => {
                                                                const val = Math.max(0, parseInt(e.target.value) || 0)
                                                                if (val > t.quantidade) {
                                                                    alert(`Você não pode consignar mais do que há no estoque central (${t.quantidade}).`)
                                                                    return
                                                                }
                                                                setConsQuantidades({
                                                                    ...consQuantidades,
                                                                    [t.tamanho]: val
                                                                })
                                                            }} className="text-center h-8 font-semibold w-16" placeholder="0" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <Label>Observação / Evento</Label>
                                            <Textarea value={consObs} onChange={e => setConsObs(e.target.value)} placeholder="Ex: Evento Praça de Alimentação 12/06" className="bg-white h-16" />
                                        </div>

                                        <div className="space-y-1">
                                            <Label>Responsável</Label>
                                            <Input value={consResponsavel} onChange={e => setConsResponsavel(e.target.value)} placeholder="Ex: Central GESTOR" className="bg-white" />
                                        </div>

                                        <Button type="submit" disabled={submittingConsignacao || !consProdId} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                                            {submittingConsignacao ? 'Registrando...' : 'Confirmar e Consignar'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Consignações abertas */}
                            <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Consignações Abertas</CardTitle>
                                    <CardDescription>Peças que estão em mãos de vendedoras. O saldo restante diminui com vendas e devoluções.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {consignacoes.filter(c => c.status === 'aberta').length === 0 ? (
                                            <p className="text-sm text-slate-400 italic py-6 text-center">Nenhuma consignação aberta no momento.</p>
                                        ) : (
                                            consignacoes.filter(c => c.status === 'aberta').map(cons => (
                                                <div key={cons.id} className="border border-slate-200 rounded-lg p-4 hover:border-pink-300 transition-colors bg-white shadow-sm space-y-3">
                                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-base">{cons.vendedora}</h4>
                                                            <p className="text-xs text-slate-500">Produto: <span className="font-semibold">{cons.produtoNome}</span></p>
                                                            {cons.observacao && <p className="text-xs bg-slate-50 px-2 py-1 rounded italic text-slate-600 mt-1 border border-slate-100">{cons.observacao}</p>}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs bg-pink-50 text-pink-600 border border-pink-100 rounded px-2 py-0.5 font-bold uppercase">Em Aberto</span>
                                                            <p className="text-[10px] text-slate-400 mt-1">Registrado: {new Date(cons.createdAt).toLocaleDateString('pt-BR')}</p>
                                                        </div>
                                                    </div>

                                                    {/* Saldo na Consignação */}
                                                    <div className="bg-slate-50 rounded p-3 border border-slate-100">
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Saldo em Mãos (Restante)</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {cons.itens?.map((i: any) => (
                                                                <div key={i.tamanho} className={`text-xs px-2.5 py-1 rounded border font-semibold ${i.quantidade === 0 ? 'bg-red-50 text-red-400 border-red-100/50' : 'bg-white text-slate-700 border-slate-200'}`}>
                                                                    {i.tamanho}: {i.quantidade} unidades
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ─── ABA REGISTRAR VENDA ─── */}
                    {subTab === 'venda' && (
                        <Card className="bg-white border-slate-200 shadow-sm max-w-xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <DollarSign className="text-pink-600 w-5 h-5" />
                                    Registrar Venda (Confirmada / PIX)
                                </CardTitle>
                                <CardDescription>Gera a baixa de estoque correspondente. A venda pode vir do estoque central ou do estoque de uma vendedora.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRegisterVenda} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label>Selecionar Produto *</Label>
                                        <Select value={vendaProdId} onValueChange={v => { setVendaProdId(v); setVendaConsignacaoId(''); setVendaQuantidades({}) }}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione o produto..." /></SelectTrigger>
                                            <SelectContent>
                                                {produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome} ({p.cor})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Origem da Peça *</Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input type="radio" name="vendaOrigem" checked={vendaOrigem === 'central'} onChange={() => { setVendaOrigem('central'); setVendaConsignacaoId(''); setVendaQuantidades({}) }} className="text-pink-600 focus:ring-pink-500" />
                                                <span className="text-sm font-medium">Estoque Central</span>
                                            </label>
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input type="radio" name="vendaOrigem" checked={vendaOrigem === 'consignado'} onChange={() => { setVendaOrigem('consignado'); setVendaQuantidades({}) }} className="text-pink-600 focus:ring-pink-500" />
                                                <span className="text-sm font-medium">Consignado com Vendedora</span>
                                            </label>
                                        </div>
                                    </div>

                                    {vendaOrigem === 'consignado' && vendaProdId && (
                                        <div className="space-y-1 animate-fadeIn">
                                            <Label>Selecionar a Consignação da Vendedora *</Label>
                                            <Select value={vendaConsignacaoId} onValueChange={v => { setVendaConsignacaoId(v); setVendaQuantidades({}) }}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione qual consignação..." /></SelectTrigger>
                                                <SelectContent>
                                                    {consignacoes.filter(c => c.status === 'aberta' && c.produtoId === vendaProdId).map(c => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.vendedora} · Levou em {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                                                        </SelectItem>
                                                    ))}
                                                    {consignacoes.filter(c => c.status === 'aberta' && c.produtoId === vendaProdId).length === 0 && (
                                                        <SelectItem disabled value="nenhuma">Nenhuma consignação aberta deste produto</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {vendaProdId && (vendaOrigem === 'central' || (vendaOrigem === 'consignado' && vendaConsignacaoId)) && (
                                        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                                            <h4 className="font-bold text-xs uppercase text-slate-500">Selecionar Tamanhos Vendidos</h4>
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                                {(() => {
                                                    let gradeDisponivel: { tamanho: string; quantidade: number }[] = []
                                                    if (vendaOrigem === 'central') {
                                                        gradeDisponivel = produtos.find(p => p.id === vendaProdId)?.tamanhos || []
                                                    } else {
                                                        gradeDisponivel = consignacoes.find(c => c.id === vendaConsignacaoId)?.itens || []
                                                    }

                                                    return gradeDisponivel.map(t => (
                                                        <div key={t.tamanho} className="bg-white px-3 py-1.5 rounded border border-slate-200 flex justify-between items-center shadow-sm text-xs">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-800 uppercase">Tamanho {t.tamanho}</span>
                                                                <span className="text-[10px] text-slate-400">Disponível: {t.quantidade} unidades</span>
                                                            </div>
                                                            <Input type="number" min="0" max={t.quantidade} value={vendaQuantidades[t.tamanho] || ''} onChange={e => {
                                                                const val = Math.max(0, parseInt(e.target.value) || 0)
                                                                if (val > t.quantidade) {
                                                                    alert(`A quantidade vendida excede o saldo disponível (${t.quantidade}).`)
                                                                    return
                                                                }
                                                                setVendaQuantidades({
                                                                    ...vendaQuantidades,
                                                                    [t.tamanho]: val
                                                                })
                                                            }} className="text-center h-8 font-semibold w-16" placeholder="0" />
                                                        </div>
                                                    ))
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Vendedora (Identificação)</Label>
                                            <Input disabled={vendaOrigem === 'consignado'} value={vendaVendedora} onChange={e => setVendaVendedora(e.target.value)} placeholder="Ex: site, Fabricio, etc." className="bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Valor Total Cobrado (R$)</Label>
                                            <Input type="number" step="0.01" value={vendaValorTotal} onChange={e => setVendaValorTotal(e.target.value)} className="bg-white font-bold text-pink-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Responsável pelo Lançamento</Label>
                                            <Input value={vendaResponsavel} onChange={e => setVendaResponsavel(e.target.value)} placeholder="Ex: Gestor Central" className="bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Observações da Venda</Label>
                                            <Input value={vendaObs} onChange={e => setVendaObs(e.target.value)} placeholder="Ex: Pago em PIX no dinheiro" className="bg-white" />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={submittingVenda || !vendaProdId} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                                        {submittingVenda ? 'Confirmando venda...' : 'Registrar Venda e Baixar Estoque'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* ─── ABA DEVOLUÇÃO ─── */}
                    {subTab === 'devolucao' && (
                        <Card className="bg-white border-slate-200 shadow-sm max-w-xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <Undo2 className="text-pink-600 w-5 h-5" />
                                    Registrar Devolução de Consignação
                                </CardTitle>
                                <CardDescription>Insere peças de volta no estoque central a partir de uma consignação aberta com uma vendedora.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRegisterDevolucao} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label>Selecionar Consignação em Aberto *</Label>
                                        <Select value={devolucaoConsId} onValueChange={v => { setDevolucaoConsId(v); setDevolucaoQuantidades({}) }}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione a consignação..." /></SelectTrigger>
                                            <SelectContent>
                                                {consignacoes.filter(c => c.status === 'aberta').map(c => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.vendedora} · {c.produtoNome} (Criada em {new Date(c.createdAt).toLocaleDateString('pt-BR')})
                                                    </SelectItem>
                                                ))}
                                                {consignacoes.filter(c => c.status === 'aberta').length === 0 && (
                                                    <SelectItem disabled value="nenhuma">Nenhuma consignação aberta encontrada</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {devolucaoConsId && (
                                        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2 animate-fadeIn">
                                            <h4 className="font-bold text-xs uppercase text-slate-500">Lançar Peças Devolvidas</h4>
                                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                                {consignacoes.find(c => c.id === devolucaoConsId)?.itens?.map((t: any) => (
                                                    <div key={t.tamanho} className="bg-white px-3 py-1.5 rounded border border-slate-200 flex justify-between items-center shadow-sm text-xs">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-800 uppercase">Tamanho {t.tamanho}</span>
                                                            <span className="text-[10px] text-slate-400">Saldo com ela: {t.quantidade} unidades</span>
                                                        </div>
                                                        <Input type="number" min="0" max={t.quantidade} value={devolucaoQuantidades[t.tamanho] || ''} onChange={e => {
                                                            const val = Math.max(0, parseInt(e.target.value) || 0)
                                                            if (val > t.quantidade) {
                                                                alert(`A quantidade devolvida não pode exceder o saldo com ela (${t.quantidade}).`)
                                                                return
                                                            }
                                                            setDevolucaoQuantidades({
                                                                ...devolucaoQuantidades,
                                                                [t.tamanho]: val
                                                            })
                                                        }} className="text-center h-8 font-semibold w-16" placeholder="0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <Label>Responsável pelo Recebimento</Label>
                                        <Input value={devolucaoResponsavel} onChange={e => setDevolucaoResponsavel(e.target.value)} placeholder="Ex: Gestor Central" className="bg-white" />
                                    </div>

                                    <Button type="submit" disabled={submittingDevolucao || !devolucaoConsId} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                                        {submittingDevolucao ? 'Registrando devolução...' : 'Confirmar Devolução e Somar no Central'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* ─── ABA EXTRATO E RELATÓRIO ─── */}
                    {subTab === 'extrato' && (
                        <div className="space-y-6">
                            {/* Consolidação do estoque atual */}
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 flex items-center gap-2">
                                        <Package className="text-pink-600 w-5 h-5" />
                                        Posição Consolidada do Estoque (Auditoria)
                                    </CardTitle>
                                    <CardDescription>Resumo dos saldos centrais e saldo total no momento.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase text-xs">
                                                    <th className="p-3">Produto</th>
                                                    <th className="p-3">Cor</th>
                                                    <th className="p-3 text-center">Preço</th>
                                                    <th className="p-3">Saldos por Tamanho</th>
                                                    <th className="p-3 text-center">Total Central</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {produtos.map(p => {
                                                    const total = p.tamanhos?.reduce((acc: number, curr: any) => acc + curr.quantidade, 0) || 0
                                                    return (
                                                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="p-3 font-semibold text-slate-800">{p.nome}</td>
                                                            <td className="p-3 text-slate-600">{p.cor}</td>
                                                            <td className="p-3 text-center text-slate-600">R$ {p.preco.toFixed(2)}</td>
                                                            <td className="p-3">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {p.tamanhos?.map((t: any) => (
                                                                        <span key={t.tamanho} className={`px-2 py-0.5 rounded text-xs border font-medium ${t.quantidade === 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                                            {t.tamanho}: {t.quantidade}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-center font-bold text-pink-600 text-base">{total}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Extrato / Log de Movimentações */}
                            <Card className="bg-white border-slate-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <CardTitle className="text-slate-900 flex items-center gap-2">
                                                <History className="text-pink-600 w-5 h-5" />
                                                Histórico de Movimentações
                                            </CardTitle>
                                            <CardDescription>Extrato detalhado de toda movimentação realizada.</CardDescription>
                                        </div>
                                        {/* Filtros */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="w-32">
                                                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                                    <SelectTrigger className="bg-white h-9 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="todos">Todos Tipos</SelectItem>
                                                        <SelectItem value="entrada">Entrada</SelectItem>
                                                        <SelectItem value="consignacao">Consignação</SelectItem>
                                                        <SelectItem value="venda">Venda</SelectItem>
                                                        <SelectItem value="devolucao">Devolução</SelectItem>
                                                        <SelectItem value="ajuste">Ajuste</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-40">
                                                <Select value={filtroProdId} onValueChange={setFiltroProdId}>
                                                    <SelectTrigger className="bg-white h-9 text-xs"><SelectValue placeholder="Produto" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="todos">Todos Produtos</SelectItem>
                                                        {produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Input placeholder="Buscar Vendedora..." value={filtroVendedora} onChange={e => setFiltroVendedora(e.target.value)} className="w-36 h-9 text-xs bg-white" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase text-xs">
                                                    <th className="p-3">Data</th>
                                                    <th className="p-3">Operação</th>
                                                    <th className="p-3">Produto</th>
                                                    <th className="p-3">Grade Movimentada</th>
                                                    <th className="p-3">Origem/Vendedora</th>
                                                    <th className="p-3">Responsável</th>
                                                    <th className="p-3">Valor / Obs</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {movsFiltradas.map((mov, idx) => {
                                                    // Badge cores
                                                    let badgeClass = ''
                                                    switch (mov.tipo) {
                                                        case 'entrada': badgeClass = 'bg-green-50 text-green-600 border-green-200'; break
                                                        case 'consignacao': badgeClass = 'bg-blue-50 text-blue-600 border-blue-200'; break
                                                        case 'venda': badgeClass = 'bg-pink-50 text-pink-600 border-pink-200'; break
                                                        case 'devolucao': badgeClass = 'bg-amber-50 text-amber-600 border-amber-200'; break
                                                        default: badgeClass = 'bg-slate-100 text-slate-600 border-slate-300'
                                                    }

                                                    return (
                                                        <tr key={mov.id || idx} className="hover:bg-slate-50 transition-colors text-xs">
                                                            <td className="p-3 text-slate-500 whitespace-nowrap">
                                                                {new Date(mov.data || mov.createdAt).toLocaleDateString('pt-BR')} {new Date(mov.data || mov.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </td>
                                                            <td className="p-3">
                                                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                                                    {mov.tipo}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 font-semibold text-slate-800">{mov.produtoNome}</td>
                                                            <td className="p-3">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {mov.itens?.map((i: any) => (
                                                                        <span key={i.tamanho} className="bg-slate-50 text-slate-600 border border-slate-200 rounded px-1.5 py-0.2 font-medium">
                                                                            {i.tamanho} ({i.quantidade > 0 ? `+${i.quantidade}` : i.quantidade})
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-slate-700">
                                                                {mov.vendedora ? (
                                                                    <span className="font-semibold text-pink-600">{mov.vendedora}</span>
                                                                ) : (
                                                                    <span className="text-slate-400 italic">{mov.origem || 'central'}</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-slate-500 whitespace-nowrap">{mov.responsavel || 'Gestor'}</td>
                                                            <td className="p-3">
                                                                {mov.tipo === 'venda' && mov.valorTotal !== undefined && (
                                                                    <p className="font-bold text-green-600 mb-0.5">R$ {mov.valorTotal.toFixed(2)}</p>
                                                                )}
                                                                {mov.observacao && <p className="text-[10px] text-slate-400 italic leading-snug">{mov.observacao}</p>}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                {movsFiltradas.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="p-6 text-center text-slate-400 italic">Nenhuma movimentação encontrada com os filtros selecionados.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

