"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const months = [
    { name: "Janeiro", color: "from-yellow-400 to-orange-500", rotate: "-12deg", x: "-35vw", y: "-20vh", scale: 0.9 },
    { name: "Fevereiro", color: "from-purple-500 to-pink-500", rotate: "15deg", x: "-25vw", y: "30vh", scale: 1.1 },
    { name: "Março", color: "from-orange-500 to-amber-700", rotate: "-5deg", x: "-40vw", y: "15vh", scale: 0.95 },
    { name: "Abril", color: "from-blue-400 to-teal-500", rotate: "8deg", x: "35vw", y: "-25vh", scale: 1.05 },
    { name: "Maio", color: "from-pink-400 to-rose-500", rotate: "-20deg", x: "25vw", y: "25vh", scale: 0.9 },
    { name: "Junho", color: "from-red-500 to-yellow-500", rotate: "12deg", x: "40vw", y: "5vh", scale: 1.0 },
    { name: "Julho", color: "from-blue-600 to-indigo-700", rotate: "-8deg", x: "-15vw", y: "-35vh", scale: 0.85 },
    { name: "Agosto", color: "from-blue-800 to-slate-800", rotate: "18deg", x: "15vw", y: "-30vh", scale: 0.9 },
    { name: "Setembro", color: "from-green-400 to-emerald-600", rotate: "-15deg", x: "-20vw", y: "35vh", scale: 0.95 },
    { name: "Outubro", color: "from-pink-500 to-rose-600", rotate: "10deg", x: "20vw", y: "38vh", scale: 1.0 },
    { name: "Novembro", color: "from-blue-500 to-cyan-600", rotate: "-25deg", x: "5vw", y: "-40vh", scale: 0.8 },
    { name: "Dezembro", color: "from-red-600 to-green-700", rotate: "22deg", x: "-5vw", y: "42vh", scale: 0.85 },
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Mouse movement parallax effect
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX - innerWidth / 2) / innerWidth;
            const y = (clientY - innerHeight / 2) / innerHeight;

            gsap.to(textRef.current, {
                x: x * 20,
                y: y * 20,
                duration: 1,
                ease: "power2.out"
            });

            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const speed = 1 + (i % 3) * 0.5; // Variation in speed
                gsap.to(card, {
                    x: x * 50 * speed,
                    y: y * 50 * speed,
                    rotation: x * 10 * (i % 2 === 0 ? 1 : -1),
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Initial Float Animation
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.to(card, {
                y: "+=20",
                rotation: "+=2",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random()
            });
        });

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { scope: containerRef });

    return (
        <SmoothScrolling>
            <div ref={containerRef} className="h-screen w-full bg-[#050505] overflow-hidden relative flex items-center justify-center font-sans selection:bg-primary/30">

                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Central Text Content */}
                <div ref={textRef} className="relative z-20 text-center space-y-6 px-4">
                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-white leading-[0.9]">
                        CALENDÁRIO
                        <br />
                        <span className="text-white/30">2026</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto">
                        Planejamento, eventos e campanhas para o ano todo.
                    </p>
                    <div className="pt-8 flex gap-4 justify-center">
                        <Link href="/" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform">
                            <span className="group-hover:translate-x-1 transition-transform">Voltar ao Início</span>
                        </Link>
                        <button className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                            Baixar PDF <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Floating Cards */}
                {months.map((month, index) => (
                    <div
                        key={index}
                        ref={el => { cardsRef.current[index] = el }}
                        className="absolute z-10 top-1/2 left-1/2 flex flex-col items-center justify-center pointer-events-none md:pointer-events-auto"
                        style={{
                            width: "180px", // JoyJam size approx
                            height: "220px",
                            // Initial positioning using CSS translate relative to center
                            transform: `translate(-50%, -50%) translate(${month.x}, ${month.y}) rotate(${month.rotate}) scale(${month.scale})`,
                        }}
                    >
                        {/* Card Visual */}
                        <div className={`w-full h-full rounded-[2rem] bg-gradient-to-br ${month.color} p-1 shadow-2xl relative group cursor-pointer overflow-hidden transition-all duration-500 hover:z-50 hover:scale-110 hover:rotate-0`}>
                            {/* Inner Content */}
                            <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-[1.8rem] flex flex-col items-center justify-between p-6">
                                <span className="text-white/90 font-bold text-xl tracking-wide uppercase">{month.name}</span>

                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80">
                                    <span className="text-xs font-bold">{index + 1}</span>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">Ver Detalhes</span>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </SmoothScrolling>
    );
}
