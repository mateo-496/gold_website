"use client"
import { useState } from "react";

export function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/gold_marble2.png')"}}
            />
            <div className="absolute inset-0 bg-black/35" />

            {/* Hamburger menu - transparent, top left */}
            <button 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="absolute top-8 left-8 z-20 flex flex-col gap-1.5 w-8"
            >
                <span className="h-[1.5px] w-full bg-white transition-transform" />
                <span className="h-[1.5px] w-full bg-white transition-opacity" />
                <span className="h-[1.5px] w-full bg-white transition-transform" />
            </button>

            {/* Company name, centered */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <h1 className="font-serif text-white text-[clamp(2.5rem,8vw,7rem)] tracking-wide">
                    OrCompare
                </h1>
            </div>

            {/* Scroll hint */}
            {/* <div className="absolute bottom-10 left-1/2 -trsnalte-x-1/2 z-10 animate-scrollHint">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                    <path d="M2 2L12 12L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div> */}
            <a href="#next" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-scrollHint">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                    <path d="M2 2L12 12L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
        </section>
    )
}