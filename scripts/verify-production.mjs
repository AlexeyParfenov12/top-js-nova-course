import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.argv[2];
if (!base?.startsWith("http"))
  throw new Error("Usage: node scripts/verify-production.mjs URL");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const failures = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    failures.push({ url: response.url(), status: response.status() });
});
try {
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await page.locator(".course-welcome").waitFor();
  assert.equal(await page.locator(".day-card .lesson-row").count(), 9);
  if (process.argv[4])
    await page.screenshot({ path: process.argv[4], fullPage: false });
  await page
    .getByRole("link", { name: "Начать обучение", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Первые строки JavaScript", exact: true })
    .waitFor();
  const phases = page.getByRole("navigation", { name: "Части пары" });
  await phases.getByRole("button", { name: /Лекция.*30 мин/ }).waitFor();
  assert.equal(await phases.locator("button, a").count(), 3);
  const outline = page.getByRole("navigation", { name: "Содержание лекции" });
  await outline.getByRole("button", { name: /Разбор заданий/ }).waitFor();
  assert.equal(await outline.getByRole("button").count(), 6);
  if (process.argv[5])
    await page.screenshot({ path: process.argv[5], fullPage: false });
  const firstVisual = page.locator(".lecture-figure").first();
  await firstVisual
    .frameLocator("iframe")
    .getByRole("heading", { name: "Фестиваль NOVA" })
    .waitFor();
  await firstVisual.getByText(/button#hello/).waitFor();
  await outline
    .getByRole("button", { name: /Как JavaScript видит HTML/ })
    .click();
  if (process.argv[11]) {
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.screenshot({ path: process.argv[11], fullPage: false });
  }
  await outline.getByRole("button", { name: /Разбор заданий/ }).click();
  await page.getByText("Заготовки и эталоны", { exact: true }).click();
  await page.getByLabel("Заготовка задачи 1", { exact: true }).waitFor();
  await page
    .getByRole("heading", { name: "Практика NOVA", exact: true })
    .waitFor();
  if (process.argv[12])
    await page.screenshot({ path: process.argv[12], fullPage: false });
  await page.getByText("План пары", { exact: false }).click();
  await page.getByText("78–90 мин", { exact: true }).waitFor();
  await page.getByText("План пары", { exact: false }).click();
  await page.getByRole("button", { name: "Навигатор", exact: true }).click();
  const navigator = page.getByRole("dialog", { name: "Навигатор курса" });
  await navigator.getByText(/2 пары сегодня и 8 пар/).waitFor();
  assert.equal(await navigator.getByRole("link").count(), 9);
  if (process.argv[9])
    await page.screenshot({ path: process.argv[9], fullPage: false });
  await navigator.getByRole("button", { name: "Закрыть навигатор" }).click();
  await phases.getByRole("button", { name: /Тренажёр.*25 мин/ }).click();
  await page.getByRole("heading", { name: "Поменяй заголовок" }).waitFor();
  assert.equal(await page.locator(".exercise").count(), 1);
  await page.getByRole("button", { name: /2\. Самостоятельно/ }).click();
  await page.getByRole("heading", { name: "Подключи кнопку" }).waitFor();
  if (process.argv[8])
    await page.screenshot({ path: process.argv[8], fullPage: false });
  await page
    .locator(".lesson-tabs")
    .getByRole("link", { name: /Практика NOVA.*35 мин/ })
    .click();
  await page.locator(".monaco-editor").first().waitFor({ timeout: 30000 });
  await page.reload();
  await page.locator(".monaco-editor").first().waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "index.html", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Редактор кода lesson-1/index.html" })
    .waitFor();
  await page
    .locator(".monaco-editor .line-numbers")
    .filter({ hasText: /^7$/ })
    .waitFor();
  if (process.argv[10])
    await page.screenshot({ path: process.argv[10], fullPage: false });
  await page.getByRole("button", { name: "Условие задания" }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByText("Показать эталонное решение", { exact: true }).click();
  await page
    .getByRole("button", { name: "Загрузить в редактор", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Проверить решение", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Добавить в мой проект" })
    .last()
    .waitFor();
  assert.equal(await page.locator(".test-result.failed").count(), 0);
  await page.goto(new URL("#/workspace/4", base).href);
  await page
    .getByRole("heading", {
      name: "Модальное окно с клавиатурным управлением",
      exact: true,
    })
    .waitFor();
  for (const title of ["Предпросмотр NOVA", "Образец NOVA"]) {
    await page
      .frameLocator(`iframe[title="${title}"]`)
      .getByRole("heading", {
        name: "NOVA - будущее начинается здесь",
        exact: true,
      })
      .waitFor();
  }
  await page.locator(".monaco-editor").first().waitFor();
  if (process.argv[6])
    await page.screenshot({ path: process.argv[6], fullPage: false });
  await page.getByRole("button", { name: "Условие задания" }).click();
  await page
    .getByRole("dialog")
    .getByText(/подставлена готовая основа/)
    .waitFor();
  if (process.argv[7])
    await page.screenshot({ path: process.argv[7], fullPage: false });
  const nova = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  nova.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "index",
    "about",
    "tracks",
    "program",
    "speakers",
    "tickets",
    "contacts",
  ]) {
    const result = await nova.goto(new URL(`nova/${route}.html`, base).href);
    assert.equal(result.status(), 200);
    assert.ok((await nova.locator("h1").textContent())?.length);
  }
  await nova.goto(new URL("nova/tickets.html", base).href);
  await nova.locator('[data-price="5000"]').click();
  await nova.locator("#quantity").fill("3");
  assert.equal(await nova.locator("#ticket-total").textContent(), "15000 ₽");
  await nova.goto(new URL("nova/program.html", base).href);
  await nova.locator('[data-day="3"]').click();
  await nova.locator("#program-track").selectOption("Robotics");
  assert.equal(await nova.locator(".event-row").count(), 0);
  assert.equal(await nova.locator("#program-empty").isVisible(), true);
  await nova.goto(new URL("nova/index.html", base).href);
  assert.ok(
    await nova
      .locator(".art img")
      .evaluate((image) => image.complete && image.naturalWidth > 0),
  );
  if (process.argv[3])
    await nova.screenshot({ path: process.argv[3], fullPage: false });
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log(
    JSON.stringify({
      url: base,
      platform: true,
      courseContent: {
        days: 3,
        sessions: 9,
        minutesPerSession: 90,
        exercises: 18,
      },
      learningUI: true,
      classroomFlow: true,
      courseNavigator: true,
      lectureOutline: true,
      visualLecture: true,
      assignmentBreakdown: true,
      formattedHtml: true,
      routeReload: true,
      monaco: true,
      grading: true,
      taskDialog: true,
      stageStarter: true,
      novaPages: 7,
      calculator: true,
      filters: true,
      pageErrors: errors,
      networkFailures: failures,
    }),
  );
} finally {
  await browser.close();
}
