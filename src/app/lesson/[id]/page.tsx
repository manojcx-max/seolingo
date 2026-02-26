"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getLessonById, LessonContent, Question } from "@/data/curriculum";
import { useGameStore } from "@/store/gameStore";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });
type Phase = "learning" | "quiz" | "complete";

import { playSound } from "@/utils/audio";
import { Flame, Trophy, CheckCircle2, AlertCircle, X, Heart, Star, Brain, ChevronRight, Check } from "lucide-react";

// ── Components ──

function LionGuide({ state, speech, onDismiss, isHidden }: { state: 'idle' | 'happy' | 'sad' | 'thinking', speech?: string, onDismiss: () => void, isHidden: boolean }) {
    if (isHidden) return null;
    return (
        <motion.div
            className="lion-guide-mini"
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) onDismiss();
            }}
            whileTap={{ cursor: "grabbing" }}
        >
            <div className={`lion-avatar-mini lion-${state}`}>
                <img
                    src={state === 'happy' ? '/mascot/happy.png' : state === 'sad' ? '/mascot/sad.png' : state === 'thinking' ? '/mascot/thinking.png' : '/mascot/happy.png'}
                    alt="Lion Guide"
                />
            </div>
            {speech && (
                <div className="lion-bubble-mini">
                    {speech}
                </div>
            )}
            <style jsx>{`
                .lion-guide-mini { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px;
                    margin: 16px 0;
                    padding: 12px 14px;
                    background: var(--bg-card);
                    border-radius: 18px;
                    border: 2px solid var(--border);
                    box-shadow: 0 4px 0 var(--border);
                    cursor: grab;
                    touch-action: none;
                }
                .lion-avatar-mini { 
                    width: 44px; 
                    height: 44px; 
                    flex-shrink: 0;
                    background: white;
                    border-radius: 12px;
                    border: 2px solid var(--border);
                    overflow: hidden;
                }
                .lion-avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
                .lion-bubble-mini { 
                    font-weight: 800; 
                    font-size: 0.8rem; 
                    color: var(--text);
                    line-height: 1.3;
                    letter-spacing: -0.2px;
                }
                
                .lion-happy { animation: float 2s infinite ease-in-out; }
            `}</style>
        </motion.div>
    );
}

