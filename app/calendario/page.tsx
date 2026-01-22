"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Use distinct colors for each month card to ensure visibility against the dark background
// Layout: Circular/Elliptical distribution
const months = [
    { name: "JAN", full: "Janeiro", color: "bg-gradient-to-br from-yellow-400 to-orange-500", x: 15, y: -38, rotate: 15, scale: 0.9 }, // 1 o'clock
    { name: "FEV", full: "Fevereiro", color: "bg-gradient-to-br from-purple-500 to-pink-500", x: 32, y: -25, rotate: 25, scale: 1.1 }, // 2 o'clock
    { name: "MAR", full: "Março", color: "bg-gradient-to-br from-orange-500 to-amber-700", x: 40, y: 0, rotate: 5, scale: 0.95 },   // 3 o'clock
    { name: "ABR", full: "Abril", color: "bg-gradient-to-br from-blue-400 to-teal-500", x: 32, y: 25, rotate: -15, scale: 1.05 }, // 4 o'clock
    { name: "MAI", full: "Maio", color: "bg-gradient-to-br from-pink-400 to-rose-500", x: 15, y: 38, rotate: -25, scale: 0.9 },   // 5 o'clock
    { name: "JUN", full: "Junho", color: "bg-gradient-to-br from-red-500 to-yellow-500", x: 0, y: 42, rotate: 0, scale: 1.0 },    // 6 o'clock
    { name: "JUL", full: "Julho", color: "bg-gradient-to-br from-blue-600 to-indigo-700", x: -15, y: 38, rotate: 25, scale: 0.85 }, // 7 o'clock
    { name: "AGO", full: "Agosto", color: "bg-gradient-to-br from-blue-800 to-slate-800", x: -32, y: 25, rotate: 15, scale: 0.9 }, // 8 o'clock
    { name: "SET", full: "Setembro", color: "bg-gradient-to-br from-green-400 to-emerald-600", x: -40, y: 0, rotate: -5, scale: 0.95 },  // 9 o'clock
    { name: "OUT", full: "Outubro", color: "bg-gradient-to-br from-pink-500 to-rose-600", x: -32, y: -25, rotate: -15, scale: 1.0 }, // 10 o'clock
    { name: "NOV", full: "Novembro", color: "bg-gradient-to-br from-blue-500 to-cyan-600", x: -15, y: -38, rotate: -25, scale: 0.8 }, // 11 o'clock
    { name: "DEZ", full: "Dezembro", color: "bg-gradient-to-br from-red-600 to-green-700", x: 0, y: -42, rotate: 0, scale: 0.85 },   // 12 o'clock
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Mouse Parallax Logic
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize coordinates -1 to 1
            const x = (clientX / innerWidth) * 2 - 1;
            const y = (clientY / innerHeight) * 2 - 1;

            if (textRef.current) {
                gsap.to(textRef.current, {
                    x: x * 20,
                    y: y * 20,
                    duration: 1,
                    ease: "power2.out"
                });
            }

            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const factor = 1 + (i % 3) * 0.5; // Depth factor

                // Animate parallax, adding to base rotation
                gsap.to(card, {
                    x: x * 30 * factor,
                    y: y * 30 * factor,
                    rotation: (months[i].rotate) + (x * 10 * (i % 2 === 0 ? 1 : -1)),
                    duration: 1.2,
                    ease: "power2.out"
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Initial Floating Animation (Breathing)
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.to(card, {
                y: `+=15`,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 2
            });
        });

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { scope: containerRef });

    return (
        <SmoothScrolling>
            {/* Forced Black Background to ensure JoyJam aesthetic */}
            <div
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans"
                style={{ backgroundColor: '#050505', color: '#ffffff' }}
            >
                {/* Background Ambient Glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] pointer-events-none opacity-20"
                    style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} // APCC Pink glow
                />

                {/* Central Hero Text */}
                <div ref={textRef} className="relative z-30 text-center px-4 space-y-8 select-none">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none" style={{ color: 'white' }}>
                        CALENDÁRIO
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 font-light">
                            2026
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-widest uppercase text-white/70 max-w-2xl mx-auto">
                        Explore nossos eventos e campanhas
                    </p>

                    <div className="flex gap-4 justify-center pt-4 pointer-events-auto">
                        <Link href="/">
                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                                INÍCIO
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Floating Month Cards */}
                {months.map((month, index) => (
                    <div
                        key={index}
                        ref={el => { cardsRef.current[index] = el }}
                        className="absolute z-20 flex items-center justify-center cursor-pointer group"
                        style={{
                            // Explicit Top/Left Positioning using calc() to ensure a ring layout
                            left: `calc(50% + ${month.x}vw)`,
                            top: `calc(50% + ${month.y}vh)`,
                            width: '180px',
                            height: '240px',
                            // Center element on coordinate + Initial Rotation
                            // Note: GSAP will modify transform, so we use it for animation, but base position is robust via left/top.
                            transform: `translate(-50%, -50%) rotate(${month.rotate}deg) scale(${month.scale})`
                        }}
                    >
                        {/* Card Container with Transition */}
                        <div className={`w-full h-full rounded-[24px] p-1 shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:z-50 group-hover:rotate-0 ${month.color}`}>
                            {/* Inner Card Content */}
                            <div className="w-full h-full bg-black/90 backdrop-blur-md rounded-[20px] flex flex-col items-center justify-between p-5 border border-white/10">
                                <span className="text-4xl font-black text-white/20">{index + 1}</span>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white tracking-wide">{month.name}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{month.full}</p>
                                </div>

                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SmoothScrolling>
    );
}
