import { diagram } from "../mod.ts";
import { modules } from "./modules/index.ts";

Deno.writeTextFileSync(
  "./README.md",
  [
    "# Example Project",
    "",
    "```mermaid",
    diagram(modules),
    "```",
    "",
  ].join("\n"),
);
