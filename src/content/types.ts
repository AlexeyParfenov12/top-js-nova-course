export type NovaPage =
  | "index"
  | "about"
  | "tracks"
  | "program"
  | "speakers"
  | "tickets"
  | "contacts";
export interface Section {
  title: string;
  text: string;
  code: string;
  note: string;
  walkthrough?: string[];
  experiment?: string;
  prediction?: { prompt: string; answer: string };
}
export interface KnowledgeQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface SessionGuide {
  warmup: string;
  prerequisite: string;
  milestones: string[];
  selfCheck: string[];
  extension: string;
  reflection: string[];
}
export interface FullLesson extends Lesson {
  quiz: KnowledgeQuestion[];
  guide: SessionGuide;
}
export interface Exercise {
  prompt: string;
  starter: string;
  solution: string;
  tests: string;
  hint: string;
}
export interface Lesson {
  id: number;
  day: number;
  title: string;
  short: string;
  goal: string;
  feature: string;
  page: NovaPage;
  sections: Section[];
  exercises: Exercise[];
  task: string;
  requirements: string[];
  starter: string;
  solution: string;
  hints: [string, string, string];
  tests: string;
  summary: string;
  demo: { code: string[]; states: string[] };
}
export interface TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}
export interface Checkpoint {
  id: string;
  date: string;
  stage: number;
  codes: Record<string, string>;
  files: Record<string, string>;
}
export interface Progress {
  version: 1;
  current: number;
  drafts: Record<string, string>;
  exercises: Record<string, boolean>;
  exerciseDrafts: Record<string, string>;
  applied: number[];
  codes: Record<string, string>;
  files: Record<string, string>;
  results: Record<string, TestResult[]>;
  checkpoints: Checkpoint[];
  sections: Record<string, boolean>;
}
