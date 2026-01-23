"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight, X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCalendarEvents } from "@/app/admin/actions";

// Base month data
const baseMonths = [
    { name: "JAN", full: "Janeiro", bg: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)", monthNum: 1 },
    { name: "FEV", full: "Fevereiro", bg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", monthNum: 2 },
    { name: "MAR", full: "Março", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", monthNum: 3 },
    { name: "ABR", full: "Abril", bg: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", monthNum: 4 },
    { name: "MAI", full: "Maio", bg: "linear-gradient(135deg, #feada6 0%, #f5efef 100%)", monthNum: 5 }, // Just simplified gradients for distinct looks
    { name: "JUN", full: "Junho", bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", monthNum: 6 }, // Reuse or use new
    { name: "JUL", full: "Julho", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", monthNum: 7 },
    { name: "AGO", full: "Agosto", bg: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)", monthNum: 8 },
    { name: "SET", full: "Setembro", bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", monthNum: 9 },
    { name: "OUT", full: "Outubro", bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", monthNum: 10 },
    { name: "NOV", full: "Novembro", bg: "linear-gradient(to top, #30cfd0 0%, #330867 100%)", monthNum: 11 },
    { name: "DEZ", full: "Dezembro", bg: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)", monthNum: 12 },
];
// Note: Updating gradients to be more "icon-like" vibrant and smooth

// Generate 24 months (2026 and 2027)
const calendarData = [
    ...baseMonths.map(m => ({ ...m, year: 2026 })),
    ...baseMonths.map(m => ({ ...m, year: 2027 }))
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Interaction State
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Arch Radius configuration
    const radius = 1500;

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger, Observer);
        if (!wheelRef.current) return;

        // Position cards around the wheel - Full Circle Loop
        // 24 cards * 15 degrees = 360 degrees.
        const sliceDeg = 15;
        const initialOffset = -90; // Start Top Center

        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const angleDeg = initialOffset + (i * sliceDeg);
            gsap.set(card, {
                rotation: angleDeg + 90,
                x: Math.cos(angleDeg * Math.PI / 180) * radius,
                y: Math.sin(angleDeg * Math.PI / 180) * radius,
                transformOrigin: "50% 50%"
            });
        });

        // Rotation Logic
        let currentRotation = 0;
        const observer = Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            onChange: (self) => {
                if (activeCardIndex !== null) return; // Disable scroll when active
                const delta = self.deltaY * 0.15;
                currentRotation -= delta;
                gsap.to(wheelRef.current, {
                    rotation: currentRotation, duration: 0.8, ease: "power2.out", overwrite: true
                });
            }
        });

        // Intro Animation
        gsap.from(wheelRef.current, {
            rotation: 40, opacity: 0, duration: 1.5, ease: "power2.out"
        });

        return () => observer.kill();
    }, { scope: containerRef, dependencies: [activeCardIndex] });

    // Handle Closing
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveCardIndex(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleCardClick = async (index: number, year: number, monthNum: number) => {
        if (activeCardIndex !== null) return;
        setActiveCardIndex(index);
        setLoadingEvents(true);
        setEvents([]);
        try {
            const data = await getCalendarEvents(year, monthNum);
            setEvents(data);
        } catch (e) { console.error(e); }
        finally { setLoadingEvents(false); }
    };

    return (
        <SmoothScrolling>
            <div
                ref={containerRef}
                className="relative w-full h-[100vh] overflow-hidden flex flex-col items-center justify-end font-sans selection:bg-pink-500/30 PerspectiveContainer"
                style={{ backgroundColor: '#ffffff', color: '#1e293b', perspective: '1000px' }}
            >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-[120px]"
                    style={{
                        width: '80vw', height: '40vh',
                        background: 'radial-gradient(circle, #ffe4e6 0%, transparent 70%)',
                        opacity: 0.6, zIndex: 10
                    }}
                />

                {/* The Wheel Container */}
                <motion.div
                    ref={wheelRef}
                    className="absolute left-1/2 z-20 will-change-transform"
                    animate={{
                        opacity: activeCardIndex !== null ? 0 : 1,
                        scale: activeCardIndex !== null ? 0.8 : 1,
                        filter: activeCardIndex !== null ? "blur(5px)" : "blur(0px)"
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '0px', height: '0px', top: `calc(320px + ${radius}px)` }}
                >
                    {calendarData.map((item, index) => (
                        <div
                            key={index}
                            ref={el => { cardsRef.current[index] = el }}
                            className="absolute flex items-center justify-center cursor-pointer group"
                            style={{ width: '220px', height: '220px', left: -110, top: -110 }} // Adjusted to be square-ish
                            onClick={() => handleCardClick(index, item.year, item.monthNum)}
                        >
                            {/* Card Content - Shared Layout ID */}
                            {activeCardIndex !== index && (
                                <motion.div
                                    layoutId={`card-container-${index}`}
                                    className="w-full h-full rounded-[48px] shadow-2xl transition-all duration-300 ease-out group-hover:scale-110 relative"
                                    style={{
                                        background: item.bg,
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                                        backfaceVisibility: 'hidden'
                                    }}
                                >
                                    {/* Icon Style Overlay */}
                                    <div className="absolute inset-2 border-[4px] border-white/40 rounded-[40px] pointer-events-none" />

                                    {/* Rings */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                                        <div className="w-3 h-6 bg-white/80 rounded-full shadow-sm" />
                                        <div className="w-3 h-6 bg-white/80 rounded-full shadow-sm" />
                                        <div className="w-3 h-6 bg-white/80 rounded-full shadow-sm" />
                                    </div>

                                    {/* Content inside the icon */}
                                    <div className="w-full h-full flex flex-col items-center justify-center pt-6 text-white text-center p-4">
                                        <motion.h3 layoutId={`card-title-${index}`} className="text-4xl font-black tracking-tighter drop-shadow-md">
                                            {item.name}
                                        </motion.h3>
                                        <motion.p layoutId={`card-year-${index}`} className="text-xl font-medium opacity-90 drop-shadow-sm">
                                            {item.year}
                                        </motion.p>

                                        {/* Grid Decoration */}
                                        <div className="mt-4 grid grid-cols-4 gap-1.5 opacity-60">
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className="w-2.5 h-2.5 rounded-[2px] bg-white" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Folded Corner Effect (CSS) */}
                                    <div
                                        className="absolute bottom-4 right-4 w-8 h-8 bg-black/10 rounded-tl-xl rounded-br-[30px]"
                                        style={{ borderTopLeftRadius: '12px', borderBottomRightRadius: '30px' }}
                                    />

                                </motion.div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Text Title - Dark Text for Light Mode */}
                <motion.div
                    className="relative z-30 text-center pb-20 select-none"
                    animate={{ opacity: activeCardIndex !== null ? 0 : 1, y: activeCardIndex !== null ? 50 : 0 }}
                    style={{ pointerEvents: activeCardIndex !== null ? 'none' : 'auto' }}
                >
                    <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter leading-none text-slate-900 mb-2">CALENDÁRIO</h1>
                    <span className="text-2xl md:text-3xl font-light text-slate-500 tracking-[0.5em]">2026 / 27</span>
                    <div className="mt-8">
                        <Link href="/">
                            <button className="px-8 py-3 border border-slate-300 bg-transparent text-slate-900 text-sm font-bold rounded-full uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors">
                                Voltar ao Início
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* EXPANDED MODAL (Flip & Zoom Target) */}
                <AnimatePresence>
                    {activeCardIndex !== null && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-white/80 backdrop-blur-xl"
                                onClick={() => setActiveCardIndex(null)}
                            />

                            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
                                <motion.div
                                    layoutId={`card-container-${activeCardIndex}`} // Maintains shared layout transition
                                    initial={{ opacity: 0, rotateY: 90, scale: 0.6 }} // Start from 90deg (edge) to avoid mirror effect
                                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotateY: 90, scale: 0.6 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 120, mass: 1 }} // Smoother transition
                                    className="relative w-full max-w-lg md:max-w-3xl aspect-[3/4] md:aspect-[4/3] bg-[#fffbf2] rounded-[32px] overflow-hidden flex shadow-2xl pointer-events-auto"
                                    style={{
                                        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 50px 100px -20px rgba(0,0,0,0.2)',
                                        transformStyle: "preserve-3d", // Essential for flip
                                        perspective: "1000px"
                                    }}
                                >
                                    {/* Sidebar / colored spine of the "book" */}
                                    <div
                                        className="w-16 md:w-24 flex-shrink-0 flex flex-col items-center py-8 text-white relative overflow-hidden"
                                        style={{ background: calendarData[activeCardIndex].bg }}
                                    >
                                        <motion.div layoutId={`card-num-${activeCardIndex}`} className="text-4xl font-black opacity-30 mb-8">
                                            {(activeCardIndex % 12) + 1}
                                        </motion.div>
                                        <div className="flex-1 flex flex-col items-center justify-center gap-12" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                            <motion.h3 layoutId={`card-title-${activeCardIndex}`} className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase rotate-180">
                                                {calendarData[activeCardIndex].full}
                                            </motion.h3>
                                            <motion.p layoutId={`card-year-${activeCardIndex}`} className="text-xl font-medium tracking-widest opacity-80 rotate-180">
                                                {calendarData[activeCardIndex].year}
                                            </motion.p>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <motion.div
                                        className="flex-1 flex flex-col bg-white relative"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-800">Agenda de Eventos</h2>
                                                <p className="text-sm text-slate-500">Confira as atividades programadas para este mês.</p>
                                            </div>
                                            <button
                                                onClick={() => setActiveCardIndex(null)}
                                                className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors text-slate-600"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                            {loadingEvents ? (
                                                <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                                                    <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                                    <p>Carregando...</p>
                                                </div>
                                            ) : events.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                                    <CalendarIcon size={64} strokeWidth={1} />
                                                    <p className="text-lg">Nenhum evento encontrado.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {events.map((evt, i) => (
                                                        <motion.div
                                                            key={evt.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all"
                                                        >
                                                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-pink-50 rounded-lg text-pink-600 flex-shrink-0">
                                                                <span className="text-2xl font-bold leading-none">{evt.day}</span>
                                                                <span className="text-[10px] uppercase font-bold tracking-wider">Dia</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-slate-800 text-lg">{evt.title}</h4>
                                                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                                    <span className="flex items-center gap-1"><Clock size={12} /> {evt.time || 'Dia todo'}</span>
                                                                    {/* Location could go here */}
                                                                </div>
                                                                {evt.description && (
                                                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{evt.description}</p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </SmoothScrolling>
    );
}
