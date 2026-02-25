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
                    width: 100px;
                    height: 100px;
                    flex-shrink: 0;
                    background: var(--bg-secondary);
                    border-radius: 50%;
                    padding: 10px;
                    border: 3px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lion-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .lion-bubble {
                    background: var(--bg-card);
                    border: 2px solid var(--border);
                    border-radius: 24px;
                    padding: 16px 20px;
                    position: relative;
                    box-shadow: var(--shadow-sm);
                    max-width: 300px;
                }
                .bubble-text {
                    font-weight: 850;
                    font-size: 1rem;
                    line-height: 1.4;
                    color: var(--text);
                }
                .bubble-sub {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-top: 4px;
                }

                .bubble-tail {
                    position: absolute;
                    bottom: 12px;
                    width: 12px;
                    height: 12px;
                    background: var(--bg-card);
                    border-right: 2px solid var(--border);
                    border-bottom: 2px solid var(--border);
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
