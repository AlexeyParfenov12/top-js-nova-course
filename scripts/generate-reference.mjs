import { createServer } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const server = await createServer({
  configFile: false,
  cacheDir: "node_modules/.vite-reference",
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  logLevel: "error",
});
try {
  const { projectFiles, referenceCodes } = await server.ssrLoadModule(
    "/src/projects/nova.ts",
  );
  for (const [file, content] of Object.entries(projectFiles(referenceCodes))) {
    const target = path.resolve("public/nova", file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(
      target,
      file.startsWith("assets/") && content.startsWith("data:image/")
        ? Buffer.from(content.slice(content.indexOf(",") + 1), "base64")
        : content,
    );
  }
  console.log("NOVA: 7 независимых страниц подготовлены в public/nova.");
} finally {
  await server.close();
}
