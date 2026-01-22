"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, Observer);

const months = [
    { name: "JAN", full: "Janeiro", color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
    { name: "FEV", full: "Fevereiro", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { name: "MAR", full: "Março", color: "bg-gradient-to-br from-orange-500 to-amber-700" },
    { name: "ABR", full: "Abril", color: "bg-gradient-to-br from-blue-400 to-teal-500" },
    { name: "MAI", full: "Maio", color: "bg-gradient-to-br from-pink-400 to-rose-500" },
    { name: "JUN", full: "Junho", color: "bg-gradient-to-br from-red-500 to-yellow-500" },
    { name: "JUL", full: "Julho", color: "bg-gradient-to-br from-blue-600 to-indigo-700" },
    { name: "AGO", full: "Agosto", color: "bg-gradient-to-br from-blue-800 to-slate-800" },
    { name: "SET", full: "Setembro", color: "bg-gradient-to-br from-green-400 to-emerald-600" },
    { name: "OUT", full: "Outubro", color: "bg-gradient-to-br from-pink-500 to-rose-600" },
    { name: "NOV", full: "Novembro", color: "bg-gradient-to-br from-blue-500 to-cyan-600" },
    { name: "DEZ", full: "Dezembro", color: "bg-gradient-to-br from-red-600 to-green-700" },
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Configuration for the Arch
    // A large radius centered well below the screen creates a gentle arch at the top
    const radius = 1500; // px

    useGSAP(() => {
        if (!wheelRef.current) return;

        // Position cards around the wheel - Upper Arch
        const sliceDeg = 15; // 15 degrees per card tight arch
        const initialOffset = -90; // Start at Top (-90 degrees)

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            // Distribute them starting from Top-Leftish to Bottom-Rightish on the circle?
            // Actually, we stack them around -90.
            // Let's assume we want JAN to be the "Active" one at start (-90).
            const angleDeg = initialOffset + (i * sliceDeg);

            // Note: 0 degrees is East. -90 is North. 
            // We want cards upright-ish tangent

            gsap.set(card, {
                rotation: angleDeg + 90, // Makes top of card point away from center
                x: Math.cos(angleDeg * Math.PI / 180) * radius,
                y: Math.sin(angleDeg * Math.PI / 180) * radius,
                transformOrigin: "50% 50%"
            });
        });

        // Rotation Logic
        let currentRotation = 0;

        // Scroll / Wheel Interaction to rotate the entire wheel
        Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            onChange: (self) => {
                // Scroll Down (deltaY > 0) -> Rotate CCW (negative) -> Move cards Left
                const delta = self.deltaY * 0.15; // Sensitivity
                currentRotation -= delta;

                // Add soft limits / rubber banding?
                // Let's keep it infinite-feeling but practically limited by list length
                // Total range: 12 cards * 15 deg = 180 deg. 
                // Start is 0. End is -180 roughly.

                gsap.to(wheelRef.current, {
                    rotation: currentRotation,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: true
                });
            }
        });

        // Intro Animation
        gsap.from(wheelRef.current, {
            rotation: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });

    }, { scope: containerRef });

    return (
        <SmoothScrolling>
            <div
                ref={containerRef}
                className="relative w-full h-[100vh] overflow-hidden flex flex-col items-center justify-end font-sans bg-[#050505] text-white"
            >
                {/* Background Ambient Glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] pointer-events-none opacity-30"
                    style={{ width: '80vw', height: '40vh', background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
                />

                {/* The Wheel Container */}
                {/* Positioned so its center is way down, creating an arch at the top */}
                <div
                    ref={wheelRef}
                    className="absolute left-1/2 z-20 will-change-transform"
                    style={{
                        width: '0px',
                        height: '0px',
                        // Center of wheel is at Top + Radius + offset?
                        // We want the TOP of the wheel (at -90deg) to be at Y ~ 10% of screen.
                        // CenterY = 10%vh + Radius
                        // Let's approximate: 100px from top.
                        top: `calc(100px + ${radius}px)`
                    }}
                >
                    {months.map((month, index) => (
                        <div
                            key={index}
                            ref={el => { cardsRef.current[index] = el }}
                            className="absolute flex items-center justify-center cursor-pointer group"
                            style={{
                                width: '220px',
                                height: '300px',
                                // Center anchor point
                                left: -110,
                                top: -150,
                            }}
                        >
                            {/* Card Content */}
                            <div className={`w-full h-full rounded-[24px] p-1 shadow-2xl transition-all duration-300 ease-out group-hover:scale-110 border border-white/5 ${month.color}`}>
                                <div className="w-full h-full bg-black/95 backdrop-blur-xl rounded-[20px] flex flex-col items-center justify-between p-6">
                                    <span className="text-5xl font-black text-white/10 self-start">{index + 1}</span>

                                    <div className="text-center mt-2">
                                        <h3 className="text-3xl font-bold text-white tracking-wide">{month.name}</h3>
                                        <p className="text-xs uppercase tracking-widest text-white/50 mt-2">{month.full}</p>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mt-4 group-hover:bg-white group-hover:text-black transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Text Title - Positioned below the arch (Center Bottom) */}
                <div className="relative z-30 text-center pb-20 select-none pointer-events-none">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white mb-2">
                        CALENDÁRIO
                    </h1>
                    <span className="text-2xl md:text-3xl font-light text-white/60 tracking-[0.5em]">
                        2026
                    </span>

                    <div className="mt-8 pointer-events-auto">
                        <Link href="/">
                            <button className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black text-sm font-bold rounded-full transition-all uppercase tracking-widest">
                                Voltar ao Início
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs uppercase tracking-widest animate-pulse">
                    Scroll to Explore
                </div>

            </div>
        </SmoothScrolling>
    );
}
