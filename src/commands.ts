export interface Wrapper<T> {
  unwrap(): T;
}
export class F implements Wrapper<(...args: any[]) => any> {
  constructor(public fn: (...args: any[]) => any) {}
  unwrap() {
    return this.fn;
  }
  call(...args: any[]) {
    return this.fn(...args);
  }
}
export class A implements Wrapper<Wrapper<any>[]> {
  constructor(public arr: Wrapper<any>[]) {}
  unwrap() {
    return this.arr.map((x) => x.unwrap());
  }
  /**
   * @signature `A.m(f (x,n,a) -> x) -> A`
   * @description Map each element of `A` through `f`
   */
  m(f: F) {
    return new A(this.arr.map((...a) => f.call(...a)));
  }
  /**
   * @signature `A.q(s) -> S`
   * @description Join `A` by `s`
   */
  q(s: S = $S("")) {
    return $S(this.arr.join(s.unwrap()));
  }
}
export class S implements Wrapper<string> {
  constructor(public str: string) {}
  unwrap() {
    return this.str;
  }
  /**
   * @signature `S.q(s) -> A`
   * @description Split `S` by `s`
   */
  q(s: S = $S("")) {
    return $A(this.str.split(s.unwrap()).map($S));
  }
}
export class N implements Wrapper<number> {
  constructor(public num: number) {}
  unwrap() {
    return this.num;
  }
}
export const $F = (fn: (...args: any[]) => any) => new F(fn);
export const $A = (arr: any[]) => new A(arr);
export const $S = (str: string) => new S(str);
export const $N = (num: number) => new N(num);
