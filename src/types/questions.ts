export interface Question {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    acceptance_rate: number;
    topic: [string];
    company: [string];
    [key: string]: any;
}

export type FilterType = 'shuffle' | 'difficulty' | 'topic' | 'company' | null;