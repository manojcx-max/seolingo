import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LessonProgress {
    lessonId: string;
    completed: boolean;
    score: number;
    completedAt?: string;
    xpEarned: number;
}

export interface Achievement {
    id: string;
    title: string;
    desc: string;
    requirement: (state: GameState) => boolean;
}

export interface Quest {
    id: string;
    title: string;
    reward: number; // in gems
    xpReward: number;
    progress: number;
    goal: number;
    completed: boolean;
    claimed: boolean;
}

interface GameState {
    username: string;
    avatar: string;
    profileImage: string | null; // Data URL for uploaded picture
    age: string;
    bio: string;
    goal: "job" | "freelance" | "business" | null;
    xp: number;
    hearts: number;
    maxHearts: number;
    streak: number;
    streakFreezeActive: boolean;
    lastActiveDate: string | null;
    totalXPToday: number;
    dailyGoal: number;
    lessonsCompletedToday: number;
    lessonProgress: Record<string, LessonProgress>;
    gems: number;
    xpBoostUntil: number | null; // Timestamp
    unlockedAvatars: string[];
    achievements: string[]; // Earned achievement IDs
    learningStyle: "simple" | "technical";
    quests: Quest[];
    nextHeartAt: number | null; // Timestamp

    // Sync Architecture
    syncStatus: 'synced' | 'pending' | 'offline';
    lastSyncedAt: string | null;

    // Actions
    setUsername: (n: string) => void;
    setAvatar: (a: string) => void;
    setLearningStyle: (s: "simple" | "technical") => void;
    setProfileImage: (img: string | null) => void;
    setAge: (a: string) => void;
    setBio: (b: string) => void;
    setGoal: (g: "job" | "freelance" | "business") => void;
    completeLesson: (id: string, score: number, xp: number) => void;
    loseHeart: () => void;
    refillHearts: () => void;
    addXP: (n: number) => void;
    checkAndUpdateStreak: () => void;
    purchaseHeartRefill: () => boolean;
    purchaseStreakFreeze: () => boolean;
    purchaseXpBoost: () => boolean;
    purchaseAvatar: (emoji: string, cost: number) => boolean;
    claimQuest: (questId: string) => void;
    checkAchievements: () => void;
    updateProfile: (data: Partial<Pick<GameState, 'username' | 'age' | 'bio' | 'avatar' | 'profileImage'>>) => void;
    checkHearts: () => void;
    syncData: () => Promise<void>;
}

const MOCK_BOARD = [
    { name: "Satoshi N.", xp: 15400, streak: 45, avatar: "🦁" },
    { name: "Ada L.", xp: 12800, streak: 8, avatar: "🐯" },
    { name: "Grace H.", xp: 10700, streak: 21, avatar: "🦊" },
    { name: "Alan T.", xp: 9600, streak: 5, avatar: "🐧" },
    { name: "Linus T.", xp: 8500, streak: 12, avatar: "🦋" },
    { name: "Tim B.", xp: 7200, streak: 3, avatar: "🐉" },
    { name: "Sergey B.", xp: 6100, streak: 7, avatar: "🦚" },
    { name: "User", xp: 0, streak: 0, avatar: "🦁", isYou: true },
];

