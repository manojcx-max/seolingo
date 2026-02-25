"use client";
import { useGameStore } from "@/store/gameStore";
import { curriculum } from "@/data/curriculum";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ── Layout constants ──────────────────────────────────────────
const COL = [170, 270, 170, 70]; // x-positions in 340px container
const NODE_SIZE = 90;
const ROW_GAP = 130;

function getNodeX(i: number) { return COL[i % COL.length]; }
function getNodeY(i: number) { return i * ROW_GAP + NODE_SIZE / 2; }

// Smooth cubic bezier between two nodes
function curvePath(x1: number, y1: number, x2: number, y2: number) {
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
}

function hexOpacity(hex: string, alpha: number) {
    // Returns rgba from hex + alpha (0-1)
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function LessonSnake({
    lessons,
    phaseColor,
    phaseUnlocked,
    isLessonDone,
    isUnlocked,
}: {
    lessons: Array<{ id: string; emoji: string; title: string; minutes: number; xp: number }>;
    phaseColor: string; // always a full hex like "#58cc02"
    phaseUnlocked: boolean;
    isLessonDone: (id: string) => boolean;
    isUnlocked: (id: string) => boolean;
}) {
    const svgW = 340;
    const svgH = lessons.length * ROW_GAP + NODE_SIZE;
    const r = NODE_SIZE / 2;

    return (
        <div className="snake-wrapper" style={{ width: svgW, height: svgH }}>
            {/* SVG curves — behind nodes */}
            <svg
                className="snake-svg"
                width={svgW}
                height={svgH}
                viewBox={`0 0 ${svgW} ${svgH}`}
            >
                {lessons.map((lesson, li) => {
                    if (li === 0) return null;
                    const prev = lessons[li - 1];
                    const done = isLessonDone(prev.id) && phaseUnlocked;
                    return (
                        <path
                            key={`p${li}`}
                            d={curvePath(
                                getNodeX(li - 1), getNodeY(li - 1),
                                getNodeX(li), getNodeY(li)
                            )}
                            fill="none"
                            stroke={done ? phaseColor : "#e8e8e8"}
                            strokeWidth={8}
                            strokeLinecap="round"
                            opacity={done ? 0.85 : 0.5}
                            style={{ transition: "stroke 0.5s ease, opacity 0.5s ease" }}
                        />
                    );
                })}
            </svg>

            {/* Node elements — positioned over the SVG */}
            {lessons.map((lesson, li) => {
                const cx = getNodeX(li);
                const cy = getNodeY(li);
                const done = isLessonDone(lesson.id);
                const unlocked = isUnlocked(lesson.id) && phaseUnlocked;
                const isNext = !done && unlocked;

                const nodeStyle: React.CSSProperties = {
                    position: "absolute",
                    left: cx - r,
                    top: cy - r,
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                    overflow: "visible",
                };

                // Background gradient for done state — no color-mix needed
                const doneGradient = done
                    ? `linear-gradient(145deg, ${phaseColor}, ${phaseColor}aa)`
                    : undefined;

                const nodeGlowStyle: React.CSSProperties = isNext ? {
                    boxShadow: `0 0 0 6px ${phaseColor}22, 0 8px 24px rgba(0,0,0,0.1)`,
                    border: `3px solid ${phaseColor}`,
                } : done ? {
                    background: doneGradient,
                    borderColor: phaseColor,
                    boxShadow: `0 6px 20px ${phaseColor}44, inset 0 1px 0 rgba(255,255,255,0.3)`,
                } : {};

                return (
                    <div
                        key={lesson.id}
                        className={`sn-node-wrap${isNext ? " is-next-wrap" : ""}`}
                        style={nodeStyle}
                    >
                        {isNext && (
                            <div className="start-chip">
                                START
                                <div className="chip-tail" />
                            </div>
                        )}

                        <Link
                            href={unlocked ? `/lesson/${lesson.id}` : "#"}
                            className={`sn-node${done ? " sn-done" : ""}${!unlocked ? " sn-locked" : ""}${isNext ? " sn-next" : ""}`}
                            style={nodeGlowStyle}
                            onClick={(e) => !unlocked && e.preventDefault()}
                            aria-label={lesson.title}
                        >
                            <span className="sn-emoji">{unlocked ? lesson.emoji : "🔒"}</span>
                            {done && <div className="sn-check">✓</div>}
                        </Link>

                        <div className="sn-label">
                            <span className="sn-title">{lesson.title}</span>
                            <span className="sn-meta">{lesson.minutes}m · {lesson.xp} XP</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function LearnPage() {
    const router = useRouter();
    const { username, lessonProgress } = useGameStore();

    useEffect(() => { if (!username) router.push("/onboarding"); }, [username]);
    if (!username) return null;

    const isLessonDone = (id: string) => !!lessonProgress[id]?.completed;

    const allIds: string[] = [];
    curriculum.forEach(p => p.units.forEach(u => u.lessons.forEach(l => allIds.push(l.id))));
    const isUnlocked = (id: string) => {
        const idx = allIds.indexOf(id);
        if (idx === 0) return true;
        return isLessonDone(allIds[idx - 1]);
    };

    const totalLessons = allIds.length;
    const completedCount = Object.values(lessonProgress).filter(l => l.completed).length;
    const pct = Math.round((completedCount / totalLessons) * 100);

    return (
        <div className="anim-fadein lp-wrap">
            {/* Header */}
            <div className="lp-head">
                <div>
                    <h1 className="lp-h1">Learning Path</h1>
                    <p className="lp-h1-sub">{completedCount} of {totalLessons} lessons completed</p>
                </div>
                <div className="lp-prog-row">
                    <div className="lp-prog-track">
                        <div className="lp-prog-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="lp-pct">{pct}%</span>
                </div>
            </div>

            {/* Phases */}
            <div className="lp-phases">
                {curriculum.map((phase, pi) => {
                    const phaseLessons = phase.units.flatMap(u => u.lessons);
                    const phaseIds = phaseLessons.map(l => l.id);
                    const phaseDone = phaseIds.every(isLessonDone);
                    const phaseUnlocked = pi === 0 || curriculum[pi - 1].units.flatMap(u => u.lessons.map(l => l.id)).every(isLessonDone);

                    return (
                        <div key={phase.id} className="lp-phase">
                            {/* Phase banner */}
                            <div
                                className="lp-banner"
                                style={{
                                    background: phaseUnlocked
                                        ? `linear-gradient(135deg, ${phase.color}, ${phase.color}bb)`
                                        : "var(--bg-secondary)",
                                    color: phaseUnlocked ? "white" : "var(--text-muted)",
                                    boxShadow: phaseUnlocked
                                        ? `0 10px 30px ${phase.color}33`
                                        : "none",
                                }}
                            >
                                <div className="lp-banner-icon">
                                    <span style={{ fontSize: "2rem", lineHeight: 1 }}>{phaseUnlocked ? phase.emoji : "🔒"}</span>
                                </div>
                                <div className="lp-banner-text">
                                    <div className="lp-banner-title">{phase.title}</div>
                                    <div className="lp-banner-sub">{phase.subtitle}</div>
                                </div>
                                {phaseDone && (
                                    <div className="lp-done-chip">✨ Complete</div>
                                )}
                            </div>

                            {/* Snake path */}
                            <div className="lp-snake-holder">
                                <LessonSnake
                                    lessons={phaseLessons}
                                    phaseColor={phase.color}
                                    phaseUnlocked={phaseUnlocked}
                                    isLessonDone={isLessonDone}
                                    isUnlocked={isUnlocked}
                                />
                            </div>

                            {/* Milestone */}
                            <div className="lp-milestone">
                                <div
                                    className={phaseDone ? "lp-trophy lp-trophy-earned" : "lp-trophy"}
                                    style={phaseDone ? {
                                        background: `linear-gradient(145deg, ${phase.color}cc, ${phase.color})`,
                                        borderColor: phase.color,
                                        boxShadow: `0 16px 40px ${phase.color}44`,
                                    } : {}}
                                >
                                    <span className="lp-trophy-icon">{phaseDone ? "🏆" : phase.emoji}</span>
                                </div>
                                <p className="lp-trophy-label">
                                    {phaseDone ? "🎉 Phase complete!" : `Complete ${phase.title} to earn this`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .lp-wrap { padding-bottom: 80px; }

                /* ── Header ──────────────────────────────── */
                .lp-head {
                    margin-bottom: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .lp-h1 {
                    font-size: 2rem;
                    font-weight: 900;
                    letter-spacing: -0.5px;
                    margin-bottom: 4px;
                }
                .lp-h1-sub {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    font-weight: 700;
                }
                .lp-prog-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .lp-prog-track {
                    flex: 1;
                    height: 10px;
                    background: var(--border);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .lp-prog-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--green), var(--green-light));
                    border-radius: 999px;
                    transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .lp-pct {
                    font-weight: 900;
                    font-size: 0.9rem;
                    color: var(--green);
                    min-width: 42px;
                    text-align: right;
                }

                /* ── Phases ──────────────────────────────── */
                .lp-phases {
                    display: flex;
                    flex-direction: column;
                    gap: 72px;
                }
                .lp-phase {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                /* ── Phase Banner ────────────────────────── */
                .lp-banner {
                    width: 100%;
                    max-width: 380px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px 24px;
                    border-radius: 24px;
                    margin-bottom: 52px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }
                .lp-banner::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -8%;
                    width: 160px;
                    height: 160px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .lp-banner-icon {
                    width: 52px;
                    height: 52px;
                    background: rgba(255, 255, 255, 0.18);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .lp-banner-title {
                    font-size: 1.3rem;
                    font-weight: 900;
                    letter-spacing: -0.3px;
                    line-height: 1.15;
                }
                .lp-banner-sub {
                    font-size: 0.82rem;
                    font-weight: 700;
                    opacity: 0.88;
                    margin-top: 3px;
                }
                .lp-done-chip {
                    margin-left: auto;
                    background: rgba(255, 255, 255, 0.22);
                    padding: 6px 14px;
                    border-radius: 999px;
                    font-size: 0.72rem;
                    font-weight: 900;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                /* ── Snake holder ────────────────────────── */
                .lp-snake-holder {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }

                /* ── Milestone ───────────────────────────── */
                .lp-milestone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    margin-top: 48px;
                }
                .lp-trophy {
                    width: 100px;
                    height: 100px;
                    border-radius: 28px;
                    background: var(--bg-secondary);
                    border: 2px dashed var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .lp-trophy-earned {
                    animation: trophy-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
                .lp-trophy-icon { font-size: 3.2rem; }
                .lp-trophy-label {
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-align: center;
                }

                @keyframes trophy-pop {
                    0%  { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.1); opacity: 1; }
                    100%{ transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </div>
    );
}
