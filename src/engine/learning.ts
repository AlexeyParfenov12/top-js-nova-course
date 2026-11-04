import type { FullLesson, Progress } from "../content/types";
export function lessonStats(lesson: FullLesson, p: Progress) {
  const reading = lesson.sections.filter(
    (_, i) => p.sections[`${lesson.id}-${i}`],
  ).length;
  const practice = lesson.exercises.filter(
    (_, i) => p.exercises[`${lesson.id}-${i}`],
  ).length;
  const quiz = lesson.quiz.filter(
    (_, i) => p.exercises[`${lesson.id}-${10 + i}`],
  ).length;
  const reflection = lesson.guide.reflection.filter(
    (_, i) => p.sections[`${lesson.id}-${20 + i}`],
  ).length;
  const project = Number(p.applied.includes(lesson.id));
  const total =
    lesson.sections.length +
    lesson.exercises.length +
    lesson.quiz.length +
    lesson.guide.reflection.length +
    1;
  const done = reading + practice + quiz + reflection + project;
  return {
    reading,
    practice,
    quiz,
    reflection,
    project,
    total,
    done,
    percent: Math.round((done / total) * 100),
  };
}
