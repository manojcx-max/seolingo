"use client";
import React, { useState, useEffect } from "react";
import { playSound } from "@/utils/audio";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Automatically fade out after 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade animation
        }, 2200);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const handleRoar = () => {
        if (!hasInteracted) {
            playSound("roar");
            setHasInteracted(true);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className="splash-overlay"
            onClick={handleRoar}
            onPointerDown={handleRoar}
        >
            <div className="splash-content">
                <div className="splash-logo-wrap">
                    <img src="/lion-mascot.png" alt="RoarRank" className="splash-logo" />
                    <div className="splash-glow"></div>
                </div>
                <h1 className="splash-title">RoarRank</h1>
                <p className="splash-subtitle">TAP TO ROAR</p>
            </div>

            <style jsx>{`
                .splash-overlay {
                    position: fixed;
                    inset: 0;
                    background: var(--bg);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.8s ease-out;
                }
                .splash-content {
                    text-align: center;
                    animation: popUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .splash-logo-wrap {
                    position: relative;
                    width: 140px;
                    height: 140px;
                    margin: 0 auto 24px;
                }
                .splash-logo {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    position: relative;
                    z-index: 2;
                }
                .splash-glow {
                    position: absolute;
                    inset: -20px;
                    background: var(--primary);
                    filter: blur(40px);
                    opacity: 0.3;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                .splash-title {
                    font-size: 3rem;
                    font-weight: 950;
                    background: var(--lion-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -1px;
                    margin: 0;
                }
                .splash-subtitle {
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: var(--text-muted);
                    letter-spacing: 2px;
                    margin-top: 12px;
                    opacity: 0.6;
                }

                @keyframes popUp {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
