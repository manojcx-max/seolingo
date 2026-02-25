"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

const GOALS = [
    { id: "job", icon: <IconBriefcase />, title: "Get a Job in Digital Marketing", sub: "Launch a career as a professional marketer or SEO specialist" },
    { id: "freelance", icon: <IconMonitor />, title: "Start Freelancing", sub: "Build a high-income service business helping global clients" },
    { id: "business", icon: <IconRocket />, title: "Grow My Own Business", sub: "Scale your revenue, rank on Google, and run performance ads" },
] as const;

const STYLES = [
    { id: "simple", icon: "🍦", title: "Keep it Simple", sub: "Explain like I'm five. Clear, fun, and jargon-free." },
    { id: "technical", icon: "🛠️", title: "Deep Dive", sub: "Give me the technical details, industry terms, and advanced specs." },
] as const;

const MOTIVATION_QUOTES = [
    "You're about to become a marketing legend!",
    "The world is waiting for your digital magic.",
    "SEO is just a puzzle, and you're the master.",
    "Let's turn those clicks into customers!",
    "Google hasn't seen anyone like you yet!",
];

export default function OnboardingPage() {
    const router = useRouter();
    const { setUsername, setGoal, setAvatar, setAge, setBio, setProfileImage, setLearningStyle } = useGameStore();
    const [step, setStep] = useState(1);
    const [goal, setGoalLocal] = useState<typeof GOALS[number]["id"] | "">("");
    const [style, setStyleLocal] = useState<"simple" | "technical">("simple");
    const [name, setName] = useState("");
    const [age, setAgeLocal] = useState("");
    const [avatar, setAvatarLocal] = useState("🦁");
    const [profileImg, setProfileImgLocal] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImgLocal(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStart = () => {
        setUsername(name.trim() || "Legendary Learner");
        setGoal(goal as "job" | "freelance" | "business");
        setAvatar(avatar);
        setAge(age);
        setLearningStyle(style);
        setProfileImage(profileImg);
        useGameStore.setState({ streak: 1, lastActiveDate: new Date().toDateString() });
        router.push("/");
    };

    const randomQuote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];

    return (
        <div className="ob-shell">
            <div className="ob-card anim-fadein">
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, background: "linear-gradient(135deg, #58CC02, #00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: '-0.5px' }}>SEOlingo</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4, fontWeight: 600 }}>Master Digital Marketing & SEO</div>
                </div>

                {/* Step dots */}
                <div className="ob-dots" style={{ marginBottom: 32 }}>
                    {[1, 2, 3, 4, 5].map(s => <div key={s} className={`ob-dot${step === s ? " active" : ""}`} />)}
                </div>

                {/* ── Step 1: Goal ── */}
                {step === 1 && (
                    <div className="anim-fadein">
                        <h2 style={{ marginBottom: 6, fontSize: '1.5rem', fontWeight: 900 }}>What is your grand mission? 🚀</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, fontWeight: 500 }}>Pick your path to digital immortality.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {GOALS.map(g => (
                                <div key={g.id} className={`goal-card${goal === g.id ? " selected" : ""}`} onClick={() => setGoalLocal(g.id)} style={{ padding: '16px 20px' }}>
                                    <div className="goal-card-icon" style={{ color: goal === g.id ? 'var(--green)' : 'var(--text-muted)' }}>{g.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="goal-card-title" style={{ fontSize: '1rem', fontWeight: 800 }}>{g.title}</div>
                                        <div className="goal-card-sub" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{g.sub}</div>
                                    </div>
                                    {goal === g.id && <span style={{ color: 'var(--green)', fontSize: '1.2rem' }}>✓</span>}
                                </div>
                            ))}
                        </div>
                        <button className="btn-premium" style={{ width: '100%', marginTop: 28 }} disabled={!goal} onClick={() => setStep(2)}>
                            I'M READY FOR SUCCESS!
                        </button>
                    </div>
                )}

                {/* ── Step 2: Learning Style ── */}
                {step === 2 && (
                    <div className="anim-fadein">
                        <h2 style={{ marginBottom: 6, fontSize: '1.5rem', fontWeight: 900 }}>Choose your training style 🧪</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, fontWeight: 500 }}>How do you want us to deliver the knowledge?</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {STYLES.map(s => (
                                <div key={s.id} className={`goal-card${style === s.id ? " selected" : ""}`} onClick={() => setStyleLocal(s.id)} style={{ padding: '16px 20px' }}>
                                    <div style={{ fontSize: '2rem', width: 44 }}>{s.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="goal-card-title" style={{ fontSize: '1rem', fontWeight: 800 }}>{s.title}</div>
                                        <div className="goal-card-sub" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{s.sub}</div>
                                    </div>
                                    {style === s.id && <span style={{ color: 'var(--green)', fontSize: '1.2rem' }}>✓</span>}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ fontWeight: 800 }}>Back</button>
                            <button className="btn-premium" style={{ flex: 1 }} onClick={() => setStep(3)}>
                                PERFECT STYLE!
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Funny Username + Age ── */}
                {step === 3 && (
                    <div className="anim-fadein">
                        <h2 style={{ marginBottom: 6, fontSize: '1.5rem', fontWeight: 900 }}>Who shall we address as "Le Legend"? 👑</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, fontWeight: 500 }}>Give us your coolest username and your wisdom level (age).</p>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontWeight: 800, fontSize: "0.8rem", marginBottom: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>The Legend's Name</label>
                            <input
                                className="ob-input"
                                placeholder="e.g. SEO_Slayer_9000"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={20}
                                autoFocus
                                style={{ width: '100%', padding: '16px' }}
                            />
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontWeight: 800, fontSize: "0.8rem", marginBottom: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Years of Human Experience (Age)</label>
                            <input
                                className="ob-input"
                                type="number"
                                placeholder="25"
                                value={age}
                                onChange={e => setAgeLocal(e.target.value)}
                                style={{ width: '100%', padding: '16px' }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ fontWeight: 800 }}>Back</button>
                            <button className="btn-premium" style={{ flex: 1 }} disabled={!name.trim() || !age} onClick={() => setStep(4)}>
                                NEXT LEVEL!
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Profile Picture Upload ── */}
                {step === 4 && (
                    <div className="anim-fadein" style={{ textAlign: "center" }}>
                        <h2 style={{ marginBottom: 6, fontSize: '1.5rem', fontWeight: 900 }}>Let's see that beautiful face! 📸</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 32, fontWeight: 500 }}>Upload a picture or keep the mighty lion.</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
                            <div
                                style={{ width: 120, height: 120, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', overflow: 'hidden', border: '4px solid var(--green)', position: 'relative', cursor: 'pointer' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {profileImg ? <img src={profileImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatar}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '4px 0' }}>CHANGE</div>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(3)} style={{ fontWeight: 800 }}>Back</button>
                            <button className="btn-premium" style={{ flex: 1 }} onClick={() => setStep(5)}>
                                LOOKS SHARP!
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 5: Final Motivation ── */}
                {step === 5 && (
                    <div className="anim-fadein" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "5rem", marginBottom: 20, animation: 'pop 0.5s ease' }}>{profileImg ? <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--green)', margin: '0 auto' }}><img src={profileImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div> : avatar}</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>"{randomQuote}"</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "12px 0 32px", fontWeight: 500 }}>
                            You're all set, {name}! Your human age of {age} is perfect for conquering the web with your {style} style.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                            {[
                                { icon: <IconFlame />, text: "Commit to your daily streak", color: 'var(--orange)' },
                                { icon: <IconBolt />, text: "Stack up that global XP", color: 'var(--purple)' },
                                { icon: <IconTrophy />, text: "Rise to number one", color: 'var(--blue)' },
                            ].map(f => (
                                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", background: "var(--bg-secondary)", borderRadius: "16px", textAlign: "left" }}>
                                    <span style={{ color: f.color }}>{f.icon}</span>
                                    <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>{f.text}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(4)} style={{ fontWeight: 800 }}>Back</button>
                            <button className="btn-premium" style={{ flex: 1 }} onClick={handleStart}>
                                LET'S GOOOOO! 🚀
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .ob-dots { display: flex; justify-content: center; gap: 10px; }
                .ob-dot { width: 10px; height: 10px; border-radius: 5px; background: var(--border); transition: all 0.3s; }
                .ob-dot.active { width: 30px; background: var(--green); }
                .goal-card-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
            `}</style>
        </div>
    );
}

function IconBriefcase() { return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>; }
function IconMonitor() { return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>; }
function IconRocket() { return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" /><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" /></svg>; }
function IconFlame() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.435-4.52.316-5.603.1-.145.362-.07.362.103a8.8 8.8 0 0 1 0 4c1 0 2 1 2.5 2s.4 3-1.5 5.5" /></svg>; }
function IconBolt() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z" /></svg>; }
function IconTrophy() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>; }
