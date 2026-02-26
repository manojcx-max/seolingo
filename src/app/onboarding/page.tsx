"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Briefcase, Monitor, Rocket, Compass, BarChart3, Camera, Flame, Zap, Trophy, ChevronRight, Layout } from "lucide-react";

const GOALS = [
    { id: "job", icon: <Briefcase size={24} />, title: "Get a Job in Digital Marketing", sub: "Launch a career as a professional marketer or SEO specialist" },
    { id: "freelance", icon: <Layout size={24} />, title: "Start Freelancing", sub: "Build a high-income service business helping global clients" },
    { id: "business", icon: <Rocket size={24} />, title: "Grow My Own Business", sub: "Scale your revenue, rank on Google, and run performance ads" },
] as const;

const STYLES = [
    { id: "simple", icon: <Compass size={32} />, title: "Safari Mode", sub: "Clear, fun, and jargon-free. Perfect for cub-level beginners." },
    { id: "technical", icon: <BarChart3 size={32} />, title: "Roar Mode", sub: "Deep technical details, industry specs, and alpha-level marketing." },
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
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, background: "var(--lion-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: '-0.5px' }}>RoarRank</div>
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
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 20, fontWeight: 500 }}>Pick your path to digital immortality.</p>
                        <div className="goal-list-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {GOALS.map(g => (
                                <div key={g.id} className={`goal-card card-gamified${goal === g.id ? " selected" : ""}`} onClick={() => setGoalLocal(g.id)} style={{ borderBottomWidth: goal === g.id ? 8 : 4 }}>
                                    <div className="goal-card-icon" style={{ color: goal === g.id ? 'var(--primary)' : 'var(--text-muted)' }}>{g.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="goal-card-title" style={{ fontSize: '1.05rem', fontWeight: 950 }}>{g.title}</div>
                                        <div className="goal-card-sub" style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>{g.sub}</div>
                                    </div>
                                    {goal === g.id && <span style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 950 }}>🐾</span>}
                                </div>
                            ))}
                        </div>
                        <button className="btn-premium" style={{ width: '100%', marginTop: 20 }} disabled={!goal} onClick={() => setStep(2)}>
                            I'M READY FOR SUCCESS!
                        </button>
                    </div>
                )}

                {/* ── Step 2: Learning Style ── */}
                {step === 2 && (
                    <div className="anim-fadein">
                        <h2 style={{ marginBottom: 6, fontSize: '1.5rem', fontWeight: 900 }}>Choose your training style 🧪</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 20, fontWeight: 500 }}>How do you want us to deliver the knowledge?</p>
                        <div className="goal-list-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {STYLES.map(s => (
                                <div key={s.id} className={`goal-card card-gamified${style === s.id ? " selected" : ""}`} onClick={() => setStyleLocal(s.id)} style={{ borderBottomWidth: style === s.id ? 8 : 4 }}>
                                    <div style={{ color: style === s.id ? 'var(--primary)' : 'var(--text-muted)' }}>{s.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="goal-card-title" style={{ fontSize: '1.05rem', fontWeight: 950 }}>{s.title}</div>
                                        <div className="goal-card-sub" style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>{s.sub}</div>
                                    </div>
                                    {style === s.id && <ChevronRight size={24} color="var(--primary)" />}
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

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontWeight: 800, fontSize: "0.8rem", marginBottom: 8, textTransform: 'uppercase', color: 'var(--text-muted)' }}>The Legend's Name</label>
                            <input
                                className="ob-input"
                                placeholder="e.g. SEO_Slayer_9000"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={20}
                                autoFocus
                                style={{ width: '100%', padding: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontWeight: 800, fontSize: "0.8rem", marginBottom: 8, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Wisdom Level (Age)</label>
                            <input
                                className="ob-input"
                                type="number"
                                placeholder="25"
                                value={age}
                                onChange={e => setAgeLocal(e.target.value)}
                                style={{ width: '100%', padding: '14px' }}
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

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                            <div
                                style={{ width: 100, height: 100, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', overflow: 'hidden', border: '4px solid var(--green)', position: 'relative', cursor: 'pointer' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {profileImg ? <img src={profileImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatar}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 0' }}>CHANGE</div>
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
                        <div style={{ fontSize: "4rem", marginBottom: 16, animation: 'pop 0.5s ease' }}>{profileImg ? <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--green)', margin: '0 auto' }}><img src={profileImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div> : avatar}</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>"{randomQuote}"</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "8px 0 20px", fontWeight: 500 }}>
                            You're all set, {name}! Your human age of {age} is perfect for mastering marketing with your {style} style.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                            {[
                                { icon: <Flame size={18} />, text: "Commit to your daily streak", color: 'var(--orange)' },
                                { icon: <Zap size={18} />, text: "Stack up that global XP", color: 'var(--purple)' },
                                { icon: <Trophy size={18} />, text: "Rise to number one", color: 'var(--blue)' },
                            ].map(f => (
                                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "var(--bg-secondary)", borderRadius: "14px", textAlign: "left" }}>
                                    <span style={{ color: f.color }}>{f.icon}</span>
                                    <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>{f.text}</span>
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


export function IconBriefcase() { return <Briefcase size={24} />; }
