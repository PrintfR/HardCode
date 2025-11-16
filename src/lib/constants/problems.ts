// Problem-related constants

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "solved" | "attempted" | "todo";
export type SortOption = "newest" | "acceptance" | "difficulty" | "frequency";

export interface Problem {
    id: string;
    number: number;
    title: string;
    difficulty: Difficulty;
    acceptanceRate: number;
    frequency: number;
    status?: ProblemStatus;
    tags: string[];
    companies: string[];
    likes: number;
    dislikes: number;
    isBookmarked?: boolean;
}

export interface ProblemFilter {
    difficulties: Difficulty[];
    statuses: ProblemStatus[];
    tags: string[];
    companies: string[];
}

export const DIFFICULTY_COLORS = {
    Easy: "#00b8a3",
    Medium: "#ffc01e",
    Hard: "#ef4743",
} as const;

export const PROBLEM_TAGS = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Binary Search",
    "Breadth-First Search",
    "Tree",
    "Matrix",
    "Two Pointers",
    "Bit Manipulation",
    "Stack",
    "Heap (Priority Queue)",
    "Graph",
    "Design",
    "Backtracking",
    "Trie",
    "Union Find",
    "Sliding Window",
    "Linked List",
    "Recursion",
    "Monotonic Stack",
] as const;

export const COMPANY_NAMES = [
    "Amazon",
    "Google",
    "Microsoft",
    "Apple",
    "Facebook",
    "Uber",
    "Netflix",
    "Airbnb",
    "Twitter",
    "LinkedIn",
    "Oracle",
    "Adobe",
    "Salesforce",
    "VMware",
    "PayPal",
    "eBay",
    "Snapchat",
    "TikTok",
    "ByteDance",
    "Goldman Sachs",
] as const;

// Mock data generator
export const generateMockProblems = (count: number): Problem[] => {
    const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
    const statuses: ProblemStatus[] = ["solved", "attempted", "todo"];
    
    return Array.from({ length: count }, (_, i) => {
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        const tagCount = Math.floor(Math.random() * 3) + 1;
        const companyCount = Math.floor(Math.random() * 3) + 1;
        
        return {
            id: `problem-${i + 1}`,
            number: i + 1,
            title: `Problem ${i + 1}: ${["Two Sum", "Reverse String", "Binary Search", "Merge Intervals", "Valid Parentheses"][i % 5]}`,
            difficulty,
            acceptanceRate: Math.random() * 100,
            frequency: Math.random() * 100,
            status: i % 3 === 0 ? statuses[Math.floor(Math.random() * statuses.length)] : undefined,
            tags: PROBLEM_TAGS.slice(0, tagCount),
            companies: COMPANY_NAMES.slice(0, companyCount) as string[],
            likes: Math.floor(Math.random() * 1000),
            dislikes: Math.floor(Math.random() * 100),
            isBookmarked: Math.random() > 0.8,
        };
    });
};

