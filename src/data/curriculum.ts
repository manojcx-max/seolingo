export interface Question {
    question: string;
    options: string[];
    answer?: number; // back-compat
    correct?: number;
    type?: 'multiple' | 'match';
    pairs?: { left: string; right: string }[];
    explanation?: string;
}

export interface LessonContent {
    intro: string;
    sections: { heading: string; body: string }[];
}

export interface Lesson {
    id: string;
    title: string;
    emoji: string;
    minutes: number;
    xp: number;
    content: string[] | { simple: LessonContent; technical: LessonContent };
    quiz: Question[];
}

export interface Unit {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Phase {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    color: string;
    units: Unit[];
}

export const curriculum: Phase[] = [
    {
        id: "phase-1",
        title: "Phase 1: Technical SEO Architect",
        subtitle: "Master the infrastructure and mechanics of search engine optimization.",
        emoji: "🏗️",
        color: "#1cb0f6",
        units: [
            {
                id: "u1.1",
                title: "Crawl Engineering & Rendering",
                lessons: [
                    {
                        id: "1.1.1",
                        title: "The Rendering Path",
                        emoji: "🌐",
                        minutes: 15,
                        xp: 250,
                        content: [
                            "Understanding how Googlebot sees JavaScript vs HTML.",
                            "The 'Two-Wave' Indexing process and why it matters for JS-heavy sites.",
                            "Server-Side Rendering (SSR) vs Static Site Generation (SSG) for SEO.",
                            "Identifying hydration issues using Chrome DevTools."
                        ],
                        quiz: [
                            {
                                question: "What is the primary risk of relying solely on Client-Side Rendering (CSR) for SEO?",
                                options: [
                                    "Google might miss content that only appears after execution",
                                    "It makes the server too slow",
                                    "It reduces the security of the application"
                                ],
                                answer: 0
                            }
                        ]
                    },
                    {
                        id: "1.1.2",
                        title: "Crawl Budget Optimization",
                        emoji: "📉",
                        minutes: 12,
                        xp: 200,
                        content: [
                            "How Google determines Crawl Capacity vs Crawl Demand.",
                            "Fixing 'Spider Traps' (infinite URL loops).",
                            "Using robots.txt to prioritize high-value pages."
                        ],
                        quiz: [
                            {
                                question: "Which of these is most likely to waste your crawl budget?",
                                options: [
                                    "Faceted navigation with infinite filter combinations",
                                    "Having high-quality images",
                                    "Writing long-form content"
                                ],
                                answer: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: "u1.2",
                title: "Indexation & Protocols",
                lessons: [
                    {
                        id: "1.2.1",
                        title: "Canonicalization Masterclass",
                        emoji: "🔗",
                        minutes: 10,
                        xp: 150,
                        content: [
                            "Managing parameters and duplicate content signals.",
                            "Cross-domain canonicals and consolidation strategies.",
                            "The signals Google uses to ignore your canonical tag."
                        ],
                        quiz: [
                            {
                                question: "If Page A canonicals to Page B, but Page B links to Page A as a primary menu item, what might happen?",
                                options: [
                                    "Google might ignore the canonical due to conflicting signals",
                                    "Page B will rank higher automatically",
                                    "The site will get a manual penalty"
                                ],
                                answer: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "phase-2",
        title: "Phase 2: Semantic & Entity SEO",
        subtitle: "Moving beyond keywords to topics and Knowledge Graphs.",
        emoji: "🧠",
        color: "#58cc02",
        units: [
            {
                id: "u2.1",
                title: "Knowledge Engineering",
                lessons: [
                    {
                        id: "2.1.1",
                        title: "Entity Extraction & NLP",
                        emoji: "🧪",
                        minutes: 15,
                        xp: 300,
                        content: [
                            "How Google uses Natural Language Processing to identify entities.",
                            "Salience, Confidence scores, and Entity relationships.",
                            "Using the Google Cloud NLP API to test your content."
                        ],
                        quiz: [
                            {
                                question: "In Semantic SEO, what is an 'Entity'?",
                                options: [
                                    "A keyword with high volume",
                                    "A uniquely identifiable thing or concept",
                                    "A backlink from a high authority site"
                                ],
                                answer: 1
                            }
                        ]
                    }
                ]
            },
            {
                id: "u2.2",
                title: "Linked Data & Schema",
                lessons: [
                    {
                        id: "2.2.1",
                        title: "Advanced Schema Graphing",
                        emoji: "🕸️",
                        minutes: 20,
                        xp: 400,
                        content: [
                            "Building item-id relationships in JSON-LD.",
                            "Connecting Organization, Author, and Article nodes.",
                            "Schema for Product variants and aggregate ratings."
                        ],
                        quiz: [
                            {
                                question: "Why should you use @id in your JSON-LD Schema?",
                                options: [
                                    "To make the code shorter",
                                    "To create an unambiguous reference to an entity that can be linked across nodes",
                                    "To prevent others from copying your code"
                                ],
                                answer: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "phase-3",
        title: "Phase 3: Data-Driven Search Performance",
        subtitle: "Measuring what matters with Python, SQL, and GSC.",
        emoji: "📊",
        color: "#ff9600",
        units: [
            {
                id: "u3.1",
                title: "Search Console Mastery",
                lessons: [
                    {
                        id: "3.1.1",
                        title: "GSC Data Mining",
                        emoji: "⛏️",
                        minutes: 18,
                        xp: 350,
                        content: [
                            "Exporting data beyond the 1,000 row UI limit.",
                            "Identifying keyword cannibalization through CTR anomalies.",
                            "Analyzing regex patterns in GSC performance reports."
                        ],
                        quiz: [
                            {
                                question: "What is an indicator of keyword cannibalization in GSC?",
                                options: [
                                    "Multiple URLs ranking for the same query with fluctuating positions",
                                    "A sudden drop in impressions for the whole site",
                                    "High bounce rate on the homepage"
                                ],
                                answer: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: "u3.2",
                title: "Automation for SEOs",
                lessons: [
                    {
                        id: "3.2.1",
                        title: "Intro to Python for SEO",
                        emoji: "🐍",
                        minutes: 25,
                        xp: 500,
                        content: [
                            "Automating meta description generation with OpenAI API.",
                            "Bulk checking status codes for 100k+ URLs.",
                            "Mapping sitemaps to GSC data using Pandas."
                        ],
                        quiz: [
                            {
                                question: "Which Python library is most commonly used for data manipulation in SEO projects?",
                                options: ["Requests", "Pandas", "PyQt"],
                                answer: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "phase-4",
        title: "Phase 4: Content Engineering & AI Strategy",
        subtitle: "Topical authority and AI-assisted growth.",
        emoji: "🖋️",
        color: "#ce82ff",
        units: [
            {
                id: "u4.1",
                title: "Topical Authority",
                lessons: [
                    {
                        id: "4.1.1",
                        title: "Semantic Content Clusters",
                        emoji: "🛰️",
                        minutes: 15,
                        xp: 300,
                        content: [
                            "Designing Pillar pages and Cluster content.",
                            "Internal linking for authority flow.",
                            "Identifying content gaps vs your competitors."
                        ],
                        quiz: [
                            {
                                question: "What is the primary goal of a Content Cluster?",
                                options: [
                                    "To rank for as many keywords as possible",
                                    "To demonstrate deep topical authority to search engines",
                                    "To increase the number of pages on the site"
                                ],
                                answer: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "phase-5",
        title: "Phase 5: Digital PR & Link Engineering",
        subtitle: "High-authority link building and reputation.",
        emoji: "🔗",
        color: "#ff4b4b",
        units: [
            {
                id: "u5.1",
                title: "Link Strategy",
                lessons: [
                    {
                        id: "5.1.1",
                        title: "E-E-A-T Engineering",
                        emoji: "🏆",
                        minutes: 12,
                        xp: 250,
                        content: [
                            "Experience, Expertise, Authoritativeness, and Trustworthiness.",
                            "Building author profiles and brand signals.",
                            "Managing 'Your Money or Your Life' (YMYL) content requirements."
                        ],
                        quiz: [
                            {
                                question: "What does the extra 'E' in E-E-A-T stand for?",
                                options: ["Engagement", "Experience", "Efficiency"],
                                answer: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "phase-6",
        title: "Phase 6: The Growth Marketing Engine",
        subtitle: "Conversion, retention, and multi-channel SEO.",
        emoji: "🚀",
        color: "#2b2b2b",
        units: [
            {
                id: "u6.1",
                title: "Conversion Mastery",
                lessons: [
                    {
                        id: "6.1.1",
                        title: "Behavioral SEO & CRO",
                        emoji: "📈",
                        minutes: 20,
                        xp: 400,
                        content: [
                            "Improving dwell time and reducing bounce rate through UX.",
                            "A/B testing title tags for higher CTR.",
                            "Mapping search intent to the conversion funnel."
                        ],
                        quiz: [
                            {
                                question: "If a user lands on your page from search and immediately returns to the search results (Pogo-sticking), what signal does it send?",
                                options: [
                                    "The content didn't adequately answer the user's query",
                                    "The user is very happy with the site",
                                    "The site has high domain authority"
                                ],
                                answer: 0
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export function getAllLessons(): Lesson[] {
    return curriculum.flatMap(phase => phase.units.flatMap(unit => unit.lessons));
}

export function getLessonById(id: string): Lesson | undefined {
    return getAllLessons().find(l => l.id === id);
}