export const INITIAL_QUESTS: Quest[] = [
    { id: "q1", title: "Morning bird: Complete a lesson before 10 AM", reward: 10, xpReward: 20, progress: 0, goal: 1, completed: false, claimed: false },
    { id: "q2", title: "Perfect practice: Get 100% on any quiz", reward: 20, xpReward: 50, progress: 0, goal: 1, completed: false, claimed: false },
    { id: "q3", title: "XP surge: Earn 100 XP in a single day", reward: 30, xpReward: 100, progress: 0, goal: 100, completed: false, claimed: false },
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_lesson", title: "First Step", desc: "Completed your first lesson", requirement: (s) => Object.keys(s.lessonProgress).length >= 1 },
    { id: "perfect_score", title: "Perfect Aim", desc: "Scored 100% on a lesson quiz", requirement: (s) => Object.values(s.lessonProgress).some(p => p.score === 100) },
    { id: "streak_3", title: "Consistency", desc: "Maintained a 3-day learning streak", requirement: (s) => s.streak >= 3 },
    { id: "level_5", title: "Rising Specialist", desc: "Reached Level 5 in Marketing", requirement: (s) => getLevel(s.xp).level >= 5 },
    { id: "gem_collector", title: "Treasure Hunter", desc: "Accumulated more than 500 gems", requirement: (s) => s.gems >= 500 },
];

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            username: "",
            avatar: "🦁",
            profileImage: null,
            age: "",
            bio: "",
            goal: null,
            xp: 0,
            hearts: 5,
            maxHearts: 5,
            streak: 0,
            streakFreezeActive: false,
            lastActiveDate: null,
            totalXPToday: 0,
            dailyGoal: 3,
            lessonsCompletedToday: 0,
            lessonProgress: {},
            gems: 200,
            xpBoostUntil: null,
            unlockedAvatars: ["🦁", "🐯", "🦊", "🐧", "🦋", "🐉", "🦚"],
            achievements: [],
            learningStyle: "simple",
            quests: INITIAL_QUESTS,
            nextHeartAt: null,

            // Sync Init
            syncStatus: 'synced',
            lastSyncedAt: null,

            setUsername: (n) => set({ username: n, syncStatus: 'pending' }),
            setAvatar: (a) => set({ avatar: a, syncStatus: 'pending' }),
            setLearningStyle: (s) => set({ learningStyle: s, syncStatus: 'pending' }),
            setProfileImage: (img) => set({ profileImage: img, syncStatus: 'pending' }),
            setAge: (a) => set({ age: a, syncStatus: 'pending' }),
            setBio: (b) => set({ bio: b, syncStatus: 'pending' }),
            setGoal: (g) => set({ goal: g, syncStatus: 'pending' }),

            completeLesson: (id, score, lessonXp) => {
                const s = get();
                const today = new Date().toDateString();
                const hour = new Date().getHours();
                const firstTime = !s.lessonProgress[id]?.completed;

                // Handle XP Boost
                const boost = s.xpBoostUntil;
                const isBoosted = boost ? Date.now() < boost : false;
                const baseXP = firstTime ? lessonXp : Math.floor(lessonXp * 0.5);
                const earnedXP = isBoosted ? baseXP * 2 : baseXP;

                const gemBonus = score === 100 ? 15 : score >= 80 ? 5 : 0;

                // Update Quests
                const updatedQuests = s.quests.map(q => {
                    if (q.id === "q1" && hour < 10 && !q.completed) return { ...q, progress: 1, completed: true };
                    if (q.id === "q2" && score === 100 && !q.completed) return { ...q, progress: 1, completed: true };
                    if (q.id === "q3" && !q.completed) {
                        const newProg = Math.min(q.goal, q.progress + earnedXP);
                        return { ...q, progress: newProg, completed: newProg >= q.goal };
                    }
                    return q;
                });

                set(st => ({
                    xp: st.xp + earnedXP,
                    totalXPToday: st.totalXPToday + earnedXP,
                    lessonsCompletedToday: st.lessonsCompletedToday + 1,
                    gems: st.gems + gemBonus,
                    lastActiveDate: today,
                    quests: updatedQuests,
                    syncStatus: 'pending',
                    lessonProgress: {
                        ...st.lessonProgress,
                        [id]: { lessonId: id, completed: true, score, completedAt: new Date().toISOString(), xpEarned: earnedXP },
                    },
                }));

                get().checkAndUpdateStreak();
                get().checkAchievements();
            },

            loseHeart: () => set(s => {
                const now = Date.now();
                const nextHeart = s.nextHeartAt || now + 15 * 60 * 1000;
                return {
                    hearts: Math.max(0, s.hearts - 1),
                    nextHeartAt: s.hearts === s.maxHearts ? now + 15 * 60 * 1000 : nextHeart,
                    syncStatus: 'pending'
                };
            }),
            refillHearts: () => set(s => ({ hearts: s.maxHearts, nextHeartAt: null, syncStatus: 'pending' })),
            addXP: (n) => {
                const boost = get().xpBoostUntil;
                const isBoosted = boost ? Date.now() < boost : false;
                const amount = isBoosted ? n * 2 : n;
                set(s => ({ xp: s.xp + amount, totalXPToday: s.totalXPToday + amount, syncStatus: 'pending' }));
            },

            checkAndUpdateStreak: () => {
                const s = get();
                const today = new Date().toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                if (s.lastActiveDate === today) return;

                if (s.lastActiveDate === yesterday) {
                    set({ streak: s.streak + 1, syncStatus: 'pending' });
                } else if (s.lastActiveDate !== null) {
                    if (s.streakFreezeActive) {
                        set({ streakFreezeActive: false, syncStatus: 'pending' });
                    } else {
                        set({ streak: 1, syncStatus: 'pending' });
                    }
                } else {
                    set({ streak: 1, syncStatus: 'pending' });
                }

                // Refresh Quests if it's a new day
                if (s.lastActiveDate !== today) {
                    set({
                        hearts: 5,
                        totalXPToday: 0,
                        lessonsCompletedToday: 0,
                        quests: INITIAL_QUESTS, // Reset quests daily
                        syncStatus: 'pending'
                    });
                }
            },

            purchaseHeartRefill: () => {
                const s = get();
                if (s.gems >= 50) { set(st => ({ gems: st.gems - 50, hearts: st.maxHearts, syncStatus: 'pending' })); return true; }
                return false;
            },

            purchaseStreakFreeze: () => {
                const s = get();
                if (s.gems >= 150) { set(st => ({ gems: st.gems - 150, streakFreezeActive: true, syncStatus: 'pending' })); return true; }
                return false;
            },

            purchaseXpBoost: () => {
                const s = get();
                if (s.gems >= 200) {
                    set(st => ({
                        gems: st.gems - 200,
                        xpBoostUntil: Date.now() + 15 * 60 * 1000, // 15 mins
                        syncStatus: 'pending'
                    }));
                    return true;
                }
                return false;
            },

            purchaseAvatar: (emoji, cost) => {
                const s = get();
                if (s.gems >= cost && !s.unlockedAvatars.includes(emoji)) {
                    set(st => ({
                        gems: st.gems - cost,
                        unlockedAvatars: [...st.unlockedAvatars, emoji],
                        syncStatus: 'pending'
                    }));
                    return true;
                }
                return false;
            },

            claimQuest: (id) => {
                const s = get();
                const q = s.quests.find(x => x.id === id);
                if (q && q.completed && !q.claimed) {
                    set(st => ({
                        gems: st.gems + q.reward,
                        xp: st.xp + q.xpReward,
                        quests: st.quests.map(x => x.id === id ? { ...x, claimed: true } : x),
                        syncStatus: 'pending'
                    }));
                    get().checkAchievements();
                }
            },

            checkAchievements: () => {
                const s = get();
                const newlyEarned: string[] = [];
                ACHIEVEMENTS.forEach(a => {
                    if (!s.achievements.includes(a.id) && a.requirement(s)) {
                        newlyEarned.push(a.id);
                    }
                });
                if (newlyEarned.length > 0) {
                    set(st => ({ achievements: [...st.achievements, ...newlyEarned] }));
                }
            },

            updateProfile: (data) => set(s => ({ ...s, ...data, syncStatus: 'pending' })),

            checkHearts: () => {
                const s = get();
                if (s.hearts >= s.maxHearts) return;
                const now = Date.now();
                if (s.nextHeartAt && now >= s.nextHeartAt) {
                    const elapsed = now - s.nextHeartAt;
                    const restored = 1 + Math.floor(elapsed / (15 * 60 * 1000));
                    const newHearts = Math.min(s.maxHearts, s.hearts + restored);
                    const next = newHearts < s.maxHearts ? s.nextHeartAt + restored * (15 * 60 * 1000) : null;
                    set({ hearts: newHearts, nextHeartAt: next });
                }
            },

            syncData: async () => {
                if (typeof window !== 'undefined' && !window.navigator.onLine) {
                    set({ syncStatus: 'offline' });
                    return;
                }

                set({ syncStatus: 'pending' });

                // MOCK SYNC: Simulation of API call to Firebase/Supabase
                await new Promise(resolve => setTimeout(resolve, 2000));

                set({
                    syncStatus: 'synced',
                    lastSyncedAt: new Date().toISOString()
                });
                console.log("☁️ Cloud Sync Complete");
            }
        }),
        { name: "seolingo-v3" }
    )
);

export function getLeaderboard(userXP: number, username: string) {
    const s = useGameStore.getState();
    const you = { name: username || "You", xp: userXP, streak: s.streak, avatar: s.avatar, isYou: true };
    const combined = [...MOCK_BOARD.filter(m => !m.isYou), you].sort((a, b) => b.xp - a.xp);
    return combined.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function getLevel(xp: number) {
    const levels = [
        { xp: 0, title: "Intern" },
        { xp: 200, title: "Specialist" },
        { xp: 500, title: "Strategist" },
        { xp: 1000, title: "Manager" },
        { xp: 2000, title: "Director" },
        { xp: 3500, title: "Expert" },
        { xp: 5500, title: "Master" },
        { xp: 8000, title: "Global Authority" },
    ];
    let cur = 0;
    for (let i = 0; i < levels.length; i++) if (xp >= levels[i].xp) cur = i;
    const next = levels[Math.min(cur + 1, levels.length - 1)];
    const curXP = levels[cur].xp;
    const prog = cur === levels.length - 1 ? 100 : Math.round(((xp - curXP) / (next.xp - curXP)) * 100);
    return { level: cur + 1, title: levels[cur].title, nextXP: next.xp, progress: prog, isMax: cur === levels.length - 1 };
}
