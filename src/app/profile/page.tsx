"use client";
import { useGameStore, getLevel, ACHIEVEMENTS } from "@/store/gameStore";
import { useTheme } from "@/components/AppShell";
import { useEffect, useState, useRef } from "react";

export default function ProfilePage() {
    const {
        xp, streak, username, avatar, profileImage, age, bio, learningStyle,
        lessonProgress, achievements, unlockedAvatars,
        updateProfile, setLearningStyle
    } = useGameStore();
    const { level, title, progress, nextXP } = getLevel(xp);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        username, age, bio, avatar, profileImage, learningStyle
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const lessonCount = Object.keys(lessonProgress).length;
    const perfectCount = Object.values(lessonProgress).filter(p => p.score === 100).length;

    const handleSave = () => {
        updateProfile(editData);
        setLearningStyle(editData.learningStyle);
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, profileImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="anim-fadein">
            {/* Profile Hero */}
            {/* Profile Hero */}
            <div className="card hero-section" style={{ marginBottom: 24, padding: 32 }}>
                <div className="profile-top">
                    <div className="avatar-container" onClick={() => isEditing && fileInputRef.current?.click()}>
                        <div className="avatar-main">
                            {isEditing ? (
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    {editData.profileImage ? <img src={editData.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : editData.avatar}
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white', fontWeight: 900 }}>UPLOAD</div>
                                </div>
                            ) : (
                                profileImage ? <img src={profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : avatar
                            )}
                        </div>
                        <div className="level-badge">{level}</div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="profile-details" style={{ flex: 1 }}>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="edit-field">
                                    <label>Username</label>
                                    <input
                                        className="ob-input"
                                        value={editData.username}
                                        onChange={e => setEditData({ ...editData, username: e.target.value })}
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Age / Wisdom</label>
                                    <input
                                        className="ob-input"
                                        value={editData.age}
                                        onChange={e => setEditData({ ...editData, age: e.target.value })}
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Bio</label>
                                    <textarea
                                        className="ob-input"
                                        value={editData.bio}
                                        onChange={e => setEditData({ ...editData, bio: e.target.value })}
                                        placeholder="Boring bio? Never! Tell us your superpower."
                                        style={{ minHeight: 80 }}
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Learning Mode</label>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        {['simple', 'technical'].map(s => (
                                            <button
                                                key={s}
                                                className={`btn btn-sm ${editData.learningStyle === s ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ flex: 1, textTransform: 'capitalize' }}
                                                onClick={() => setEditData({ ...editData, learningStyle: s as 'simple' | 'technical' })}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                    <button className="btn btn-primary btn-full" onClick={handleSave}>💾 SAVE CHANGES</button>
                                    <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h1 className="username">{username}</h1>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                        <div className="rank-pill">{title}</div>
                                        <div className="age-pill">Level {age} Wisdom</div>
                                        <div style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: '0.75rem', border: '1px solid var(--border)' }}>{learningStyle.toUpperCase()} MODE</div>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6 }}>
                                        {bio || "This legend hasn't written a bio yet. Too busy ranking #1!"}
                                    </p>
                                </div>
                                <button className="btn btn-ghost btn-sm" style={{ borderRadius: 12 }} onClick={() => setIsEditing(true)}>⚙️ EDIT</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="xp-progress-section">
                    <div className="xp-text">
                        <span>Level Progress</span>
                        <span>{xp} / {nextXP} XP</span>
                    </div>
                    <div className="progress-bar-large">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: 32 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: 'var(--orange)' }}>🔥</div>
                    <div className="stat-value">{streak}</div>
                    <div className="stat-name">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: 'var(--purple)' }}>⚡</div>
                    <div className="stat-value">{xp}</div>
                    <div className="stat-name">Total XP</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: 'var(--green)' }}>📚</div>
                    <div className="stat-value">{lessonCount}</div>
                    <div className="stat-name">Lessons</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: 'var(--red)' }}>🎯</div>
                    <div className="stat-value">{perfectCount}</div>
                    <div className="stat-name">Perfects</div>
                </div>
            </div>

            {/* Badges Section */}
            <div className="section-title">Achievements</div>
            <div className="badge-grid" style={{ marginBottom: 40 }}>
                {ACHIEVEMENTS.map(a => {
                    const earned = achievements.includes(a.id);
                    return (
                        <div key={a.id} className={`badge-item ${earned ? 'earned' : 'locked'}`}>
                            <div className="badge-icon-wrap">
                                <span className="badge-icon">{earned ? "🏆" : "🔒"}</span>
                            </div>
                            <div className="badge-name">{a.title}</div>
                            <div className="badge-desc">{earned ? a.desc : "Locked"}</div>
                        </div>
                    );
                })}
            </div>

            {/* Avatar Switcher */}
            {!isEditing && (
                <>
                    <div className="section-title">Unlocked Avatars</div>
                    <div className="avatar-switcher">
                        {unlockedAvatars.map(a => (
                            <button
                                key={a}
                                className={`avatar-opt ${avatar === a && !profileImage ? 'active' : ''}`}
                                onClick={() => {
                                    updateProfile({ avatar: a, profileImage: null });
                                }}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <style jsx>{`
                .hero-section {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .profile-top {
                    display: flex;
                    align-items: flex-start;
                    gap: 24px;
                }
                .avatar-container {
                    position: relative;
                    cursor: pointer;
                }
                .avatar-main {
                    width: 100px;
                    height: 100px;
                    background: var(--bg-secondary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-md);
                    overflow: hidden;
                }
                .level-badge {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: var(--purple);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 950;
                    font-size: 0.85rem;
                    border: 2px solid var(--bg-card);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .username {
                    font-size: 1.75rem;
                    font-weight: 900;
                    margin-bottom: 8px;
                }
                .rank-pill {
                    background: var(--green-bg);
                    color: var(--green);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.8rem;
                }
                .age-pill {
                    background: var(--purple-bg);
                    color: var(--purple);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.8rem;
                }
                .xp-progress-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .xp-text {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 800;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }
                .progress-bar-large {
                    height: 14px;
                    background: var(--border);
                    border-radius: 7px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--purple);
                    border-radius: 7px;
                    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                .stat-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    padding: 24px;
                    text-align: center;
                    box-shadow: var(--shadow-sm);
                    transition: all 0.2s;
                }
                .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
                .stat-icon {
                    font-size: 1.5rem;
                    margin-bottom: 12px;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 900;
                    margin-bottom: 4px;
                }
                .stat-name {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 900;
                    margin-bottom: 20px;
                }
                .badge-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 16px;
                }
                .badge-item {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    padding: 24px;
                    text-align: center;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: var(--shadow-sm);
                }
                .badge-item.earned {
                    border-color: var(--purple);
                    background: linear-gradient(to bottom, var(--bg-card), var(--purple-bg));
                    box-shadow: 0 10px 20px rgba(206, 130, 255, 0.1);
                }
                .badge-item.earned:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(206, 130, 255, 0.2); }
                .badge-item.locked {
                    opacity: 0.5;
                    filter: grayscale(1);
                    box-shadow: none;
                }
                .badge-icon-wrap {
                    margin-bottom: 12px;
                }
                .badge-icon {
                    font-size: 2rem;
                }
                .badge-name {
                    font-weight: 900;
                    font-size: 1rem;
                    margin-bottom: 4px;
                }
                .badge-desc {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .avatar-switcher {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .avatar-opt {
                    width: 60px;
                    height: 60px;
                    background: var(--bg-card);
                    border: 2px solid var(--border);
                    border-radius: 16px;
                    font-size: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .avatar-opt:hover { transform: scale(1.1); border-color: var(--green); }
                .avatar-opt.active {
                    border-color: var(--green);
                    background: var(--green-bg);
                    transform: scale(1.15);
                    box-shadow: 0 8px 20px rgba(88, 204, 2, 0.2);
                }
            `}</style>
        </div>
    );
}