export default function LessonPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const lesson = getLessonById(id);
    const { hearts, loseHeart, completeLesson, learningStyle } = useGameStore();

    const [phase, setPhase] = useState<Phase>("learning");
    const [learningStep, setLearningStep] = useState(0);
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
    const [speech, setSpeech] = useState<string | undefined>("Let's master this!");
    const [isLionHidden, setIsLionHidden] = useState(false);

    // Matching State
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // "left:right"
    const [failedMatch, setFailedMatch] = useState<[string, string] | null>(null);

    useEffect(() => { setWin({ w: window.innerWidth, h: window.innerHeight }); }, []);

    if (!lesson) return <div>Lesson not found</div>;

    const activeContent: LessonContent = useMemo(() => {
        if (!lesson) return { intro: "", sections: [] };
        if (Array.isArray(lesson.content)) {
            return {
                intro: lesson.content[0] || "",
                sections: lesson.content.slice(1).map(b => ({ heading: "Key Concept", body: b }))
            };
        }
        return learningStyle === 'technical' ? lesson.content.technical : lesson.content.simple;
    }, [lesson, learningStyle]);

    const currentQ = lesson.quiz[qi];
    const totalQ = lesson.quiz.length;
    const totalSteps = activeContent.sections.length + 1;

    const handleAnswer = (idx: number) => {
        if (answered) return;
        setSelected(idx);
        playSound("step");
    };

    const checkAnswer = () => {
        if (selected === null || answered) return;
        setAnswered(true);
        const isCorrect = selected === currentQ.correct;
        setCorrect(isCorrect);

        if (isCorrect) {
            playSound("success");
            setCorrectCount(c => c + 1);
            setGuideState('happy');
            setSpeech(HAPPY_PHRASES[Math.floor(Math.random() * HAPPY_PHRASES.length)]);
        } else {
            playSound("error");
            if (hearts > 0) loseHeart();
            setGuideState('sad');
            setSpeech(SAD_PHRASES[Math.floor(Math.random() * SAD_PHRASES.length)]);
        }
    };

    const handleMatch = (val: string, side: 'left' | 'right') => {
        if (answered) return;
        if (side === 'left') {
            if (leftSelected === val) setLeftSelected(null);
            else { setLeftSelected(val); playSound('step'); }
        } else {
            if (rightSelected === val) setRightSelected(null);
            else { setRightSelected(val); playSound('step'); }
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
                playSound("success");
                if (matchedPairs.length + 1 === currentQ.pairs?.length) {
                    setCorrect(true);
                    setAnswered(true);
                    setCorrectCount(c => c + 1);
                    setGuideState('happy');
                    setSpeech("Perfectly matched! 🔗");
                }
            } else {
                setFailedMatch([leftSelected, rightSelected]);
                playSound("error");
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
            setIsLionHidden(true);
            if (score >= 70) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
        }
    };

    const handleNextStep = () => {
        if (learningStep < totalSteps - 1) {
            setLearningStep(s => s + 1);
            playSound("step");
        } else {
            setPhase("quiz");
            playSound("success");
            setSpeech("Time for a quick check!");
        }
    };

    const leftItems = useMemo(() => currentQ?.type === 'match' ? [...(currentQ.pairs || [])].sort(() => Math.random() - 0.5) : [], [qi]);
    const rightItems = useMemo(() => currentQ?.type === 'match' ? [...(currentQ.pairs || [])].sort(() => Math.random() - 0.5) : [], [qi]);

    const progressPct = phase === "learning"
        ? (learningStep / totalSteps) * 50
        : 50 + (qi / totalQ) * 50;

    return (
        <div className="lesson-shell">
            {showConfetti && <Confetti width={win.w} height={win.h} recycle={false} numberOfPieces={280} />}

            <div className="lesson-topbar">
                <button className="btn btn-ghost btn-sm" onClick={() => router.push("/learn")}><X size={20} /></button>
                <div className="lesson-progress-track">
                    <motion.div
                        className="lesson-progress-fill"
                        animate={{ width: `${progressPct}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
                <div className="heart-counter">
                    <Heart size={18} fill="currentColor" color="var(--red)" style={{ opacity: hearts > 0 ? 1 : 0.3 }} />
                    <span className="heart-val">{hearts}</span>
                </div>
            </div>

            <div className="lesson-container">
                {phase === "learning" && (
                    <div className="lesson-body anim-fadein">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={learningStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="learning-card"
                            >
                                {learningStep === 0 ? (
                                    <div className="step-content">
                                        <div className="mode-pill">{learningStyle.toUpperCase()} MODE</div>
                                        <h1 className="step-title">{lesson.title}</h1>
                                        <div className="step-intro-hero">
                                            <div className="hero-emoji">{lesson.emoji}</div>
                                        </div>
                                        <p className="step-text-large">{activeContent.intro}</p>
                                    </div>
                                ) : (
                                    <div className="step-content">
                                        <div className="step-indicator">CONCEPT {learningStep}/{totalSteps - 1}</div>
                                        <h2 className="step-heading">{activeContent.sections[learningStep - 1].heading}</h2>
                                        <p className="step-text-normal">{activeContent.sections[learningStep - 1].body}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {!isLionHidden && (
                            <LionGuide state={guideState} speech={speech} isHidden={isLionHidden} onDismiss={() => setIsLionHidden(true)} />
                        )}

                        <div className="lesson-cta-fixed">
                            <button className="btn-premium btn-full" onClick={handleNextStep}>
                                {learningStep < totalSteps - 1 ? "CONTINUE" : "START QUIZ"}
                            </button>
                        </div>
                    </div>
                )}

                {phase === "quiz" && (
                    <div className="lesson-body anim-fadein">
                        <div className="quiz-header">
                            <h2 className="quiz-question">{currentQ.question}</h2>
                            {!isLionHidden && !answered && (
                                <LionGuide state={guideState} speech={speech} isHidden={isLionHidden} onDismiss={() => setIsLionHidden(true)} />
                            )}
                        </div>

                        {currentQ.type === 'match' ? (
                            <div className="match-grid">
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
                                            <span className="opt-text">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className={`eval-bar ${answered ? (correct ? 'eval-correct' : 'eval-wrong') : ''}`}>
                            <div className="eval-container">
                                {answered ? (
                                    <div className="eval-feedback anim-pop">
                                        <div className="eval-icon">
                                            {correct ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                        </div>
                                        <div className="eval-text">
                                            <div className="eval-title">{correct ? "Excellent!" : "Not quite right"}</div>
                                            <div className="eval-explanation">{currentQ.explanation}</div>
                                        </div>
                                        <button className="btn-eval-next" onClick={handleNext}>CONTINUE</button>
                                    </div>
                                ) : (
                                    <button
                                        className={`btn-check ${selected !== null || currentQ.type === 'match' ? 'active' : ''}`}
                                        disabled={currentQ.type !== 'match' && selected === null}
                                        onClick={currentQ.type === 'match' ? () => { } : checkAnswer}
                                        style={{ display: currentQ.type === 'match' ? 'none' : 'block' }}
                                    >
                                        CHECK
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Final match continue button if matched but not next'd */}
                        {currentQ.type === 'match' && answered && (
                            <div className="eval-bar eval-correct">
                                <div className="eval-container">
                                    <div className="eval-feedback anim-pop">
                                        <div className="eval-icon"><CheckCircle2 size={32} /></div>
                                        <div className="eval-text">
                                            <div className="eval-title">Perfect Match!</div>
                                            <div className="eval-explanation">You've connected all the concepts.</div>
                                        </div>
                                        <button className="btn-eval-next" onClick={handleNext}>CONTINUE</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {phase === "complete" && (
                    <div className="lesson-body completion-wrap anim-fadein">
                        <div className="completion-icon-wrap" style={{ color: 'var(--primary)', marginBottom: 20 }}>
                            {correctCount / totalQ >= 0.7 ? <Trophy size={100} fill="currentColor" /> : <Brain size={100} fill="currentColor" />}
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>Lesson Complete!</h1>
                        <div className="stats-row" style={{ display: 'flex', gap: 16, margin: '24px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div className="stat-box" style={{ flex: 1, minWidth: 140 }}><div className="val">+{xpEarned}</div><div className="lbl">XP EARNED</div></div>
                            <div className="stat-box" style={{ flex: 1, minWidth: 140 }}><div className="val">{Math.round((correctCount / totalQ) * 100)}%</div><div className="lbl">ACCURACY</div></div>
                        </div>
                        <button className="btn-premium" style={{ width: '100%', maxWidth: 300 }} onClick={() => router.push("/learn")}>CONTINUE PATH</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .lesson-shell { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
                .lesson-topbar { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: var(--bg); z-index: 10; }
                .lesson-container { flex: 1; display: flex; flex-direction: column; position: relative; overflow-y: auto; }
                .lesson-body { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px 16px 140px; flex: 1; display: flex; flex-direction: column; }
                .lesson-progress-track { flex: 1; height: 12px; background: var(--border); border-radius: 6px; overflow: hidden; }
                .lesson-progress-fill { height: 100%; background: var(--green); border-radius: 6px; }
                .heart-counter { display: flex; align-items: center; gap: 6px; font-weight: 950; color: var(--red); }
                .heart-val { font-size: 1.1rem; }

                .learning-card { background: var(--bg-card); border-radius: 24px; border: 2px solid var(--border); border-bottom-width: 8px; padding: 24px; margin-bottom: 24px; }
                .mode-pill { display: inline-block; padding: 4px 12px; background: var(--green-bg); color: var(--green); border-radius: 20px; font-weight: 900; font-size: 0.7rem; margin-bottom: 12px; }
                .step-title { font-size: 1.8rem; font-weight: 950; line-height: 1.1; margin-bottom: 20px; }
                .step-intro-hero { height: 120px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 20px; margin-bottom: 24px; }
                .hero-emoji { font-size: 4rem; }
                .step-text-large { font-size: 1.25rem; font-weight: 700; line-height: 1.6; color: var(--text); }
                .step-indicator { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
                .step-heading { font-size: 1.5rem; font-weight: 950; margin-bottom: 16px; color: var(--primary); }
                .step-text-normal { font-size: 1.1rem; font-weight: 600; line-height: 1.6; color: var(--text-secondary); }

                .quiz-header { margin-bottom: 24px; }
                .quiz-question { font-size: 1.4rem; font-weight: 950; margin-bottom: 8px; }
                .quiz-opt { width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid var(--border); border-bottom-width: 6px; background: var(--bg-card); display: flex; gap: 16px; align-items: center; font-weight: 800; text-align: left; cursor: pointer; transition: all 0.1s; margin-bottom: 12px; }
                .quiz-opt:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 4px; }
                .quiz-opt.selected { border-color: var(--primary); background: var(--primary-bg); color: var(--primary-dark); }
                .quiz-opt.correct { border-color: var(--green); background: var(--green-bg); color: var(--green-dark); }
                .quiz-opt.wrong { border-color: var(--red); background: var(--red-bg); color: var(--red-dark); }
                .quiz-opt.disabled { opacity: 0.5; }
                .opt-letter { width: 32px; height: 32px; border: 2px solid currentColor; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 950; flex-shrink: 0; }

                .match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
                .match-btn { padding: 14px; border-radius: 16px; border: 2.5px solid var(--border); background: var(--bg-card); font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 var(--border); }
                .match-btn.selected { border-color: var(--primary); background: var(--primary-bg); color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 0 var(--primary); }
                .match-btn.matched { border-color: var(--green); background: var(--green-bg); color: var(--green); opacity: 0.4; box-shadow: none; transform: none; cursor: default; }
                .match-btn.failed { border-color: var(--red); background: var(--red-bg); color: var(--red); animation: shake 0.3s; }

                .eval-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg); border-top: 2px solid var(--border); padding: 24px 16px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 100; }
                .eval-container { max-width: 600px; margin: 0 auto; }
                .eval-correct { background: var(--green-bg); border-top-color: var(--green); }
                .eval-wrong { background: var(--red-bg); border-top-color: var(--red); }
                .btn-check { width: 100%; padding: 16px; border-radius: 16px; border: none; background: var(--border); color: var(--text-muted); font-weight: 950; font-size: 1rem; cursor: default; transition: all 0.2s; }
                .btn-check.active { background: var(--primary); color: white; cursor: pointer; transform: scale(1.02); box-shadow: 0 6px 0 var(--primary-shadow); }
                .btn-check.active:active { transform: translateY(2px); box-shadow: 0 4px 0 var(--primary-shadow); }
                .eval-feedback { display: flex; align-items: flex-start; gap: 16px; }
                .eval-icon { color: white; padding: 12px; border-radius: 16px; background: currentColor; display: flex; }
                .eval-correct .eval-icon { color: var(--green); }
                .eval-wrong .eval-icon { color: var(--red); }
                .eval-text { flex: 1; }
                .eval-title { font-size: 1.25rem; font-weight: 950; margin-bottom: 4px; }
                .eval-correct .eval-title { color: var(--green-dark); }
                .eval-wrong .eval-title { color: var(--red-dark); }
                .eval-explanation { font-size: 0.85rem; font-weight: 700; opacity: 0.9; line-height: 1.4; color: var(--text); }
                .btn-eval-next { padding: 14px 24px; border-radius: 14px; border: none; font-weight: 950; color: white; cursor: pointer; box-shadow: 0 4px 0 rgba(0,0,0,0.1); white-space: nowrap; margin-left: auto; }
                .eval-correct .btn-eval-next { background: var(--green); }
                .eval-wrong .btn-eval-next { background: var(--red); }

                .lesson-cta-fixed { position: fixed; bottom: 0; left: 0; right: 0; padding: 24px 16px; background: var(--bg); border-top: 2px solid var(--border); z-index: 90; }

                @media (max-width: 480px) {
                    .lesson-body { padding-bottom: 160px; }
                    .eval-feedback { flex-direction: column; }
                    .btn-eval-next { width: 100%; margin-top: 16px; }
                    .step-title { font-size: 1.5rem; }
                    .step-text-large { font-size: 1.1rem; }
                    .match-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

const HAPPY_PHRASES = ["You're unstoppable!", "Brilliant work!", "That's how it's done!", "Marketer of the Year!", "Pure talent! ✨"];
const SAD_PHRASES = ["Don't worry, keep going!", "Mistakes make us grow!", "Learn from this and roar!", "Focus on the data!", "Every lion starts as a cub."];
const IDLE_PHRASES = ["Let's smash this!", "Ready for the next one?", "Focus on the goal!", "SEO is a superpower."];
