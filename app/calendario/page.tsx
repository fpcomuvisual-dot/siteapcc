"use client";

import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SmoothScrolling from "@/components/smooth-scrolling";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Use distinct colors for each month card to ensure visibility against the dark background
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
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Calculate positions specifically for this render
    // We use a large Radius relative to viewport (e.g., 35vw)
    const cardPositions = useMemo(() => {
        const radius = 35; // 35vw
        const total = 12;

        return months.map((month, i) => {
            // Angle in degrees: 360 / 12 = 30 deg each.
            // Start at -60deg (1 o'clock-ish) or 0deg (3 o'clock)?
            // CSS Angle 0 is usually East (3 o'clock). 
            // -90 is North (12 o'clock).
            // Let's spread them starting from -60deg for January (1 o'clock)
            const angleDeg = -60 + (i * 30);
            const angleRad = (angleDeg * Math.PI) / 180;

            // X = R * cos(theta), Y = R * sin(theta)
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            // Rotation: cards should likely be upright or rotated? 
            // JoyJam is "around the circle" but usually text is readable. 
            // Let's rotate them to match the angle for that 'ring' feel (angleDeg + 90 makes top point out).
            const rotation = angleDeg + 90;

            return { ...month, x, y, rotation, angleRad };
        });
    }, []);

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
                const config = cardPositions[i];

                // We must MAINTAIN the base position while animating parallax!
                // Initial translate is: translate(config.x vw, config.y vw)
                // We add the parallax offset to that

                // Note: We use 'vw' for both X and Y to ensure it's a perfect circle on all screens
                // provided the container is wide enough.
                gsap.to(card, {
                    x: `calc(${config.x}vw + ${x * 40}px)`,
                    y: `calc(${config.y}vw + ${y * 40}px)`,
                    rotation: config.rotation + (x * 10),
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
                scale: 1.05,
                duration: 1.5 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random()
            })
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] pointer-events-none opacity-20"
                    style={{ width: '60vw', height: '60vw', background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
                />

                {/* Central Hero Text */}
                <div ref={textRef} className="relative z-30 text-center px-4 space-y-4 md:space-y-8 select-none">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none" style={{ color: 'white' }}>
                        CALENDÁRIO
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 font-light">
                            2026
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl font-light tracking-widest uppercase text-white/70 max-w-2xl mx-auto">
                        Explore nossos eventos
                    </p>

                    <div className="flex gap-4 justify-center pt-4 pointer-events-auto">
                        <Link href="/">
                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                                INÍCIO
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Floating Month Cards - Trigonometric Circle */}
                {cardPositions.map((item, index) => (
                    <div
                        key={index}
                        ref={el => { cardsRef.current[index] = el }}
                        className="absolute z-20 flex items-center justify-center cursor-pointer group"
                        style={{
                            // Start absolute center
                            top: '50%',
                            left: '50%',
                            width: '180px',
                            height: '240px',
                            // Initial Position via translate: Move from center by X/Y vw
                            // We use `vw` for both to maintain circular shape regardless of aspect ratio
                            transform: `translate(-50%, -50%) translate(${item.x}vw, ${item.y}vw) rotate(${item.rotation}deg)`
                        }}
                    >
                        {/* Card Container with Transition */}
                        <div className={`w-full h-full rounded-[24px] p-1 shadow-2xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:z-50 group-hover:rotate-0 ${item.color}`}>
                            {/* Inner Card Content */}
                            <div className="w-full h-full bg-black/90 backdrop-blur-md rounded-[20px] flex flex-col items-center justify-between p-5 border border-white/10">
                                <span className="text-4xl font-black text-white/20">{index + 1}</span>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white tracking-wide">{item.name}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{item.full}</p>
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
