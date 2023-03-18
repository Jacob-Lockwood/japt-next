import { compile } from "./compile";
import { $A, $F, $N, $S } from "./commands";

export function interpret(source: string) {
  return new Function(
    "$A",
    "$F",
    "$N",
    "$S",
    `(${compile(source)?.split(";\n").join(",")})`
  )($A, $F, $N, $S).unwrap();
}
