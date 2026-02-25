"use client";
import { useGameStore, getLevel } from "@/store/gameStore";
import { curriculum, getAllLessons } from "@/data/curriculum";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const {
    username, xp, streak, hearts, gems, lessonProgress,
    dailyGoal, lessonsCompletedToday, checkAndUpdateStreak,
    quests, claimQuest
  } = useGameStore();
  const { level, title } = getLevel(xp);
  const [showStreakModal, setShowStreakModal] = useState(false);

  useEffect(() => {
    if (!username) router.push("/onboarding");
    else checkAndUpdateStreak();
  }, [username]);

  if (!username) return null;

  const allLessons = getAllLessons();
  const totalLessons = allLessons.length;
  const completedCount = Object.values(lessonProgress).filter(l => l.completed).length;
  const pct = Math.round((completedCount / totalLessons) * 100);

  // Find next lesson
  const nextLesson = allLessons.find(l => !lessonProgress[l.id]?.completed);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="anim-fadein">
      {/* Header Greeting */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>{greeting}, {username}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>You are currently at the <strong>{title}</strong> level.</p>
        </div>
      </div>

      {/* Streak Banner - Sleek version */}
      <div className="streak-card-premium" onClick={() => setShowStreakModal(true)} style={{ marginBottom: 24 }}>
        <div className="streak-visual">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{streak}</span>
        </div>
        <div className="streak-info">
          <div className="streak-title">Day Streak</div>
          <div className="streak-status">{streak > 0 ? "You're building momentum!" : "Start your streak today!"}</div>
        </div>
        <div className="streak-action">
          {useGameStore.getState().streakFreezeActive ? "🛡️ ACTIVE" : "PROTECT"}
        </div>
      </div>

      {showStreakModal && (
        <StreakModal streak={streak} gems={gems} onClose={() => setShowStreakModal(false)} />
      )}

      <div className="dashboard-grid">
        {/* Daily Quests */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header-clean">
            <span>Daily Quests</span>
            <span className="quest-refresh">Next reset at midnight</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quests.map(q => (
              <div key={q.id} className={`quest-item ${q.claimed ? 'claimed' : ''}`}>
                <div className="quest-meta">
                  <div className="quest-name">{q.title}</div>
                  <div className="quest-reward">{q.reward} Gems</div>
                </div>
                <div className="quest-progress-row">
                  <div className="progress-bar-small">
                    <div className="progress-fill" style={{ width: `${(q.progress / q.goal) * 100}%` }} />
                  </div>
                  {q.completed ? (
                    <button
                      className={`claim-btn ${q.claimed ? 'claimed' : ''}`}
                      disabled={q.claimed}
                      onClick={() => claimQuest(q.id)}
                    >
                      {q.claimed ? "Claimed" : "Claim"}
                    </button>
                  ) : (
                    <span className="quest-count">{q.progress}/{q.goal}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Activity */}
        {nextLesson && (
          <div className="continue-card-premium">
            <div className="continue-content">
              <div className="continue-badge">UP NEXT</div>
              <h3 className="continue-title">{nextLesson.title}</h3>
              <div className="continue-meta">
                <span className="phase-indicator">{nextLesson.phaseTitle}</span>
                <span className="dot">•</span>
                <span className="xp-reward">+{nextLesson.xp} XP reward</span>
              </div>
            </div>
            <Link href={`/lesson/${nextLesson.id}`} className="continue-btn-v2">
              <span className="btn-text">CONTINUE</span>
              <span className="btn-icon">➜</span>
            </Link>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="stats-row" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">Total Progress</div>
          <div className="stat-value-group">
            <span className="stat-value">{pct}%</span>
            <div className="stat-progress-ring">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Daily Goal</div>
          <div className="stat-value">{lessonsCompletedToday} <span className="stat-divider">/</span> {dailyGoal}</div>
          <div className="mini-xp-bar">
            <div className="mini-xp-fill" style={{ width: `${Math.min(100, (lessonsCompletedToday / dailyGoal) * 100)}%` }} />
          </div>
        </div>
      </div>

      <style jsx>{`
                .dashboard-grid {
                    display: flex;
                    flex-direction: column;
                }
                .card-header-clean {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.85rem;
                }
                .quest-refresh {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .quest-item {
                    transition: opacity 0.3s;
                }
                .quest-item.claimed { opacity: 0.5; }
                .quest-meta { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .quest-name { font-weight: 700; font-size: 0.95rem; }
                .quest-reward { font-weight: 800; color: var(--purple); font-size: 0.85rem; }
                .quest-progress-row { display: flex; align-items: center; gap: 12px; }
                .progress-bar-small {
                    flex: 1;
                    height: 8px;
                    background: var(--border);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .claim-btn {
                    padding: 6px 14px;
                    background: var(--green);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 0.8rem;
                    cursor: pointer;
                    box-shadow: 0 3px 0 var(--green-dark);
                }
                .claim-btn.claimed { background: var(--border); box-shadow: none; color: var(--text-muted); cursor: default; }
                .quest-count { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); width: 40px; text-align: right; }

                .continue-card-premium {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 28px;
                    padding: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    box-shadow: var(--shadow-md);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    margin-bottom: 24px;
                    position: relative;
                    overflow: hidden;
                }
                .continue-card-premium:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
                .continue-badge {
                    font-size: 0.7rem;
                    font-weight: 950;
                    letter-spacing: 2px;
                    color: var(--green);
                    margin-bottom: 8px;
                    background: var(--green-bg);
                    width: fit-content;
                    padding: 2px 10px;
                    border-radius: 8px;
                }
                .continue-title { font-size: 1.6rem; font-weight: 950; color: var(--text); margin-bottom: 6px; letter-spacing: -0.5px; }
                .continue-meta { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-secondary); font-weight: 700; }
                
                .continue-btn-v2 {
                    background: var(--green);
                    color: white;
                    padding: 16px 32px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-weight: 950;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 4px 15px rgba(88, 204, 2, 0.3);
                    transition: all 0.2s;
                }
                .continue-btn-v2:hover { background: var(--green-dark); transform: scale(1.05); }

                .stat-box {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 28px;
                    padding: 24px;
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .streak-card-premium {
                    background: linear-gradient(135deg, #FF9600, #FF7F00);
                    border-radius: 28px;
                    padding: 24px 32px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    cursor: pointer;
                    box-shadow: 0 12px 24px rgba(255, 150, 0, 0.2);
                    transition: all 0.3s;
                }
                .streak-card-premium:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 15px 30px rgba(255, 150, 0, 0.3); }
                .streak-icon { font-size: 2.2rem; }
                .streak-count { font-size: 2rem; font-weight: 950; }
                .streak-title { font-weight: 950; font-size: 1.2rem; }
                .streak-action { background: rgba(255,255,255,0.25); padding: 8px 16px; border-radius: 14px; font-weight: 950; font-size: 0.7rem; backdrop-filter: blur(4px); }
            `}</style>
    </div>
  );
}

function StreakModal({ streak, gems, onClose }: { streak: number; gems: number; onClose: () => void }) {
  const { purchaseStreakFreeze, streakFreezeActive } = useGameStore();

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 400, width: "100%", borderRadius: 24, padding: 32, animation: 'cardEntry 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "4rem", marginBottom: 12 }}>🔥</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>{streak} Day Streak</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: 8 }}>
            Don't let your progress vanish! Keep learning daily.
          </p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: "2rem" }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800 }}>Streak Freeze</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Protects your streak for 1 day.</div>
          </div>
          <button
            className={`btn btn-sm ${streakFreezeActive ? 'btn-ghost' : 'btn-primary'}`}
            disabled={streakFreezeActive || gems < 150}
            onClick={() => {
              if (purchaseStreakFreeze()) onClose();
            }}
          >
            {streakFreezeActive ? "ACTIVE" : "150 💎"}
          </button>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 24 }} onClick={onClose}>
          Got it!
        </button>
      </div>
      <style jsx>{`
                @keyframes cardEntry {
                    from { transform: scale(0.8) translateY(40px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
    </div>
  );
}
