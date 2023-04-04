import { parse } from "./parse";
import { shortcuts } from "./shortcuts";
import type { CstNode, IToken } from "chevrotain";

function cstNodeToJS(node: CstNode): string {
  const { children, name } = node;
  if (name === "program") {
    const order = "UVWXYZ";
    if (children.expression.length === 0) return order[0];
    return (children.expression as CstNode[])
      .map(
        (e, i, a) =>
          (i === a.length - 1 ? "" : `${order[i]}=`) +
          ("literal" in e.children ? "" : order[i - 1] || order[0]) +
          cstNodeToJS(e as CstNode)
      )
      .join(";\n");
  }
  if (name === "expression") {
    const literal =
      "literal" in children ? cstNodeToJS(children.literal[0] as CstNode) : "";
    const commands = ((children.command ?? []) as CstNode[]).map(cstNodeToJS);
    return `${literal}${commands.join("")}`;
  }
  if (name === "command") {
    const commandName = (node.children.Command[0] as IToken).image;
    const args = (children.expression as CstNode[]).map(cstNodeToJS);
    return `.${commandName}(${args.join(", ")})`;
  }
  if ("StringLiteral" in children) {
    return `$S(${(children.StringLiteral[0] as IToken).image})`;
  }
  if ("NumberLiteral" in children) {
    return `$N(${(children.NumberLiteral[0] as IToken).image})`;
  }
  if ("array" in children) {
    const arr = (children.array[0] as CstNode).children.expression as CstNode[];
    return `$A([${arr.map(cstNodeToJS).join(", ")}])`;
  }
  if ("fn" in children) {
    const fn = children.fn[0] as CstNode;
    const params = (fn.children.Params[0] as IToken).image
      .split("")
      .slice(0, -1);
    const body = cstNodeToJS(fn.children.expression[0] as CstNode);
    return `$F((${params.join(", ")}) => ${body})`;
  }
  if ("Var" in children) {
    return (children.Var[0] as IToken).image;
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
