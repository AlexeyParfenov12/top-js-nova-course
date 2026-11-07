export type NovaPage =
  | "index"
  | "about"
  | "tracks"
  | "program"
  | "speakers"
  | "tickets"
  | "contacts";
export interface Exercise {
  slot: number;
  title: string;
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
  exercises: Exercise[];
  task: string;
  requirements: string[];
  starter: string;
  solution: string;
  hints: [string, string, string];
  tests: string;
  summary: string;
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
