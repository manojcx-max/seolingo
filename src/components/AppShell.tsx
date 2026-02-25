"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useGameStore, getLevel } from "@/store/gameStore";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggleTheme: () => { } });
export const useTheme = () => useContext(ThemeContext);

const NAV = [
    { href: "/", icon: <IconHome />, label: "Home" },
    { href: "/learn", icon: <IconLearn />, label: "Learn" },
    { href: "/leaderboard", icon: <IconLeaderboard />, label: "Leaders" },
    { href: "/shop", icon: <IconShop />, label: "Shop" },
    { href: "/profile", icon: <IconProfile />, label: "Profile" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [theme, setTheme] = useState<Theme>("light");
    const [activePopup, setActivePopup] = useState<'streak' | 'gems' | 'hearts' | null>(null);
    const { xp, hearts, streak, username, avatar, profileImage, xpBoostUntil, gems, syncStatus, syncData } = useGameStore();
    const { level } = getLevel(xp);

    const isBoosted = xpBoostUntil ? Date.now() < xpBoostUntil : false;
    const isClean = pathname.startsWith("/onboarding") || pathname.startsWith("/lesson");

    useEffect(() => {
        const saved = localStorage.getItem("seolingo-theme") as Theme | null;
        if (saved) setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem("seolingo-theme", next);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (!username) return;
        const { checkHearts } = useGameStore.getState();
        checkHearts();
        const interval = setInterval(checkHearts, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [username]);

    // SYNC MONITORING
    useEffect(() => {
        if (syncStatus === 'pending') {
            const timer = setTimeout(() => syncData(), 5000); // Auto-sync after 5s of idle
            return () => clearTimeout(timer);
        }
    }, [syncStatus, syncData]);

    useEffect(() => {
        const handleOnline = () => syncData();
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [syncData]);

    if (isClean) {
        return (
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* Mobile Header */}
            <header className="mobile-header">
                <Link href="/" style={{ textDecoration: "none", color: 'inherit' }}>
                    <span className="mobile-logo">SEOlingo</span>
                </Link>
                <div className="mobile-stats">
                    <button className="stat-pill-btn streak" onClick={() => setActivePopup('streak')}>
                        <span className="stat-emoji">🔥</span>
                        <span>{streak}</span>
                    </button>
                    <button className="stat-pill-btn gems" onClick={() => setActivePopup('gems')}>
                        <span className="stat-emoji">💎</span>
                        <span>{gems}</span>
                    </button>
                    <button className="stat-pill-btn hearts" onClick={() => setActivePopup('hearts')}>
                        <span className="stat-emoji">❤️</span>
                        <span>{hearts}</span>
                    </button>
                    <SyncIndicator status={syncStatus} onSync={syncData} />
                </div>
            </header>

            {activePopup && <StatPopup type={activePopup} onClose={() => setActivePopup(null)} />}

            {/* Desktop + Mobile layout */}
            <div className="app-layout">
                {/* Desktop Sidebar */}
                <nav className="sidebar">
                    <Link href="/" className="sidebar-logo">
                        <span className="logo-text">SEOlingo</span>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', padding: '0 8px' }}>
                        {NAV.map(n => (
                            <Link key={n.href} href={n.href} className={`sidebar-nav-item${pathname === n.href ? " active" : ""}`}>
                                <span className="sidebar-nav-icon">{n.icon}</span>
                                <span style={{ fontWeight: 800 }}>{n.label}</span>
                            </Link>
                        ))}
                    </div>
                    <div style={{ flex: 1 }} />
                    {username && (
                        <div className="card" style={{ padding: 16, margin: '8px 12px', background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <div style={{ fontSize: "2rem", background: 'var(--bg-card)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {profileImage ? <img src={profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>{username}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>Lv. {level} · {xp} XP</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 900 }}>
                                <span style={{ color: "var(--orange)" }}>🔥 {streak}</span>
                                <span style={{ color: "var(--red)" }}>❤️ {hearts}/5</span>
                                <span style={{ color: "var(--purple)" }}>💎 {gems}</span>
                            </div>
                            {isBoosted && <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--purple)', marginTop: 8, textAlign: 'center', background: 'var(--purple-bg)', padding: '2px 0', borderRadius: 4 }}>⚡ DOUBLE XP ACTIVE</div>}
                        </div>
                    )}
                    <div style={{ padding: '0 12px 12px' }}>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={toggleTheme}
                            style={{ width: "100%", fontWeight: 800 }}
                        >
                            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                        </button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="main-content anim-fadein" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav">
                <div className="mobile-bottom-nav-inner">
                    {NAV.map(n => (
                        <Link key={n.href} href={n.href} className={`mobile-nav-item${pathname === n.href ? " active" : ""}`}>
                            <span className="nav-icon">{n.icon}</span>
                            <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>{n.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </ThemeContext.Provider>
    );
}

function StatPopup({ type, onClose }: { type: 'streak' | 'gems' | 'hearts', onClose: () => void }) {
    const { streak, gems, hearts, nextHeartAt } = useGameStore();
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (type === 'hearts' && nextHeartAt) {
            const timer = setInterval(() => {
                const diff = nextHeartAt - Date.now();
                if (diff <= 0) {
                    setTimeLeft("Full!");
                    return;
                }
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [type, nextHeartAt]);

    const content = {
        streak: {
            icon: "🔥",
            color: "var(--orange)",
            title: `${streak} Day Streak`,
            desc: "Keep learning every day to grow your streak. Miss a day, and it resets to zero!",
            footer: "PROTECT YOUR STREAK IN THE SHOP"
        },
        gems: {
            icon: "💎",
            color: "var(--purple)",
            title: `${gems} Gems`,
            desc: "Gems are used to buy power-ups, avatars, and streak freezes in the shop.",
            footer: "EARN MORE BY COMPLETING LESSONS"
        },
        hearts: {
            icon: "❤️",
            color: "var(--red)",
            title: `${hearts}/5 Hearts`,
            desc: hearts === 5 ? "Your hearts are full! Go start a lesson." : `Wait for your hearts to refill or get unlimited in the shop. Next heart in: ${timeLeft}`,
            footer: "HEARTS REFILL AUTOMATICALLY EVERY 15 MINS"
        }
    }[type];

    return (
        <div className="popup-overlay anim-fadein" onClick={onClose}>
            <div className="stat-popup-card anim-pop" style={{ borderColor: content.color }} onClick={e => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>✕</button>
                <div className="popup-visual" style={{ color: content.color }}>{content.icon}</div>
                <h2 className="popup-title">{content.title}</h2>
                <p className="popup-desc">{content.desc}</p>
                <div className="popup-footer" style={{ background: `${content.color}15`, color: content.color }}>
                    {content.footer}
                </div>
            </div>
            <style jsx>{`
                .popup-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.3);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .stat-popup-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 32px;
                    padding: 40px 32px;
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    position: relative;
                    box-shadow: var(--shadow-lg);
                }
                .popup-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-secondary);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    font-size: 1rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .popup-close-btn:hover { background: var(--border); color: var(--text); }
                .popup-visual { font-size: 4.5rem; margin-bottom: 20px; line-height: 1; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
                .popup-title { font-size: 1.8rem; font-weight: 950; margin-bottom: 12px; letter-spacing: -0.5px; }
                .popup-desc { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; font-weight: 600; margin-bottom: 32px; padding: 0 10px; }
                .popup-footer { padding: 14px; border-radius: 18px; font-weight: 950; font-size: 0.72rem; letter-spacing: 1px; text-transform: uppercase; }

                :global(.stat-pill-btn) {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-radius: 99px;
                    font-weight: 850;
                    font-family: inherit;
                    color: var(--text);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: var(--shadow-sm);
                }
                :global(.stat-pill-btn.streak) { color: var(--streak-color); background: var(--streak-bg); border-color: transparent; }
                :global(.stat-pill-btn.gems) { color: var(--gem-color); background: var(--gem-bg); border-color: transparent; }
                :global(.stat-pill-btn.hearts) { color: var(--heart-color); background: var(--heart-bg); border-color: transparent; }
                
                :global(.stat-pill-btn:hover) { transform: translateY(-2px); box-shadow: var(--shadow-md); filter: brightness(1.05); }
                :global(.stat-pill-btn:active) { transform: translateY(0); }
                :global(.stat-emoji) { font-size: 1rem; }
            `}</style>
        </div>
    );
}

function IconHome() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function IconLearn() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>;
}
function IconLeaderboard() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /><circle cx="12" cy="8" r="6" /></svg>;
}
function IconShop() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.12" /></svg>;
}
function IconProfile() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

function SyncIndicator({ status, onSync }: { status: 'synced' | 'pending' | 'offline', onSync: () => void }) {
    const config = {
        synced: { icon: "☁️", color: "var(--green)", label: "Synced" },
        pending: { icon: "⏳", color: "var(--orange)", label: "Syncing..." },
        offline: { icon: "📡", color: "var(--text-muted)", label: "Offline" }
    }[status];

    return (
        <button
            className={`sync-indicator ${status}`}
            onClick={() => status !== 'synced' && onSync()}
            title={config.label}
        >
            <span className="sync-icon" style={{ color: config.color }}>{config.icon}</span>
            <style jsx>{`
                .sync-indicator {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--shadow-sm);
                }
                .sync-indicator:hover { transform: scale(1.1); box-shadow: var(--shadow-md); }
                .pending .sync-icon { animation: spin 2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </button>
    );
}
