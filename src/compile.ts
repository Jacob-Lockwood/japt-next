import { parse } from "./parse";
import { shortcuts } from "./shortcuts";
import type { CstNode, IToken } from "chevrotain";

function cstNodeToJS(node: CstNode): string {
  const { children, name } = node;
  if (name === "expression") {
    const literal = cstNodeToJS(children.literal[0] as CstNode);
    const commands = ((children.command ?? []) as CstNode[]).map(cstNodeToJS);
    return `${literal}${commands.join("")}`;
  }
  if (name === "command") {
    const commandName = (node.children.Command[0] as IToken).image;
    const args = (children.expression as CstNode[]).map(cstNodeToJS);
    return `.${commandName}(${args.join(", ")})`;
  }
  if (name === "literal") {
    if ("StringLiteral" in children) {
      return (children.StringLiteral[0] as IToken).image;
    }
    if ("NumberLiteral" in children) {
      return (children.NumberLiteral[0] as IToken).image;
    }
    if ("array" in children) {
      const arr = (children.array[0] as CstNode).children
        .expression as CstNode[];
      return `[${arr.map(cstNodeToJS).join(", ")}]`;
    }
    if ("fn" in children) {
      const fn = children.fn[0] as CstNode;
      // not done yet
      const params = (fn.children.Params[0] as IToken).image
        .split("")
        .slice(0, -1);
      const body = cstNodeToJS(fn.children.expression[0] as CstNode);
      return `((${params.join(", ")}) => ${body})`;
    }
    if ("Var" in children) {
      return (children.Var[0] as IToken).image;
    }
  }
  return "";
}
export function compile(source: string) {
  let replaced = source;
  for (const [shortcut, expansion] of Object.entries(shortcuts)) {
    replaced = replaced.replace(new RegExp(shortcut, "g"), expansion);
  }
  const { cst, parseErrors } = parse(replaced);
  if (!cst && parseErrors.length)
    console.error(JSON.stringify(parseErrors, null, 2));
  else return cstNodeToJS(cst);
}
