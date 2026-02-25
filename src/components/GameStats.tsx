"use client";

import { useGameStore, getLevel } from "@/store/gameStore";

export function HeartsDisplay() {
    const { hearts, maxHearts } = useGameStore();

    return (
        <div className="hearts-display">
            {Array.from({ length: maxHearts }).map((_, i) => (
                <span key={i} className={`heart ${i >= hearts ? "empty" : ""}`}>
                    ❤️
                </span>
            ))}
        </div>
    );
}

export function XPBar({ compact = false }: { compact?: boolean }) {
    const { xp } = useGameStore();
    const { level, title, nextXP, progress } = getLevel(xp);

    if (compact) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 900, fontSize: "0.85rem", color: "var(--orange)" }}>
                    ⚡ {xp} XP
                </span>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>
                    Level {level} · {title}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    {xp} / {nextXP} XP
                </span>
            </div>
            <div className="xp-bar-container">
                <div className="xp-bar-track" style={{ flex: 1 }}>
                    <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
}

export function StatsBar() {
    const { xp, hearts, maxHearts, streak } = useGameStore();

    return (
        <div className="stats-bar">
            <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{streak}</span>
            </div>
            <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-value">{xp}</span>
            </div>
            <div className="hearts-display" style={{ gap: 3 }}>
                {Array.from({ length: maxHearts }).map((_, i) => (
                    <span key={i} style={{ fontSize: "1rem", opacity: i >= hearts ? 0.25 : 1 }}>
                        ❤️
                    </span>
                ))}
            </div>
        </div>
    );
}
