#!/usr/bin/env node

import { compile } from "./compile";
import { interpret } from "./interpret";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const command = process.argv[2];
const promise = new Promise<string>((res) => {
  let txt = "";
  const rl = createInterface({ input: stdin, output: stdout, terminal: false });
  rl.on("line", (inp) => (txt += `${inp}\n`));
  rl.once("close", () => res(txt.trim()));
});

promise.then((program) => {
  if (command === "compile") {
    const compiled = compile(program);
    console.log(compiled);
  } else if (command === "run") {
    console.log(interpret(program));
  } else {
    console.error("No command specified: compile | run");
  }
});
// if (compiled) console.log(eval(compiled));
