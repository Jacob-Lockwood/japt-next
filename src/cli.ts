#!/usr/bin/env node

import { compile } from "./compile";

const [, , command, program] = process.argv;
if (command === "compile") {
  const compiled = compile(program);
  console.log(compiled);
} else if (command === "run") {
  const compiled = compile(program);
  if (compiled) console.log(eval(compiled));
} else {
  console.error("No command specified: compile | run");
}
// if (compiled) console.log(eval(compiled));
