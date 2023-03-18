export interface Wrapper<T> {
  unwrap(): T;
}
class F implements Wrapper<(...args: any[]) => any> {
  constructor(public fn: (...args: any[]) => any) {}
  unwrap() {
    return this.fn;
  }
  call(...args: any[]) {
    return this.fn(...args);
  }
}
class A implements Wrapper<any[]> {
  constructor(public arr: Wrapper<any>[]) {}
  unwrap() {
    return this.arr.map((x) => x.unwrap());
  }
  m(fn: F) {
    return new A(this.arr.map((...a) => fn.call(...a)));
  }
  q(str: S) {
    return this.arr.join(str.unwrap());
  }
}
class S implements Wrapper<string> {
  constructor(public str: string) {}
  unwrap() {
    return this.str;
  }
}
class N implements Wrapper<number> {
  constructor(public num: number) {}
  unwrap() {
    return this.num;
  }
}
export const $F = (fn: (...args: any[]) => any) => new F(fn);
export const $A = (arr: any[]) => new A(arr);
export const $S = (str: string) => new S(str);
export const $N = (num: number) => new N(num);
