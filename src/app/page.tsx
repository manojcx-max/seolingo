"use client";
import { useGameStore, getLevel } from "@/store/gameStore";
import { curriculum, getAllLessons } from "@/data/curriculum";
import { LionGuide } from "@/components/LionGuide";
import Link from "next/link";
import { playSound } from "@/utils/audio";

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

      {/* Streak Banner - High Impact */}
      <div className="streak-banner-premium anim-pop" onClick={() => { setShowStreakModal(true); playSound('step'); }} style={{ marginBottom: 28 }}>
        <div className="streak-fire-wrap">
          <span className="streak-fire-icon">🔥</span>
          <div className="streak-fire-glow"></div>
        </div>
        <div className="streak-banner-content">
          <div className="streak-banner-title">
            <span className="count">{streak}</span> DAY STREAK
          </div>
          <div className="streak-banner-status">
            {streak > 0 ? "You're on fire! Keep the pride growing." : "Your legend starts with a single step."}
          </div>
        </div>
        <div className="streak-banner-badge">
          {useGameStore.getState().streakFreezeActive ? "🛡️ PROTECTED" : "FREEZE"}
        </div>
      </div>

      <LionGuide
        message={`Hey ${username}! Ready to sharpen your SEO claws?`}
        subMessage="The first lesson on Rendering is waiting for you!"
      />

      {showStreakModal && (

        <StreakModal streak={streak} gems={gems} onClose={() => setShowStreakModal(false)} />
      )}

      <div className="dashboard-grid">
        {/* Daily Quests - Gamified Cards */}
        <div className="card-gamified" style={{ marginBottom: 28, background: 'var(--bg-card)' }}>
          <div className="card-header-clean">
            <span style={{ fontSize: '1.2rem', fontWeight: 950 }}>Daily Quests</span>
            <span className="quest-refresh">Resets at midnight</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {quests.map(q => (
              <div key={q.id} className={`quest-card-item ${q.claimed ? 'claimed' : ''}`}>
                <div className="quest-card-top">
                  <div className="quest-icon-mini">{q.title.includes('Lesson') ? '📚' : '🔥'}</div>
                  <div style={{ flex: 1 }}>
                    <div className="quest-name-v2">{q.title}</div>
                    <div className="quest-reward-v2">{q.reward} Gems</div>
                  </div>
                  {q.completed && !q.claimed ? (
                    <button className="btn-green btn-sm anim-pop" onClick={() => { claimQuest(q.id); playSound('success'); }}>
                      CLAIM
                    </button>
                  ) : q.claimed ? (
                    <span className="claimed-check">✓</span>
                  ) : (
                    <span className="quest-count-v2">{q.progress}/{q.goal}</span>
                  )}
                </div>
                <div className="progress-track" style={{ height: 10 }}>
                  <div className={`progress-fill ${q.completed ? 'progress-fill-green' : 'progress-fill-orange'}`} style={{ width: `${(q.progress / q.goal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Activity - Primary Quest */}
        {nextLesson && (
          <div className="quest-card-main anim-pop">
            <div className="quest-card-decoration">{nextLesson.title.charAt(0)}</div>
            <div className="quest-card-body">
              <div className="quest-badge">MAIN QUEST</div>
              <h3 className="quest-title">{nextLesson.title}</h3>
              <div className="quest-meta">
                <span className="xp-tag">+{nextLesson.xp} XP</span>
                <span className="time-tag">~5 mins</span>
              </div>
            </div>
            <Link href={`/lesson/${nextLesson.id}`} onClick={() => playSound('roar')} className="btn-green quest-btn">
              START LESSON ➜
            </Link>
          </div>
        )}
      </div>

      {/* Performance Stats - Premium Cards */}
      <div className="stats-row" style={{ marginTop: 24, marginBottom: 32 }}>
        <div className="stat-card-premium">
          <div className="stat-card-label">Overall Progress</div>
          <div className="stat-card-body">
            <span className="stat-large-val">{pct}%</span>
            <div className="stat-mini-ring">
              <svg viewBox="0 0 36 36" className="circular-chart-v2">
                <path className="circle-bg-v2" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-v2" strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-card-label">Daily Mission</div>
          <div className="stat-large-val">{lessonsCompletedToday} <span className="stat-divider-v2">/</span> {dailyGoal}</div>
          <div className="progress-track" style={{ height: 12, marginTop: 12 }}>
            <div className="progress-fill progress-fill-blue" style={{ width: `${Math.min(100, (lessonsCompletedToday / dailyGoal) * 100)}%` }} />
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
                    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
                    border-radius: 28px;
                    padding: 24px 32px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    cursor: pointer;
                    box-shadow: 0 12px 24px rgba(251, 133, 0, 0.25);
                    transition: all 0.3s;
                }
                .streak-card-premium:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 15px 30px rgba(251, 133, 0, 0.35); }
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
