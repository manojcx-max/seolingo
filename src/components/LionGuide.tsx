"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LionGuideProps {
    message: string;
    subMessage?: string;
    position?: "left" | "right";
}

export function LionGuide({ message, subMessage, position = "left" }: LionGuideProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`lion-guide-container ${position}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: position === 'left' ? -100 : 100 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                            setIsVisible(false);
                        }
                    }}
                    whileTap={{ cursor: "grabbing" }}
                >
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
                            cursor: grab;
                            touch-action: none;
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
                            user-select: none;
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

                        @media (max-width: 600px) {
                            .lion-character { width: 80px; height: 80px; border-width: 3px; border-bottom-width: 5px; }
                            .lion-bubble { max-width: 220px; padding: 14px 18px; }
                            .bubble-text { font-size: 0.95rem; }
                            .bubble-sub { font-size: 0.75rem; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
