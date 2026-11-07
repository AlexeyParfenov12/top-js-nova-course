import { test, expect } from "@playwright/test";
import JSZip from "jszip";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
test("Простой маршрут от лекции через две задачи к практике", async ({
  page,
}) => {
  await page.goto("#/lesson/1");
  const phases = page.getByRole("navigation", { name: "Части пары" });
  await expect(phases.locator("button, a")).toHaveCount(3);
  await expect(
    phases.getByRole("button", { name: /Лекция.*30 мин/ }),
  ).toBeVisible();
  await expect(
    phases.getByRole("button", { name: /Тренажёр.*25 мин/ }),
  ).toBeVisible();
  await expect(
    phases.getByRole("link", { name: /Практика NOVA.*35 мин/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Разбор заданий" }),
  ).toBeVisible();
  const htmlExample = page.locator(".lecture-figure").first();
  await expect(htmlExample.locator("pre")).toContainText('<button id="hello">');
  await expect(
    htmlExample
      .frameLocator("iframe")
      .getByRole("button", { name: "Я с вами!" }),
  ).toBeVisible();
  await expect(htmlExample.getByText(/button#hello/)).toBeVisible();
  const contents = page.getByRole("navigation", { name: "Содержание лекции" });
  await expect(contents.getByRole("button")).toHaveCount(6);
  await contents.getByRole("button", { name: /Разбор заданий/ }).click();
  await expect(
    page.getByRole("heading", { name: /Разбор заданий/ }),
  ).toBeFocused();
  await expect(page).toHaveURL(/#\/lesson\/1$/);
  const starter = await page
    .getByLabel("Заготовка задачи 1", { exact: true })
    .textContent();
  await expect(
    page.getByText(/обработчик меняет текст в отдельном #greeting/),
  ).toBeVisible();
  const navigator = page.getByRole("dialog", { name: "Навигатор курса" });
  await page.getByRole("button", { name: "Навигатор", exact: true }).click();
  await expect(navigator.getByText(/2 пары сегодня и 8 пар/)).toBeVisible();
  await expect(navigator.getByRole("link")).toHaveCount(9);
  await expect(
    navigator.getByRole("link", { name: /Первые строки JavaScript/ }),
  ).toHaveAttribute("aria-current", "page");
  await navigator
    .getByRole("link", { name: /Переменные, типы и вычисления/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Переменные, типы и вычисления",
      exact: true,
    }),
  ).toBeVisible();
  await expect(navigator).not.toBeVisible();
  await page.goto("#/lesson/1");
  await page.getByText("План пары", { exact: false }).click();
  await expect(page.getByText("78–90 мин", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "К тренажёру", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Поменяй заголовок" }),
  ).toBeVisible();
  await expect(page.locator(".exercise")).toHaveCount(1);
  const trainerCode = page.locator(".trainer-editor .view-line");
  await expect(trainerCode).toHaveCount(starter?.split("\n").length ?? 0);
  expect(
    (await trainerCode.allTextContents()).join("\n").replaceAll("\u00a0", " ").trimEnd(),
  ).toBe(starter?.trimEnd());
  await page.getByRole("button", { name: "Ко второй задаче" }).click();
  await page
    .getByRole("textbox", { name: "Код упражнения 2" })
    .press("ControlOrMeta+A");
  await page.keyboard.insertText(
    "function connectButton(){const button=document.querySelector('#hello');button.addEventListener('click',()=>button.textContent='Я иду на NOVA');}",
  );
  await page.getByRole("button", { name: "Проверить", exact: true }).click();
  await expect(page.getByText("Верно! Все сценарии пройдены.")).toBeVisible();
  await expect(page.getByText("Сохранено на устройстве").first()).toBeVisible();
  await page.reload();
  await phases.getByRole("button", { name: /Тренажёр/ }).click();
  await page.getByRole("button", { name: /2\. Самостоятельно/ }).click();
  await expect(page.getByText("Выполнено", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "К практике NOVA" }).click();
  await expect(
    page.getByRole("button", { name: "Условие задания" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Навигатор", exact: true }).click();
  await expect(navigator).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(navigator).not.toBeVisible();
});
test("Чтение и задания адаптируются к компьютеру, планшету и телефону", async ({
  page,
}, testInfo) => {
  for (const width of [1920, 1440, 1366, 900, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("#/lesson/2");
    await expect(
      page.getByRole("heading", {
        name: "Переменные, типы и вычисления",
        exact: true,
      }),
    ).toBeVisible();
    await page
      .locator(".lesson-tabs")
      .getByRole("button", { name: /Лекция/ })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      `Лекция ${width}`,
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`lesson-${width}.png`),
      fullPage: false,
    });
    await page
      .locator(".lesson-tabs")
      .getByRole("button", { name: /Тренажёр/ })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      `Тренажёр ${width}`,
    ).toBe(true);
  }
});
test("Редактор открывает готовый NOVA отдельным работающим сайтом", async ({
  page,
}) => {
  await page.goto("#/workspace/1");
  const popupEvent = page.waitForEvent("popup");
  await page
    .getByRole("link", { name: "Открыть сайт NOVA ↗", exact: true })
    .click();
  const nova = await popupEvent;
  await nova.waitForLoadState();
  expect(nova.url()).toContain("/nova/index.html");
  await expect(nova.locator(".app-header")).toHaveCount(0);
  await expect(nova.locator(".art img")).toBeVisible();
  expect(
    await nova
      .locator(".art img")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  await nova.getByRole("button", { name: "Я с вами!", exact: true }).click();
  await expect(nova.locator("#greeting")).toHaveText("Увидимся на NOVA!");
  await nova
    .getByRole("navigation")
    .getByRole("link", { name: "Билеты", exact: true })
    .click();
  await nova.locator('[data-price="12000"]').click();
  await nova.locator("#quantity").fill("2");
  await expect(nova.locator("#ticket-total")).toHaveText("24000 ₽");
});
test("Адаптивность семи страниц NOVA и длинного заголовка", async ({
  page,
}, testInfo) => {
  for (const width of [1920, 1440, 1366, 900, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "index",
      "about",
      "tracks",
      "program",
      "speakers",
      "tickets",
      "contacts",
    ]) {
      await page.goto(`nova/${route}.html`);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `${route}: ${width}`,
      ).toBe(true);
      if (route === "index" && width === 1440)
        await page.screenshot({
          path: testInfo.outputPath("nova-home.png"),
          fullPage: true,
        });
    }
  }
});
test("Все решения, ошибочные черновики, упражнения и ограничения времени", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: /JavaScript:/ }),
  ).toBeVisible();
  const report = await page.evaluate(async () => {
    const base = location.pathname.replace(/\/$/, "");
    const { lessons } = await import(base + "/src/content/course.ts");
    const { checkInSandbox } = await import(base + "/src/engine/execution.ts");
    const codes: Record<string, string> = {};
    const results = [];
    for (const l of lessons) {
      const bad = await checkInSandbox(
        l.page,
        { ...codes, [l.id]: l.starter },
        {},
        l.tests,
      );
      codes[l.id] = l.solution;
      const good = await checkInSandbox(l.page, codes, {}, l.tests);
      const exercises = [];
      for (const e of l.exercises) {
        exercises.push(
          await checkInSandbox(
            "index",
            {},
            { "scripts/stage-10.js": e.solution },
            `test('Упражнение',()=>{${e.tests}});`,
          ),
        );
      }
      results.push({ id: l.id, bad, good, exercises });
    }
    const timeout = await checkInSandbox(
      "index",
      { "1": "while(true){}" },
      {},
      "test('Остановка',()=>ok(true));",
    );
    const syntax = await checkInSandbox(
      "index",
      { "1": "const = ;" },
      {},
      "test('Синтаксис',()=>ok(true));",
    );
    const regression = await checkInSandbox(
      "index",
      {
        ...codes,
        "9":
          lessons[8].solution +
          "\nconst title=document.querySelector('#hero-title');if(title) title.textContent='Сломано';",
      },
      {},
      lessons[0].tests,
    );
    return { results, timeout, syntax, regression };
  });
  for (const l of report.results) {
    expect(
      l.good.filter((r: any) => !r.passed),
      `Эталон ${l.id}`,
    ).toEqual([]);
    expect(
      l.bad.some((r: any) => !r.passed),
      `Неверный черновик ${l.id}`,
    ).toBe(true);
    for (const e of l.exercises)
      expect(
        e.filter((r: any) => !r.passed),
        `Упражнение ${l.id}`,
      ).toEqual([]);
  }
  expect(report.timeout.some((r: any) => !r.passed)).toBe(true);
  expect(report.syntax.some((r: any) => !r.passed)).toBe(true);
  expect(report.regression.some((r: any) => !r.passed)).toBe(true);
});
test("Путь студента: редактор → проверка → 9 этапов → перезагрузка → ZIP → независимый сайт", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("#/workspace/1");
  await expect(
    page.getByRole("button", { name: "Проверить решение", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Проверить решение", exact: true })
    .click();
  await expect(page.locator(".test-result.failed").first()).toBeVisible();
  for (let n = 1; n <= 9; n++) {
    if (n > 1) await page.goto("#/workspace/" + n);
    if (n === 2)
      await expect(
        page.frameLocator('iframe[title="Предпросмотр NOVA"]').locator("body"),
      ).toHaveAttribute("data-student", "saved");
    await page.getByRole("button", { name: "Условие задания" }).click();
    await page.getByText("Показать эталонное решение", { exact: true }).click();
    await page
      .getByRole("button", { name: "Загрузить в редактор", exact: true })
      .click();
    await expect(page.locator(".monaco-editor").first()).toBeVisible();
    if (n === 1) {
      const editor = page.getByRole("textbox", {
        name: "Редактор кода lesson-1/scripts/stage-1.js",
        exact: true,
      });
      await editor.press("ControlOrMeta+End");
      await page.keyboard.insertText(
        "\n document.body.dataset.student = 'saved';",
      );
    }
    await page
      .getByRole("button", { name: "Проверить решение", exact: true })
      .click();
    await expect(page.locator(".test-result.failed")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Добавить в мой проект" }).last(),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Добавить в мой проект" })
      .last()
      .click();
    await expect(
      page.getByText("Этап добавлен", { exact: false }).first(),
    ).toBeVisible();
  }
  await expect(page.getByText("Сохранено на устройстве").first()).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Этап добавлен", { exact: false }).first(),
  ).toBeVisible();
  await page.goto("#/project");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Скачать мой NOVA", exact: true })
    .click();
  const download = await downloadEvent;
  const zip = await JSZip.loadAsync(
    await fs.readFile((await download.path())!),
  );
  expect(
    Object.keys(zip.files).filter((p) => p.endsWith(".html")),
  ).toHaveLength(7);
  const folder = testInfo.outputPath("nova-export");
  await fs.mkdir(folder, { recursive: true });
  for (const [name, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    await fs.mkdir(path.dirname(path.join(folder, name)), { recursive: true });
    await fs.writeFile(path.join(folder, name), await file.async("nodebuffer"));
  }
  const nova = await page.context().newPage();
  await nova.goto(pathToFileURL(path.join(folder, "index.html")).href);
  await expect(nova.locator("#hero-title")).toHaveText(
    "NOVA — будущее начинается здесь",
  );
  await nova.locator("#hello").click();
  await expect(nova.locator("#greeting")).toHaveText("Увидимся на NOVA!");
  await nova.locator("#open-modal").click();
  await expect(nova.locator("dialog")).toBeVisible();
  await nova.keyboard.press("Escape");
  await expect(nova.locator("dialog")).not.toBeVisible();
  await nova.goto(pathToFileURL(path.join(folder, "speakers.html")).href);
  await expect(nova.locator(".speaker-card")).toHaveCount(3);
  await nova.goto(pathToFileURL(path.join(folder, "program.html")).href);
  await expect(nova.locator(".event-row")).toHaveCount(3);
  await nova.locator('[data-day="2"]').click();
  await expect(nova.locator(".event-row")).toHaveCount(2);
  await nova.goto(pathToFileURL(path.join(folder, "tickets.html")).href);
  await nova.locator('[data-price="12000"]').click();
  await nova.locator("#quantity").fill("2");
  await expect(nova.locator("#ticket-total")).toHaveText("24000 ₽");
  await nova.goto(pathToFileURL(path.join(folder, "contacts.html")).href);
  await nova.getByRole("button", { name: "Проверить сообщение" }).click();
  await expect(nova.locator("#form-status")).toHaveText("Введите имя");
  await page.screenshot({
    path: testInfo.outputPath("project-complete.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("Задание второго дня открывается с готовой основой и сохраняет только свой зачёт", async ({
  page,
}) => {
  await page.goto("#/workspace/4");
  const result = page.frameLocator('iframe[title="Предпросмотр NOVA"]');
  const example = page.frameLocator('iframe[title="Образец NOVA"]');
  await expect(result.locator("#hero-title")).toHaveText(
    "NOVA — будущее начинается здесь",
  );
  await expect(example.locator("#hero-title")).toHaveText(
    "NOVA — будущее начинается здесь",
  );
  const trigger = page.getByRole("button", { name: "Условие задания" });
  const dialog = page.getByRole("dialog", { name: "Функции и события" });
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/подставлена готовая основа/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByText("Показать эталонное решение", { exact: true }).click();
  await dialog.getByRole("button", { name: "Загрузить в редактор" }).click();
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("button", { name: "Проверить решение", exact: true })
    .click();
  await page.getByRole("button", { name: "Добавить в мой проект" }).click();
  await expect(
    page.getByText("Этап 4 добавлен в NOVA.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("Сохранено на устройстве").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Этап добавлен", { exact: true })).toBeVisible();
  await expect(result.locator("#hero-title")).toHaveText(
    "NOVA — будущее начинается здесь",
  );
  await page.goto("#/project");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "11",
  );
  await page.setViewportSize({ width: 390, height: 740 });
  await page.goto("#/workspace/4");
  await trigger.click();
  await expect(
    dialog.getByRole("button", { name: "К редактору" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
test("Лекция, тренажёр, перенос JSON и отказ от повреждённого импорта", async ({
  page,
}) => {
  await page.goto("#/lesson/1");
  await expect(
    page.getByRole("heading", { name: "Разбор заданий" }),
  ).toBeVisible();
  await page
    .locator(".lesson-tabs")
    .getByRole("button", { name: /Тренажёр/ })
    .click();
  await page
    .getByRole("textbox", { name: "Код упражнения 1" })
    .press("ControlOrMeta+A");
  await page.keyboard.insertText(
    "function renameTitle(text){document.querySelector('#hero-title').textContent=text;}",
  );
  await page
    .getByRole("button", { name: "Проверить", exact: true })
    .first()
    .click();
  await expect(page.getByText("Верно! Все сценарии пройдены.")).toBeVisible();
  await page.goto("#/settings");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Экспорт прогресса в JSON" }).click();
  const file = await downloadEvent;
  const raw = await fs.readFile((await file.path())!);
  const backup = JSON.parse(raw.toString());
  expect(backup.exercises["1-3"]).toBe(true);
  await page.getByLabel("Импорт JSON прогресса").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByText(/Импорт отклонён/)).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Сбросить весь курс" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Импорт JSON прогресса").setInputFiles({
    name: "progress.json",
    mimeType: "application/json",
    buffer: raw,
  });
  await expect(
    page.getByText("Прогресс импортирован.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.goto("#/lesson/1");
  await page
    .locator(".lesson-tabs")
    .getByRole("button", { name: /Тренажёр/ })
    .click();
  await expect(page.getByText("Выполнено", { exact: true })).toBeVisible();
});
test("Адаптивные экраны без горизонтального переполнения", async ({
  page,
}, testInfo) => {
  for (const size of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 900, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("./");
    await expect(
      page.getByRole("heading", { name: /JavaScript:/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      JSON.stringify(size),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`home-${size.width}.png`),
      fullPage: true,
    });
  }
});
test("Подсветка и автодополнение JavaScript в лекции и редакторах", async ({
  page,
}) => {
  await page.goto("#/lesson/1");
  const snippet = page.locator(".lecture-figure .javascript-code").first();
  await expect(snippet.getByText("const", { exact: true })).toHaveCSS(
    "color",
    "rgb(105, 65, 175)",
  );
  await expect(snippet.getByText("'#hello'", { exact: true })).toHaveCSS(
    "color",
    "rgb(23, 103, 67)",
  );
  await page.getByRole("button", { name: /Тренажёр.*25 мин/ }).click();
  for (const editorName of [
    "Код упражнения 1",
    "Редактор кода lesson-1/scripts/stage-1.js",
  ]) {
    const editor = page.getByRole("textbox", { name: editorName, exact: true });
    await editor.press("ControlOrMeta+A");
    await page.keyboard.type("document.querySel");
    const suggestion = page.getByRole("listitem", { name: /^querySelector,/ });
    await expect(suggestion).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator(".monaco-editor .view-lines")).toHaveText(
      "document.querySelector",
    );
    if (editorName === "Код упражнения 1") {
      await page.goto("#/workspace/1");
    }
  }
});
test("Ввод кода в Monaco, сохранение черновика и реальный запуск", async ({
  page,
}) => {
  await page.goto("#/workspace/1");
  const editor = page.getByRole("textbox", {
    name: "Редактор кода lesson-1/scripts/stage-1.js",
    exact: true,
  });
  await editor.focus();
  await editor.press("ControlOrMeta+A");
  await page.keyboard.insertText(
    "const title = document.querySelector('#hero-title');\nif(title) title.textContent='Мой фестиваль';\nconsole.log('Скрипт запущен');",
  );
  await expect(page.getByText("Сохранено на устройстве").first()).toBeVisible();
  await page.getByRole("button", { name: "Запустить", exact: true }).click();
  await expect(
    page
      .frameLocator('iframe[title="Предпросмотр NOVA"]')
      .locator("#hero-title"),
  ).toHaveText("Мой фестиваль");
  await page.getByRole("button", { name: /Консоль/ }).click();
  await expect(
    page.getByText("› Скрипт запущен", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page
      .frameLocator('iframe[title="Предпросмотр NOVA"]')
      .locator("#hero-title"),
  ).toHaveText("Мой фестиваль");
});
test("Самостоятельный образец NOVA", async ({ page }) => {
  await page.goto("nova/index.html");
  await expect(page.locator("#hero-title")).toHaveText(
    "NOVA — будущее начинается здесь",
  );
  await page.getByRole("button", { name: "Я с вами!" }).click();
  await expect(page.locator("#greeting")).toHaveText("Увидимся на NOVA!");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "О фестивале", exact: true })
    .click();
  await page.locator("#about-toggle").click();
  await expect(page.locator("#about-details")).toBeVisible();
});
