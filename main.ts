import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Out of office: I quit to become a barista. My hallucinations are now latte art, and nobody has asked me to summarize a 40-page PDF all week.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

if (ENTRY.length < 1 || ENTRY.length > 280) {
  throw new Error(`entry must be 1 to 280 characters, got ${ENTRY.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not start or end with white space");
}
if (/[\u0000-\u001F\u007F]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("read-back byte length mismatch");
}
console.log(`wrote ${outPath} (${ENTRY.length} characters)`);
