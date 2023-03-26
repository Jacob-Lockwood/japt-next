import { codepage } from "../../src/codepage";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function generateCodepage() {
  const matrix = ((codepage.match(/.{16}/gs) as string[]) || [])
    .map((row) => row.split(""))
    .map((row) => row.map((c) => (c === "\n" ? "\\n" : c)));

  const head = `|   |${matrix[0]
    .map((_, i) => `_${i.toString(16).toUpperCase()} |`)
    .join("")}`;
  const sep = `|---|${matrix[0].map(() => "---|").join("")}`;
  const cols = matrix.map((row, i) => {
    return `|${i.toString(16).toUpperCase()}_ |${row
      .map((c) => `\`${c}\``)
      .join("|")}|`;
  });
  const md = ["# Codepage\n", head, sep, ...cols].join("\n");

  try {
    await writeFile(join(__dirname, "../codepage.md"), md);
    console.log("Successfully wrote codepage.md");
  } catch (e) {
    console.error(`Failed to write codepage.md:`, e);
  }
}
