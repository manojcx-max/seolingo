"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getLessonById, LessonContent, Question } from "@/data/curriculum";
import { useGameStore } from "@/store/gameStore";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });
type Phase = "reading" | "quiz" | "complete";

// ── Audio System (Duolingo Style) ──
const playSuccess = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // Duolingo Success: Two bright tones
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5

    osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
};

const playError = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
};

// ── Components ──

function LionGuide({ state, speech, onDismiss, isHidden }: { state: 'idle' | 'happy' | 'sad' | 'thinking', speech?: string, onDismiss: () => void, isHidden: boolean }) {
    if (isHidden) return null;
    return (
        <div className="lion-guide-container anim-fadein" style={{ opacity: isHidden ? 0 : 1, transform: isHidden ? 'translateX(-100px)' : 'none' }}>
            <div className={`lion-svg-wrap lion-${state}`}>
                <svg viewBox="0 0 100 100" width="80" height="80">
                    {/* Mane */}
                    <circle cx="50" cy="50" r="45" fill="#FF9600" />
                    <circle cx="50" cy="50" r="40" fill="#FFB74D" />
                    {/* Face */}
                    <circle cx="50" cy="55" r="30" fill="#FFE082" />
                    {/* Ears */}
                    <circle cx="25" cy="35" r="10" fill="#FFE082" />
                    <circle cx="75" cy="35" r="10" fill="#FFE082" />
                    {/* Eyes */}
                    <g className="lion-eyes">
                        {state === 'sad' ? (
                            <>
                                <path d="M35 50 Q40 45 45 50" stroke="#5D4037" strokeWidth="3" fill="none" />
                                <path d="M55 50 Q60 45 65 50" stroke="#5D4037" strokeWidth="3" fill="none" />
                            </>
                        ) : state === 'happy' ? (
                            <>
                                <circle cx="40" cy="50" r="4" fill="#5D4037" />
                                <circle cx="60" cy="50" r="4" fill="#5D4037" />
                                <path d="M38 42 L42 45 M58 45 L62 42" stroke="#5D4037" strokeWidth="2" />
                            </>
                        ) : (
                            <>
                                <circle cx="40" cy="50" r="4" fill="#5D4037" className="eye-l" />
                                <circle cx="60" cy="50" r="4" fill="#5D4037" className="eye-r" />
                            </>
                        )}
                    </g>
                    {/* Nose */}
                    <path d="M46 60 L54 60 L50 65 Z" fill="#5D4037" />
                    {/* Mouth */}
                    {state === 'happy' ? (
                        <path d="M40 70 Q50 80 60 70" stroke="#5D4037" strokeWidth="3" fill="none" />
                    ) : state === 'sad' ? (
                        <path d="M40 75 Q50 65 60 75" stroke="#5D4037" strokeWidth="3" fill="none" />
                    ) : (
                        <path d="M42 70 Q50 75 58 70" stroke="#5D4037" strokeWidth="2" fill="none" />
                    )}
                </svg>
            </div>
            {speech && (
                <div className="lion-speech-bubble anim-pop">
                    {speech}
                    <button className="lion-close" onClick={onDismiss} aria-label="Dismiss guide">✕</button>
                </div>
            )}
            <style jsx>{`
                .lion-guide-container { 
                    display: flex; 
                    align-items: center; 
                    gap: 16px;
                    margin: 24px 0;
                    padding: 16px 20px;
                    background: var(--bg-card);
                    border-radius: 20px;
                    border: 2px solid var(--border);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .lion-speech-bubble { 
                    flex: 1;
                    background: white; 
                    border: 2px solid var(--border); 
                    border-radius: 16px; 
                    padding: 10px 32px 10px 14px; 
                    font-weight: 800; 
                    font-size: 0.85rem; 
                    position: relative; 
                    color: var(--text);
                }
                .lion-speech-bubble::after { 
                    content: ''; 
                    position: absolute; 
                    left: -10px; 
                    top: 50%; 
                    transform: translateY(-50%);
                    border-style: solid; 
                    border-width: 8px 10px 8px 0; 
                    border-color: transparent white transparent transparent; 
                    z-index: 2;
                }
                .lion-speech-bubble::before { 
                    content: ''; 
                    position: absolute; 
                    left: -12.5px; 
                    top: 50%; 
                    transform: translateY(-50%);
                    border-style: solid; 
                    border-width: 9px 12.5px 9px 0; 
                    border-color: transparent var(--border) transparent transparent; 
                    z-index: 1;
                }
                .lion-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    cursor: pointer;
                    padding: 4px;
                    pointer-events: auto;
                }
                .lion-close:hover { color: var(--red); }

                .lion-svg-wrap { flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .lion-happy { animation: lion-jump 0.5s infinite alternate; }
                .lion-sad { animation: lion-shake 0.4s infinite; }
                .lion-idle { animation: lion-breathe 2s infinite ease-in-out; }
                
                @keyframes lion-jump { from { transform: translateY(0); } to { transform: translateY(-10px); } }
                @keyframes lion-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
                @keyframes lion-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                
                .eye-l, .eye-r { animation: blink 4s infinite; transform-origin: center; }
                @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
            `}</style>
        </div>
    );
}

