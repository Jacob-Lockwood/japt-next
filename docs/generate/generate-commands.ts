import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function generateCommands() {
  const file = await readFile(
    join(__dirname, "../../src/commands.ts"),
    "utf-8"
  );
  const classes = file.split("class ").slice(1);
  const md = classes
    .map((cl) => {
      const cmds = [...cl.matchAll(/\/\*\*(\n +\*[^\/]*)+\*\//g)].map((x) => {
        const comment = x[1].replace(/^ *\* */gm, "").split("\n");
        const signature = comment
          .find((s) => s.startsWith("@signature "))
          ?.slice(11);
        const description = comment
          .find((s) => s.startsWith("@description "))
          ?.slice(13);
        return `### ${signature}\n\n${description}`;
      });
      return `## ${cl[0]}\n\n${cmds.join("\n\n")}`;
    })
    .join("\n\n");
  try {
    await writeFile(join(__dirname, "../commands.md"), md);
    console.log("Successfully wrote commands.md");
  } catch (e) {
    console.error(`Failed to write commands.md:`, e);
  }
}
