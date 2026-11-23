// SPDX-License-Identifier: MIT
// Post X: Promote make.fun's make-your-own-bounty post — entry program.
// Copies POST.json (the X post's URL) from the repository to /output.
// The house reads the post itself from X; nothing else is written.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;
const src = join(repoRoot, "POST.json");
if (!existsSync(src)) {
  throw new Error("POST.json missing from repository root");
}
const parsed = JSON.parse(readFileSync(src, "utf8")) as { url?: unknown };
if (typeof parsed.url !== "string" || !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/.+\/status\/\d+/.test(parsed.url)) {
  throw new Error(`POST.json url is not an X post address: ${String(parsed.url)}`);
}
// Count code points of the URL so a non-ASCII handle cannot slip past the gate.
if ([...parsed.url].length > 200) {
  throw new Error("POST.json url is unexpectedly long");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "POST.json"));