export default function LessonPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const lesson = getLessonById(id);
    const { hearts, loseHeart, completeLesson, learningStyle } = useGameStore();

    const [phase, setPhase] = useState<Phase>("reading");
    const [qi, setQi] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [win, setWin] = useState({ w: 800, h: 600 });

    // Guide State
    const [guideState, setGuideState] = useState<'idle' | 'happy' | 'sad' | 'thinking'>('idle');
    const [speech, setSpeech] = useState<string | undefined>("Let's go, Legend!");
    const [isLionHidden, setIsLionHidden] = useState(false);

    // Matching State
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // "left:right"
    const [failedMatch, setFailedMatch] = useState<[string, string] | null>(null);

    useEffect(() => { setWin({ w: window.innerWidth, h: window.innerHeight }); }, []);

    if (!lesson) return <div>Lesson not found</div>;

    const activeContent: LessonContent = 'simple' in lesson.content
        ? (learningStyle === 'technical' ? lesson.content.technical : lesson.content.simple)
        : lesson.content as LessonContent;

    const currentQ = lesson.quiz[qi];
    const totalQ = lesson.quiz.length;

    const handleAnswer = (idx: number) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        const isCorrect = idx === currentQ.correct;
        setCorrect(isCorrect);
        if (isCorrect) {
            playSuccess();
            setCorrectCount(c => c + 1);
            setGuideState('happy');
            setSpeech(HAPPY_PHRASES[Math.floor(Math.random() * HAPPY_PHRASES.length)]);
        } else {
            playError();
            if (hearts > 0) loseHeart();
            setGuideState('sad');
            setSpeech(SAD_PHRASES[Math.floor(Math.random() * SAD_PHRASES.length)]);
        }
    };

    const handleMatch = (val: string, side: 'left' | 'right') => {
        if (answered) return;
        if (side === 'left') {
            if (leftSelected === val) setLeftSelected(null);
            else setLeftSelected(val);
        } else {
            if (rightSelected === val) setRightSelected(null);
            else setRightSelected(val);
        }
    };

    useEffect(() => {
        if (leftSelected && rightSelected) {
            const isMatch = currentQ.pairs?.some(p => p.left === leftSelected && p.right === rightSelected);
            if (isMatch) {
                const pairStr = `${leftSelected}:${rightSelected}`;
                setMatchedPairs(prev => [...prev, pairStr]);
                setLeftSelected(null);
                setRightSelected(null);
                playSuccess();
                // Check if all matched
                if (matchedPairs.length + 1 === currentQ.pairs?.length) {
                    setCorrect(true);
                    setAnswered(true);
                    setCorrectCount(c => c + 1);
                    setGuideState('happy');
                    setSpeech("Perfectly matched! 🔗");
                }
            } else {
                setFailedMatch([leftSelected, rightSelected]);
                playError();
                setTimeout(() => {
                    setFailedMatch(null);
                    setLeftSelected(null);
                    setRightSelected(null);
                }, 500);
                if (hearts > 0) loseHeart();
            }
        }
    }, [leftSelected, rightSelected]);

    const handleNext = () => {
        if (qi < totalQ - 1) {
            setQi(i => i + 1);
            setSelected(null);
            setAnswered(false);
            setCorrect(false);
            setMatchedPairs([]);
            setGuideState('idle');
            setSpeech(IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)]);
        } else {
            const score = Math.round((correctCount / totalQ) * 100);
            completeLesson(id, score, lesson.xp);
            setXpEarned(lesson.xp);
            setPhase("complete");
            setIsLionHidden(true); // Hide in completion phase
            if (score >= 70) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
        }
    };

    const leftItems = useMemo(() => currentQ.type === 'match' ? [...(currentQ.pairs || [])].sort(() => Math.random() - 0.5) : [], [qi]);
    const rightItems = useMemo(() => currentQ.type === 'match' ? [...(currentQ.pairs || [])].sort(() => Math.random() - 0.5) : [], [qi]);

    return (
        <div className="lesson-shell">
            {showConfetti && <Confetti width={win.w} height={win.h} recycle={false} numberOfPieces={280} />}

            <div className="lesson-topbar">
                <button className="btn btn-ghost btn-sm" onClick={() => router.push("/learn")}>✕</button>
                <div className="lesson-progress-track"><div className="lesson-progress-fill" style={{ width: `${(qi / totalQ) * 100}%` }} /></div>
                <div style={{ display: "flex", gap: 6, background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: 20 }}>
                    {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ opacity: i >= hearts ? 0.3 : 1 }}>❤️</span>)}
                </div>
            </div>

            {phase === "reading" && (
                <div className="lesson-body anim-fadein">
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div className="mode-pill">{learningStyle.toUpperCase()} MODE</div>
                        <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>{lesson.emoji} {lesson.title}</h1>
                    </div>
                    <div className="card" style={{ padding: 32, borderRadius: 24, border: '2px solid var(--border)' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 32 }}>{activeContent.intro}</p>
                        {activeContent.sections.map((s, i) => (
                            <div key={i} style={{ marginBottom: 32 }}>
                                <h3 style={{ display: 'flex', gap: 12, alignItems: 'center', fontWeight: 900 }}><span className="step-num">{i + 1}</span> {s.heading}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="lesson-cta-bar"><button className="btn-premium" style={{ width: '100%' }} onClick={() => setPhase("quiz")}>START QUIZ</button></div>

                    {!isLionHidden && (
                        <LionGuide
                            state={guideState}
                            speech={speech}
                            isHidden={isLionHidden}
                            onDismiss={() => setIsLionHidden(true)}
                        />
                    )}
                </div>
            )}

            {phase === "quiz" && (
                <div className="lesson-body anim-fadein">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 32 }}>{currentQ.question}</h2>

                    {!isLionHidden && !answered && (
                        <LionGuide
                            state={guideState}
                            speech={speech}
                            isHidden={isLionHidden}
                            onDismiss={() => setIsLionHidden(true)}
                        />
                    )}

                    {currentQ.type === 'match' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {leftItems.map(p => {
                                    const isSelected = leftSelected === p.left;
                                    const isMatched = matchedPairs.some(m => m.startsWith(p.left));
                                    const isFailed = failedMatch?.[0] === p.left;
                                    return (
                                        <button
                                            key={p.left}
                                            className={`match-btn ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isFailed ? 'failed' : ''}`}
                                            disabled={isMatched || answered}
                                            onClick={() => handleMatch(p.left, 'left')}
                                        >
                                            {p.left}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {rightItems.map(p => {
                                    const isSelected = rightSelected === p.right;
                                    const isMatched = matchedPairs.some(m => m.endsWith(p.right));
                                    const isFailed = failedMatch?.[1] === p.right;
                                    return (
                                        <button
                                            key={p.right}
                                            className={`match-btn ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isFailed ? 'failed' : ''}`}
                                            disabled={isMatched || answered}
                                            onClick={() => handleMatch(p.right, 'right')}
                                        >
                                            {p.right}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="quiz-options">
                            {currentQ.options.map((opt, idx) => {
                                const isSel = selected === idx;
                                const isCor = idx === currentQ.correct;
                                return (
                                    <button
                                        key={idx}
                                        className={`quiz-opt ${answered ? (isCor ? 'correct' : (isSel ? 'wrong' : 'disabled')) : (isSel ? 'selected' : '')}`}
                                        disabled={answered}
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        <span className="opt-letter">{"ABCD"[idx]}</span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {answered && (
                        <>
                            <div className={`feedback-card ${correct ? 'fb-correct' : 'fb-wrong'}`}>
                                <div style={{ fontWeight: 900, marginBottom: 4 }}>{correct ? "Spot on!" : "Keep learning!"}</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{currentQ.explanation}</div>
                            </div>
                            {!isLionHidden && (
                                <LionGuide
                                    state={guideState}
                                    speech={speech}
                                    isHidden={isLionHidden}
                                    onDismiss={() => setIsLionHidden(true)}
                                />
                            )}
                        </>
                    )}

                    <div className="lesson-cta-bar">
                        {answered ? <button className="btn-premium" style={{ width: '100%', background: correct ? 'var(--green)' : 'var(--orange)' }} onClick={handleNext}>CONTINUE</button> : <div style={{ textAlign: 'center', opacity: 0.5, fontWeight: 800 }}>CHOOSE THE CORRECT ANSWER</div>}
                    </div>
                </div>
            )}

            {phase === "complete" && (
                <div className="lesson-body completion-wrap anim-fadein">
                    <div style={{ fontSize: '6rem' }}>{correctCount / totalQ >= 0.7 ? "🏆" : "💪"}</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Lesson Complete!</h1>
                    <div className="stats-row">
                        <div className="stat-box"><div className="val">+{xpEarned}</div><div className="lbl">XP</div></div>
                        <div className="stat-box"><div className="val">{Math.round((correctCount / totalQ) * 100)}%</div><div className="lbl">Accuracy</div></div>
                    </div>
                    <button className="btn-premium" style={{ width: '100%', maxWidth: 300 }} onClick={() => router.push("/learn")}>CONTINUE PATH</button>
                </div>
            )}

            <style jsx>{`
                .mode-pill { display: inline-block; padding: 4px 12px; background: var(--green-bg); color: var(--green); border-radius: 20px; font-weight: 900; font-size: 0.75rem; margin-bottom: 12px; }
                .step-num { width: 28px; height: 28px; background: var(--green); color: white; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 0.8rem; }
                
                .quiz-opt { width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid var(--border); background: var(--bg-card); display: flex; gap: 16px; align-items: center; font-weight: 800; text-align: left; cursor: pointer; transition: all 0.2s; margin-bottom: 12px; }
                .quiz-opt.selected { border-color: var(--blue); background: var(--blue-bg); }
                .quiz-opt.correct { border-color: var(--green); background: var(--green-bg); }
                .quiz-opt.wrong { border-color: var(--red); background: var(--red-bg); }
                
                .match-btn { padding: 16px; border-radius: 16px; border: 2.5px solid var(--border); background: var(--bg-card); font-weight: 900; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 var(--border); }
                .match-btn.selected { border-color: var(--blue); background: var(--blue-bg); color: var(--blue); transform: translateY(-2px); box-shadow: 0 4px 0 var(--blue); }
                .match-btn.matched { border-color: var(--green); background: var(--green-bg); color: var(--green); opacity: 0.6; box-shadow: none; transform: none; cursor: default; }
                .match-btn.failed { border-color: var(--red); background: var(--red-bg); color: var(--red); animation: shake 0.3s; }
                
                .feedback-card { margin-top: 32px; padding: 24px; border-radius: 20px; }
                .fb-correct { background: var(--green-bg); color: var(--green-dark); border: 2px solid var(--green); }
                .fb-wrong { background: var(--orange-bg); color: var(--orange-dark); border: 2px solid var(--orange); }
                
                .stats-row { display: flex; gap: 24px; margin: 40px 0; }
                .stat-box { background: var(--bg-card); border: 2px solid var(--border); padding: 20px; border-radius: 20px; text-align: center; min-width: 120px; }
                .stat-box .val { font-size: 1.5rem; font-weight: 900; }
                .stat-box .lbl { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); }

                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            `}</style>
        </div>
    );
}

const HAPPY_PHRASES = ["You're unstoppable!", "Brilliant work, Legend!", "That's how it's done!", "SEO Genius at work!", "Pure talent! ✨"];
const SAD_PHRASES = ["Don't worry, keep going!", "Mistakes make us grow!", "ALMOST! Try again.", "You've got this, focus!", "Rest those eyes and focus."];
const IDLE_PHRASES = ["Let's smash this!", "Ready for the next one?", "Focus on the goal!", "Marketing is fun, right?"];
