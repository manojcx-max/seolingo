"use client";
import { useGameStore } from "@/store/gameStore";
import { useState, useEffect } from "react";

const PREMIUM_AVATARS = [
    { emoji: "🦄", cost: 200 },
    { emoji: "🐼", cost: 250 },
    { emoji: "🦅", cost: 300 },
    { emoji: "🐬", cost: 350 },
    { emoji: "🦝", cost: 400 },
    { emoji: "🎭", cost: 450 },
    { emoji: "🤖", cost: 500 },
    { emoji: "🧙", cost: 750 },
    { emoji: "👑", cost: 1000 },
];

export default function ShopPage() {
    const {
        gems, hearts, maxHearts, streakFreezeActive, xpBoostUntil,
        unlockedAvatars, purchaseHeartRefill, purchaseStreakFreeze,
        purchaseXpBoost, purchaseAvatar, setAvatar
    } = useGameStore();
    const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (msg) {
            const t = setTimeout(() => setMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [msg]);

    const handleBuy = (fn: () => boolean, successText: string) => {
        if (fn()) setMsg({ text: successText, type: 'success' });
        else setMsg({ text: "Not enough gems", type: 'error' });
    };

    const isBoosted = xpBoostUntil ? Date.now() < xpBoostUntil : false;
    const timeLeft = isBoosted ? Math.ceil((xpBoostUntil! - Date.now()) / 60000) : 0;

    return (
        <div className="anim-fadein" style={{ paddingBottom: 40 }}>
            {/* Header */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Marketplace</h1>
                <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: '1rem' }}>Enhance your learning with premium power-ups.</p>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: 'var(--purple-bg)',
                    padding: '10px 24px',
                    borderRadius: '24px',
                    marginTop: 20,
                    border: '2px solid var(--purple)'
                }}>
                    <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>💎</span>
                    <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--purple-dark)', lineHeight: 1 }}>{gems} Gems</span>
                </div>
            </div>

            {msg && (
                <div style={{
                    position: 'fixed',
                    top: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    background: msg.type === 'success' ? 'var(--green)' : 'var(--red)',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    {msg.text}
                </div>
            )}

            {/* Power-Ups */}
            <h3 className="section-title" style={{ marginBottom: 16 }}>Power-Ups</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {/* Heart Refill */}
                <div className="card-gamified" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--red-bg)', width: 72, height: 72, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❤️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Refill Hearts</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Restore your health to maximum.</div>
                    </div>
                    <button
                        className="btn-premium"
                        disabled={hearts >= maxHearts}
                        onClick={() => handleBuy(purchaseHeartRefill, "Hearts refilled successfully")}
                        style={{ minWidth: 100, background: hearts >= maxHearts ? 'var(--border)' : 'var(--green)', boxShadow: hearts >= maxHearts ? 'none' : '0 5px 0 var(--green-dark)' }}
                    >
                        {hearts >= maxHearts ? "FULL" : "50"}
                    </button>
                </div>

                {/* Streak Freeze */}
                <div className="card-gamified" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--bg-secondary)', width: 72, height: 72, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--blue)' }}>🛡️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Streak Freeze</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Equip a shield for your daily streak.</div>
                    </div>
                    <button
                        className="btn-premium"
                        disabled={streakFreezeActive}
                        onClick={() => handleBuy(purchaseStreakFreeze, "Streak protected")}
                        style={{ minWidth: 100, background: streakFreezeActive ? 'var(--border)' : 'var(--blue)', boxShadow: streakFreezeActive ? 'none' : '0 5px 0 var(--blue-dark)' }}
                    >
                        {streakFreezeActive ? "ACTIVE" : "150"}
                    </button>
                </div>

                {/* XP Booster */}
                <div className="card-gamified" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--purple-bg)', width: 72, height: 72, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>2x XP Boost (15m)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Double your experience for 15 minutes.</div>
                        {isBoosted && <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--purple)', marginTop: 4 }}>Time remaining: {timeLeft}m</div>}
                    </div>
                    <button
                        className="btn-premium"
                        onClick={() => handleBuy(purchaseXpBoost, "Double XP active")}
                        style={{ minWidth: 100, background: 'var(--purple)', boxShadow: '0 5px 0 var(--purple-dark)' }}
                    >
                        200
                    </button>
                </div>
            </div>

            {/* Special Avatars */}
            <h3 className="section-title" style={{ marginBottom: 16 }}>Exclusive Avatars</h3>
            <div className="card" style={{ padding: 24, borderRadius: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 16 }}>
                    {PREMIUM_AVATARS.map(item => {
                        const owned = unlockedAvatars.includes(item.emoji);
                        return (
                            <div
                                key={item.emoji}
                                className="anim-pop"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: 16,
                                    borderRadius: '20px',
                                    border: '2px solid var(--border)',
                                    background: owned ? 'var(--purple-bg)' : 'transparent',
                                    opacity: gems < item.cost && !owned ? 0.6 : 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                                onClick={() => {
                                    if (owned) setAvatar(item.emoji);
                                    else if (gems >= item.cost) handleBuy(() => purchaseAvatar(item.emoji, item.cost), `Unlocked successfully!`);
                                }}
                            >
                                <div style={{ fontSize: '2.5rem' }}>{item.emoji}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: owned ? 'var(--purple-dark)' : 'var(--text-muted)' }}>
                                    {owned ? "OWNED" : `${item.cost} 💎`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 900;
                    margin-bottom: 20px;
                }
                @keyframes slideDown {
                    from { transform: translate(-50%, -40px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
