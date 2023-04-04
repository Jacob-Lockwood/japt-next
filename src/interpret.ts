import { compile } from "./compile";
import { $A, $F, $N, $S, type Wrapper } from "./commands";

export function interpret(
  source: string,
  inputs: Wrapper<any>[]
): Wrapper<any> {
  const fnInputs = ["$A", "$F", "$N", "$S", "N", "U", "V", "W", "X", "Y", "Z"];
  return new Function(
    ...fnInputs,
    `return(${compile(source)?.split(";").join(",")})`
  )($A, $F, $N, $S, inputs, ...inputs).unwrap();
}
