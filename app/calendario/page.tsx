"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Plugin registration moved to useGSAP hook

// Define gradient backgrounds explicitly for inline usage if Tailwind fails
const months = [
    { name: "JAN", full: "Janeiro", bg: "linear-gradient(135deg, #facc15 0%, #f97316 100%)" },
    { name: "FEV", full: "Fevereiro", bg: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { name: "MAR", full: "Março", bg: "linear-gradient(135deg, #f97316 0%, #b45309 100%)" },
    { name: "ABR", full: "Abril", bg: "linear-gradient(135deg, #60a5fa 0%, #14b8a6 100%)" },
    { name: "MAI", full: "Maio", bg: "linear-gradient(135deg, #f472b6 0%, #f43f5e 100%)" },
    { name: "JUN", full: "Junho", bg: "linear-gradient(135deg, #ef4444 0%, #eab308 100%)" },
    { name: "JUL", full: "Julho", bg: "linear-gradient(135deg, #2563eb 0%, #4338ca 100%)" },
    { name: "AGO", full: "Agosto", bg: "linear-gradient(135deg, #1e40af 0%, #1e293b 100%)" },
    { name: "SET", full: "Setembro", bg: "linear-gradient(135deg, #4ade80 0%, #059669 100%)" },
    { name: "OUT", full: "Outubro", bg: "linear-gradient(135deg, #ec4899 0%, #e11d48 100%)" },
    { name: "NOV", full: "Novembro", bg: "linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)" },
    { name: "DEZ", full: "Dezembro", bg: "linear-gradient(135deg, #dc2626 0%, #15803d 100%)" },
];

export default function CalendarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Arch Radius configuration
    const radius = 1500;

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger, Observer);
        if (!wheelRef.current) return;

        // Position cards around the wheel - Arch Layout
        const sliceDeg = 15;
        const initialOffset = -90; // Top Center

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

        Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            onChange: (self) => {
                const delta = self.deltaY * 0.15;
                currentRotation -= delta;

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
            {/* INLINE STYLES: Absolute Fallback for Critical Visuals */}
            <div
                ref={containerRef}
                className="relative w-full h-[100vh] overflow-hidden flex flex-col items-center justify-end font-sans"
                style={{
                    backgroundColor: '#050505',
                    color: 'white',
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Background Ambient Glow - Inline Blur */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{
                        width: '80vw',
                        height: '40vh',
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        opacity: 0.3,
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(120px)', // Standard CSS blur
                        zIndex: 10
                    }}
                />

                {/* The Wheel Container */}
                <div
                    ref={wheelRef}
                    className="absolute left-1/2 z-20 will-change-transform"
                    style={{
                        width: '0px',
                        height: '0px',
                        // ADJUSTED TOP POSITION:
                        // CenterY = TopOffset + Radius.
                        // Previous: 100px + Radius. Result: Card centers at 100px. Top at -50px. (Clipped)
                        // New: 300px + Radius. Result: Card centers at 300px. Top at 150px. (Visible)
                        top: `calc(320px + ${radius}px)`,
                        position: 'absolute',
                        left: '50%',
                        zIndex: 20
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
                                left: -110,
                                top: -150,
                                position: 'absolute'
                            }}
                        >
                            {/* Card Content - Inline Gradients */}
                            <div
                                className="w-full h-full rounded-[24px] p-1 shadow-2xl transition-all duration-300 ease-out group-hover:scale-110"
                                style={{
                                    background: month.bg,
                                    borderRadius: '24px',
                                    padding: '4px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                <div
                                    className="w-full h-full rounded-[20px] flex flex-col items-center justify-between p-6"
                                    style={{
                                        backgroundColor: 'rgba(5, 5, 5, 0.95)',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backdropFilter: 'blur(12px)'
                                    }}
                                >
                                    <span style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start' }}>
                                        {index + 1}
                                    </span>

                                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
                                            {month.name}
                                        </h3>
                                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                                            {month.full}
                                        </p>
                                    </div>

                                    <div
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '9999px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '1rem',
                                            color: 'white'
                                        }}
                                    >
                                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Text Title - Centered Bottom - INCREASED SIZE */}
                <div
                    className="relative z-30 text-center pb-20 select-none pointer-events-none"
                    style={{
                        position: 'relative',
                        zIndex: 30,
                        textAlign: 'center',
                        paddingBottom: '5rem',
                        pointerEvents: 'none'
                    }}
                >
                    <h1
                        className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-white mb-2"
                        style={{
                            fontSize: '5rem', // INCREASED from 3rem
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            color: 'white',
                            lineHeight: 1,
                            marginBottom: '0.5rem'
                        }}
                    >
                        CALENDÁRIO
                    </h1>
                    <span
                        className="text-2xl md:text-3xl font-light text-white/60 tracking-[0.5em]"
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 300,
                            letterSpacing: '0.5em',
                            color: 'rgba(255,255,255,0.6)'
                        }}
                    >
                        2026
                    </span>

                    <div style={{ marginTop: '2rem', pointerEvents: 'auto' }}>
                        <Link href="/">
                            <button
                                style={{
                                    padding: '0.8rem 2rem', // Slightly bigger button
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    borderRadius: '9999px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer'
                                }}
                            >
                                Voltar ao Início
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs uppercase tracking-widest animate-pulse"
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255,255,255,0.2)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}
                >
                    Scroll to Explore
                </div>

            </div>
        </SmoothScrolling>
    );
}
