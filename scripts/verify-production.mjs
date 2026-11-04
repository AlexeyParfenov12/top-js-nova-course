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
  await page
    .getByRole("link", { name: "Начать обучение", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Первые строки JavaScript", exact: true })
    .waitFor();
  await page.getByRole("link", { name: "Практика NOVA", exact: true }).click();
  await page.locator(".monaco-editor").first().waitFor({ timeout: 30000 });
  await page.reload();
  await page.locator(".monaco-editor").first().waitFor({ timeout: 30000 });
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
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log(
    JSON.stringify({
      url: base,
      platform: true,
      routeReload: true,
      monaco: true,
      grading: true,
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
