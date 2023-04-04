#!/usr/bin/env node

import { compile } from "./compile";
import { interpret } from "./interpret";
import { codepage } from "./codepage";
import { resolve } from "node:path";
import { argv, cwd } from "node:process";
import { readFile } from "node:fs/promises";

const [file, flags, input] = argv.slice(2);
const program = readFile(resolve(cwd(), file), "utf8");
