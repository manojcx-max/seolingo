"use client";
import React from "react";

interface LionGuideProps {
    message: string;
    subMessage?: string;
    position?: "left" | "right";
}

export function LionGuide({ message, subMessage, position = "left" }: LionGuideProps) {
    return (
        <div className={`lion-guide-container ${position}`}>
            <div className="lion-bubble">
                <div className="bubble-text">{message}</div>
                {subMessage && <div className="bubble-sub">{subMessage}</div>}
                <div className="bubble-tail" />
            </div>
            <div className="lion-character">
                <img src="/lion-mascot.png" alt="Lion Guide" className="lion-img" />
            </div>

            <style jsx>{`
                .lion-guide-container {
                    display: flex;
                    align-items: flex-end;
                    gap: 16px;
                    margin: 24px 0;
                    animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .lion-guide-container.right {
                    flex-direction: row-reverse;
                }

                .lion-character {
                    width: 140px;
                    height: 140px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    background: white;
                    border-radius: 32px;
                    border: 4px solid var(--border);
                    border-bottom-width: 8px;
                    box-shadow: var(--shadow-md);
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    animation: sn-float 4s ease-in-out infinite;
                }
                .lion-character:hover {
                    transform: translateY(-5px) scale(1.05);
                    border-color: var(--primary);
                }
                .lion-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scale(1.15);
                }


                .lion-bubble {
                    background: var(--bg-card);
                    border: 4px solid var(--border);
                    border-bottom-width: 8px;
                    border-radius: 28px;
                    padding: 20px 24px;
                    position: relative;
                    box-shadow: var(--shadow-sm);
                    max-width: 320px;
                }
                .bubble-text {
                    font-weight: 900;
                    font-size: 1.1rem;
                    line-height: 1.4;
                    color: var(--text);
                    letter-spacing: -0.2px;
                }
                .bubble-sub {
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: var(--text-secondary);
                    margin-top: 6px;
                }

                .bubble-tail {
                    position: absolute;
                    bottom: 20px;
                    width: 16px;
                    height: 16px;
                    background: var(--bg-card);
                    border-right: 4px solid var(--border);
                    border-bottom: 4px solid var(--border);
                }

                .left .bubble-tail {
                    right: -7px;
                    transform: rotate(-45deg);
                }
                .right .bubble-tail {
                    left: -7px;
                    transform: rotate(135deg);
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 600px) {
                    .lion-character { width: 80px; height: 80px; }
                    .lion-bubble { max-width: 220px; font-size: 0.9rem; }
                }
            `}</style>
        </div>
    );
}
