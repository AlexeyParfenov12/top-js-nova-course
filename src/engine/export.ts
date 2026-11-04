import JSZip from "jszip";
import type { Progress } from "../content/types";
import { projectFiles } from "../projects/nova";
export function download(content: Blob, name: string) {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function createProjectZip(
  codes: Record<string, string>,
  files: Record<string, string> = {},
) {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(projectFiles(codes, files)))
    zip.file(path, content);
  zip.file(
    "README.txt",
    "NOVA — учебный сайт технологического фестиваля.\nОткройте index.html или разместите все файлы на статическом хостинге.\nТарифы, участники и даты демонстрационные. Формы не отправляют данные.\nГрафика: оригинальные SVG и CSS. Сайт не требует платформы TOP и внешних сервисов.",
  );
  return zip.generateAsync({ type: "blob" });
}
export function exportProgress(progress: Progress) {
  download(
    new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" }),
    "top-nova-progress.json",
  );
}
