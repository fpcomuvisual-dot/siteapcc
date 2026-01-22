"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScrolling from "@/components/smooth-scrolling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const months = [
    { name: "Janeiro", theme: "Verão", color: "from-yellow-400 to-orange-500", desc: "Início de novos ciclos e planejamento." },
    { name: "Fevereiro", theme: "Carnaval", color: "from-purple-500 to-pink-500", desc: "Alegria, cores e movimento." },
    { name: "Março", theme: "Outono", color: "from-orange-500 to-amber-700", desc: "Renovação das folhas e do clima." },
    { name: "Abril", theme: "Páscoa", color: "from-blue-400 to-teal-500", desc: "Tempo de reflexão e renascimento." },
    { name: "Maio", theme: "Mês das Mães", color: "from-pink-400 to-rose-500", desc: "Amor, carinho e gratidão." },
    { name: "Junho", theme: "Festas Juninas", color: "from-red-500 to-yellow-500", desc: "Tradição, fogueira e calor humano." },
    { name: "Julho", theme: "Inverno", color: "from-blue-600 to-indigo-700", desc: "Aconchego e solidariedade." },
    { name: "Agosto", theme: "Mês dos Pais", color: "from-blue-800 to-slate-800", desc: "Força, exemplo e proteção." },
    { name: "Setembro", theme: "Primavera", color: "from-green-400 to-emerald-600", desc: "Florescer da vida e da esperança." },
    { name: "Outubro", theme: "Outubro Rosa", color: "from-pink-500 to-rose-600", desc: "Prevenção e conscientização." },
    { name: "Novembro", theme: "Novembro Azul", color: "from-blue-500 to-cyan-600", desc: "Cuidado com a saúde masculina." },
    { name: "Dezembro", theme: "Natal", color: "from-red-600 to-green-700", desc: "Celebração, união e luz." },
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        const cards = cardsRef.current.filter(Boolean);

        // Pin the container and horizontally scroll or stack cards
        // Strategy: Horizontal Scroll Section
        const totalWidth = cards.length * 100; // Fake width calculation

        // Clear previous triggers
        ScrollTrigger.getAll().forEach(t => t.kill());

        gsap.to(cards, {
            xPercent: -100 * (cards.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                // snap: 1 / (cards.length - 1), // Optional snapping
                end: () => "+=" + containerRef.current!.offsetWidth * cards.length,
            }
        });

    }, { scope: containerRef });

    return (
        <SmoothScrolling>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="h-[50vh] flex flex-col items-center justify-center bg-background relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground z-10 text-center">
                        CALENDÁRIO
                        <span className="block text-primary text-4xl md:text-5xl mt-2 tracking-widest font-light">2026</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground max-w-lg text-center z-10 px-4">
                        Uma jornada visual através dos meses. Role para explorar nossos eventos e campanhas.
                    </p>
                    <div className="absolute bottom-10 animate-bounce text-muted-foreground">
                        ↓ Role para começar
                    </div>
                </section>

                {/* Horizontal Scroll Component */}
                <section ref={containerRef} className="h-screen w-full overflow-hidden flex items-center bg-slate-950 text-white relative">
                    <div className="flex w-[400%] h-full"> {/* Wide container */}
                        {months.map((month, index) => (
                            <div
                                key={index}
                                ref={el => { cardsRef.current[index] = el }}
                                className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8 md:p-20 relative"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${month.color} opacity-20`} />

                                {/* Card Content */}
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 md:p-20 rounded-3xl max-w-4xl w-full shadow-2xl relative z-10 transform transition-transform hover:scale-105 duration-500">
                                    <div className="absolute -top-10 -left-10 text-[10rem] md:text-[15rem] font-bold text-white/5 select-none pointer-events-none">
                                        {index + 1}
                                    </div>

                                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                                        {month.name}
                                    </h2>
                                    <div className="w-20 h-2 bg-gradient-to-r from-white to-transparent mb-8" />

                                    <div className="space-y-4">
                                        <div className="inline-block px-4 py-2 rounded-full bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/10">
                                            {month.theme}
                                        </div>
                                        <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
                                            {month.desc}
                                        </p>
                                    </div>

                                    <div className="mt-12 flex gap-4">
                                        <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors">
                                            Ver Eventos
                                        </button>
                                        <button className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                                            Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer / Contact Section */}
                <section className="h-[50vh] bg-background flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">Participe Conosco</h2>
                        <p className="text-muted-foreground">Junte-se a nós em nossas campanhas mensais.</p>
                    </div>
                </section>
            </div>
        </SmoothScrolling>
    );
}
