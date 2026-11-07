import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../src/components/common";
import { emptyProgress, validateProgress } from "../src/engine/persistence";
import { instrument } from "../src/engine/instrument";
import { validMessage, isResults } from "../src/engine/execution";
import { lessons } from "../src/content/course";
import { lectures } from "../src/content/lectures";
import { conceptGuides } from "../src/content/conceptGuides";
import { lessonStories } from "../src/content/lessonStories";
import {
  assignmentGuides,
  lectureExamples,
} from "../src/content/lectureExamples";
import { projectFiles, referenceCodes } from "../src/projects/nova";
import { pairMinutes, sessions } from "../src/content/sessions";
describe("Курс и экспортируемый проект", () => {
  it("содержит три дня по три пары по 90 минут", () => {
    expect(pairMinutes).toBe(90);
    expect(lessons).toHaveLength(9);
    for (const day of [1, 2, 3]) {
      expect(lessons.filter((lesson) => lesson.day === day)).toHaveLength(3);
    }
    for (const lesson of lessons) {
      const conceptCount = lesson.id === 1 ? 4 : 3;
      expect(lectures[lesson.id].concepts).toHaveLength(conceptCount);
      expect(lectureExamples[lesson.id]).toHaveLength(conceptCount);
      expect(conceptGuides[lesson.id]).toHaveLength(conceptCount);
      expect(lessonStories[lesson.id].steps).toHaveLength(conceptCount);
      expect(assignmentGuides[lesson.id].trainer).toHaveLength(
        lesson.exercises.length,
      );
      expect(sessions[lesson.id].practice).toHaveLength(3);
      expect(lesson.exercises).toHaveLength(2);
      expect(
        new Set(lesson.exercises.map((exercise) => exercise.slot)).size,
      ).toBe(2);
      expect(() => instrument(lesson.solution)).not.toThrow();
      for (const exercise of lesson.exercises) {
        expect(() => instrument(exercise.solution)).not.toThrow();
      }
    }
  });
  it("создаёт независимые связанные страницы", () => {
    const files = projectFiles(referenceCodes);
    expect(Object.keys(files).filter((p) => p.endsWith(".html"))).toHaveLength(
      7,
    );
    for (const html of Object.keys(files).filter((p) => p.endsWith(".html"))) {
      expect(files[html].length).toBeLessThan(100_000);
      for (const tag of ["header", "main", "footer"])
        expect(files[html], html).toMatch(
          new RegExp(`\\n {4}<${tag}\\b[^>]*>\\n`),
        );
      const doc = new DOMParser().parseFromString(files[html], "text/html");
      expect(doc.querySelector("h1")).toBeTruthy();
      for (const node of doc.querySelectorAll(
        'script[src],link[href],a[href$=".html"],img[src]',
      )) {
        const path =
          node.getAttribute("src") || node.getAttribute("href") || "";
        expect(files[path], `${html}: ${path}`).toBeDefined();
      }
    }
  });
});
describe("Совместимость прогресса", () => {
  it("сохраняет полные данные предыдущего формата курса", () => {
    const progress = emptyProgress();
    for (const lesson of lessons) {
      for (let slot = 0; slot < 6; slot++) {
        progress.exerciseDrafts[`${lesson.id}-${slot}`] = "// Старый черновик";
        progress.exercises[`${lesson.id}-${slot}`] = true;
      }
      for (const slot of [10, 11, 12, 13])
        progress.exercises[`${lesson.id}-${slot}`] = true;
      for (const slot of [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22])
        progress.sections[`${lesson.id}-${slot}`] = true;
      progress.applied.push(lesson.id);
      progress.codes[lesson.id] = lesson.solution;
    }
    expect(validateProgress(JSON.parse(JSON.stringify(progress)))).toEqual(
      progress,
    );
  });
});
describe("Защита от случайных бесконечных циклов", () => {
  it.each([
    "while(true) {}",
    "for(;;) console.log(1);",
    "do {} while(true);",
    "function recursive(){recursive()} recursive();",
    "const recurse=()=>recurse(); recurse();",
  ])("ставит ограничение: %s", (code) => {
    let calls = 0;
    const run = new Function("__topGuard", "console", instrument(code));
    expect(() =>
      run(
        () => {
          if (++calls > 10) throw new Error("лимит");
        },
        { log() {} },
      ),
    ).toThrow("лимит");
  });
  it("сохраняет обычные вычисления и вложенные функции", () => {
    let checks = 0;
    const output = new Function(
      "__topGuard",
      instrument("let sum=0; for(let i=0;i<3;i++){sum+=i;} const f=x=>x*2;") +
        "return f(sum);",
    );
    expect(output(() => checks++)).toBe(6);
    expect(checks).toBeGreaterThan(0);
  });
  it("отклоняет синтаксические ошибки до запуска", () =>
    expect(() => instrument("const = ;")).toThrow());
});
describe("Прогресс и сообщения", () => {
  it("позволяет круговой перенос JSON", () =>
    expect(
      validateProgress(JSON.parse(JSON.stringify(emptyProgress()))),
    ).toEqual(emptyProgress()));
  it("отвергает лишние пути и неверные данные", () => {
    expect(() =>
      validateProgress({ ...emptyProgress(), files: { "../secret.js": "x" } }),
    ).toThrow();
    expect(() =>
      validateProgress({ ...emptyProgress(), applied: [1] }),
    ).toThrow();
    expect(() =>
      validateProgress({ ...emptyProgress(), current: 99 }),
    ).toThrow();
  });
  it("проверяет source, непрозрачный origin и nonce", () => {
    const source = {} as Window;
    const data = {
      channel: "top-nova",
      token: "a",
      type: "ready",
      payload: null,
    };
    expect(
      validMessage(
        { source, origin: "null", data } as MessageEvent,
        source,
        "a",
      ),
    ).toBeTruthy();
    expect(
      validMessage(
        { source, origin: "https://evil.test", data } as MessageEvent,
        source,
        "a",
      ),
    ).toBeFalsy();
    expect(
      validMessage(
        { source: {}, origin: "null", data } as MessageEvent,
        source,
        "a",
      ),
    ).toBeFalsy();
    expect(
      validMessage(
        { source, origin: "null", data } as MessageEvent,
        source,
        "b",
      ),
    ).toBeFalsy();
    expect(isResults([{ name: "Проверка", passed: true }])).toBeTruthy();
    expect(isResults([{ name: "Проверка", passed: "yes" }])).toBeFalsy();
  });
  it("показывает доступный прогресс без фиктивных значений", () => {
    render(<ProgressBar value={44} label="Готовность NOVA" />);
    expect(
      screen.getByRole("progressbar", { name: "Готовность NOVA" }),
    ).toHaveAttribute("aria-valuenow", "44");
  });
});
