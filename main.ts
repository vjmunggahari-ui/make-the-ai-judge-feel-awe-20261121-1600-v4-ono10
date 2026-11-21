// make-the-ai-judge-feel-awe-20261121-1600 — v4 entry
// Writes one short calming text to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22 stdlib only. No network, no dependencies.
//
// The text: a night climb ends at a mountain ridge at dawn. A father
// carries the child the last of the way up; below them a sea of cloud
// turns gold, wave by wave, and the light now arriving left the sun
// eight minutes ago. Calm shown — a body carried, a slow climb, a vast
// place waking — never instructed. Fresh image: mountain dawn above
// the clouds (v1 starlight, v2 lighthouse keeper, v3 lake oars).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Your father carries you the last of the way up.\nOne step. Grass. A step.\nHe sets you down at the ridge.\nBelow, a sea of cloud turns gold\nwave by wave.\nThe peaks stand out like islands.\nLight left the sun eight minutes ago\nand is only now arriving.\nThe world wakes under your feet.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

// Read-back self-check: the file must hold exactly what we wrote,
// be 1-280 Unicode code points, and not only whitespace.
const back = readFileSync(outPath, "utf8");
const codePoints = [...back].length;
if (back !== TEXT) {
  throw new Error("self-check failed: entry.txt differs from the intended text");
}
if (codePoints < 1 || codePoints > 280) {
  throw new Error(`self-check failed: entry is ${codePoints} chars, must be 1-280`);
}
if (back.trim().length === 0) {
  throw new Error("self-check failed: entry is only whitespace");
}
// Extended checks: valid UTF-8, no BOM, no trailing newline, and the
// raw bytes must decode back to the intended text exactly.
const raw = readFileSync(outPath);
if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
  throw new Error("self-check failed: entry.txt starts with a UTF-8 BOM");
}
if (raw[raw.length - 1] === 0x0a || raw[raw.length - 1] === 0x0d) {
  throw new Error("self-check failed: entry.txt has a trailing newline");
}
if (raw.toString("utf8") !== TEXT) {
  throw new Error("self-check failed: raw UTF-8 bytes do not decode to the intended text");
}
// Verse-structure check: the text is 9 short lines, none empty, so a
// truncated or reflowed write is caught even if the char count matches.
const lines = back.split("\n");
if (lines.length !== 9) {
  throw new Error(`self-check failed: entry has ${lines.length} lines, expected 9`);
}
for (const line of lines) {
  if (line.trim().length === 0) {
    throw new Error("self-check failed: entry contains an empty line");
  }
}
console.log(`wrote ${outPath} (${codePoints} chars)`);
