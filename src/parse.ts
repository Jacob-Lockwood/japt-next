import { createToken, Lexer, CstParser } from "chevrotain";
import { codepage } from "./codepage";

const commandRegex = new RegExp(codepage.slice(45).split("").join(""));

const tokens = {
  // LCurly: createToken({ name: "LCurly", pattern: /{/, label: "{" }),
  RCurly: createToken({ name: "RCurly", pattern: /}/, label: "}" }),
  LSquare: createToken({ name: "LSquare", pattern: /\[/, label: "[" }),
  RSquare: createToken({ name: "RSquare", pattern: /]/, label: "]" }),
  StringLiteral: createToken({
    name: "StringLiteral",
    pattern: /"[^"]*"/,
  }),
  NumberLiteral: createToken({
    name: "NumberLiteral",
    pattern: /-?\d+(\.\d+)?/,
  }),
  Command: createToken({ name: "Command", pattern: commandRegex }),
  Params: createToken({ name: "Params", pattern: /[A-Z]*{/ }),
  Var: createToken({ name: "Var", pattern: /[A-Z]/ }),
  Comma: createToken({ name: "Comma", pattern: /,/, label: "," }),
  Space: createToken({ name: "Space", pattern: / / }),
  Newline: createToken({ name: "Newline", pattern: /\n/ }),
};

const lexer = new Lexer(Object.values(tokens));

class JaptParser extends CstParser {
  constructor() {
    super(tokens, { recoveryEnabled: true });
    this.performSelfAnalysis();
  }
  // public program = this.RULE("program", () => {
  //   this.SUBRULE(this.expression);
  // });
  public program = this.RULE("program", () => {
    this.MANY_SEP({
      SEP: tokens.Newline,
      DEF: () => this.SUBRULE(this.expression),
    });
  });
  public expression = this.RULE("expression", () => {
    this.OPTION({ DEF: () => this.SUBRULE(this.literal) });
    this.MANY({ DEF: () => this.SUBRULE(this.command) });
  });
  public literal = this.RULE("literal", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.StringLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberLiteral) },
      { ALT: () => this.CONSUME(tokens.Var) },
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.SUBRULE(this.fn) },
    ]);
  });
  public array = this.RULE("array", () => {
    this.CONSUME(tokens.LSquare);
    this.MANY_SEP({
      SEP: tokens.Space,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(tokens.RSquare);
  });
  public command = this.RULE("command", () => {
    this.CONSUME(tokens.Command);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(tokens.Space);
  });
  public fn = this.RULE("fn", () => {
    this.CONSUME(tokens.Params);
    // this.CONSUME(tokens.LCurly);
    this.SUBRULE(this.expression);
    this.CONSUME(tokens.RCurly);
  });
}

const parser = new JaptParser();

export const productions = parser.getGAstProductions();

export function parse(source: string) {
  const lexResult = lexer.tokenize(source);
  parser.input = lexResult.tokens;
  const cst = parser.program();
  return {
    cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
}

// console.log(
//   // JSON.stringify(parseJapt(`100oZ{[Z ]} `), null, 2)
//   JSON.stringify(parseJapt(`"abc"a5o  b `), null, 2)
// );
