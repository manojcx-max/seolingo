"use client";
import { useGameStore, getLeaderboard } from "@/store/gameStore";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const { xp, username, avatar, streak } = useGameStore();
    const [board, setBoard] = useState<any[]>([]);

    useEffect(() => {
        setBoard(getLeaderboard(xp, username));
    }, [xp, username]);

    const top3 = board.slice(0, 3);
    const others = board.slice(3);

    return (
        <div className="anim-fadein">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}>Leaderboard</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Compete with the top marketing specialists globally!</p>
            </div>

            {/* Podium Section */}
            <div className="podium-container">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="podium-item place-2">
                        <div className="podium-avatar-wrapper">
                            <span className="podium-avatar">{top3[1].avatar}</span>
                            <div className="podium-badge">2</div>
                        </div>
                        <div className="podium-name">{top3[1].name}</div>
                        <div className="podium-xp">{top3[1].xp} XP</div>
                        <div className="podium-bar silver" />
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className="podium-item place-1">
                        <div className="podium-avatar-wrapper">
                            <span className="podium-crown">👑</span>
                            <span className="podium-avatar">{top3[0].avatar}</span>
                            <div className="podium-badge">1</div>
                        </div>
                        <div className="podium-name">{top3[0].name}</div>
                        <div className="podium-xp">{top3[0].xp} XP</div>
                        <div className="podium-bar gold" />
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="podium-item place-3">
                        <div className="podium-avatar-wrapper">
                            <span className="podium-avatar">{top3[2].avatar}</span>
                            <div className="podium-badge">3</div>
                        </div>
                        <div className="podium-name">{top3[2].name}</div>
                        <div className="podium-xp">{top3[2].xp} XP</div>
                        <div className="podium-bar bronze" />
                    </div>
                )}
            </div>

            {/* Full Rankings */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>All Rankings</span>
                </div>
                <div className="list-wrapper">
                    {board.map((u, i) => (
                        <div key={i} className={`list-item ${u.isYou ? 'is-you' : ''}`}>
                            <div className="rank-num">{u.rank}</div>
                            <div className="user-icon">{u.avatar}</div>
                            <div className="user-info">
                                <div className="user-name">
                                    {u.name}
                                    {u.isYou && <span className="you-pill">You</span>}
                                </div>
                                <div className="user-meta">🔥 {u.streak} day streak</div>
                            </div>
                            <div className="user-points">{u.xp.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>XP</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .podium-container {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding-top: 40px;
                }
                .podium-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100px;
                }
                .podium-avatar-wrapper {
                    position: relative;
                    margin-bottom: 12px;
                }
                .podium-avatar {
                    width: 60px;
                    height: 60px;
                    background: var(--bg-card);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    border: 4px solid var(--bg-card);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .place-1 .podium-avatar {
                    width: 84px;
                    height: 84px;
                    font-size: 2.8rem;
                    border-color: #FFD700;
                }
                .place-2 .podium-avatar { border-color: #BEC2CB; }
                .place-3 .podium-avatar { border-color: #CD7F32; }

                .podium-badge {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    width: 24px;
                    height: 24px;
                    background: var(--text);
                    color: var(--bg-card);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 900;
                    border: 2px solid var(--bg-card);
                }
                .podium-crown {
                    position: absolute;
                    top: -24px;
                    font-size: 1.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .podium-name {
                    font-weight: 800;
                    font-size: 0.85rem;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
                .podium-xp {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }
                .podium-bar {
                    width: 100%;
                    border-radius: 8px 8px 0 0;
                }
                .place-1 .podium-bar { height: 70px; background: linear-gradient(to bottom, #FFD700, #F3C300); }
                .place-2 .podium-bar { height: 45px; background: linear-gradient(to bottom, #BEC2CB, #9CA3AF); }
                .place-3 .podium-bar { height: 30px; background: linear-gradient(to bottom, #CD7F32, #9E6329); }

                .list-item {
                    display: flex;
                    align-items: center;
                    padding: 16px 24px;
                    gap: 16px;
                    border-bottom: 2px solid var(--border);
                }
                .list-item:last-child { border-bottom: none; }
                .list-item.is-you {
                    background: var(--bg-secondary);
                }
                .rank-num {
                    width: 24px;
                    font-weight: 900;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .user-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: var(--bg-card);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                .user-info { flex: 1; }
                .user-name {
                    font-weight: 800;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .you-pill {
                    background: var(--green);
                    color: white;
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 900;
                }
                .user-meta {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .user-points {
                    font-weight: 900;
                    font-size: 1rem;
                    color: var(--text);
                }
            `}</style>
        </div>
    );
}
