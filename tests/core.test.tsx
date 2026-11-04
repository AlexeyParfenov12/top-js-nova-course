import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../src/components/common";
import { emptyProgress, validateProgress } from "../src/engine/persistence";
import { instrument } from "../src/engine/instrument";
import { validMessage, isResults } from "../src/engine/execution";
import { lessons } from "../src/content/course";
import { projectFiles, referenceCodes } from "../src/projects/nova";
describe("Курс и экспортируемый проект", () => {
  it("содержит 9 полных занятий и 18 упражнений", () => {
    expect(lessons).toHaveLength(9);
    expect(lessons.flatMap((l) => l.exercises)).toHaveLength(18);
    for (const l of lessons) {
      expect(l.sections).toHaveLength(3);
      expect(l.hints).toHaveLength(3);
      expect(l.tests.length).toBeGreaterThan(150);
      expect(() => instrument(l.solution)).not.toThrow();
    }
  });
  it("создаёт независимые связанные страницы", () => {
    const files = projectFiles(referenceCodes);
    expect(Object.keys(files).filter((p) => p.endsWith(".html"))).toHaveLength(
      7,
    );
    for (const html of Object.keys(files).filter((p) => p.endsWith(".html"))) {
      expect(files[html].length).toBeLessThan(100_000);
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
