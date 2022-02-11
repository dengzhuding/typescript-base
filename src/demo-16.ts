/**
 * 16. 声明文件原理
 * 
 * 类型通过以下方式引入(会创建一个新的类型名称)：
 *   1. 类型别名声明(type sn = number | string;) 
 *   2. 接口声明(interface I { x: number[]; }) 
 *   3. 类声明(class C { }) 
 *   4. 枚举声明(enum E { A, B, C }) 
 *   5. 指向某个类型的 import 声明(import {interf} from 'xx')
 * 
 * 值是运行时名字，可以在表达式里引用，以下方式能创建值：
 *   1. let, const, var声明
 *   2. 包含值的命名空间namespace或模块module声明
 *   3. enum声明
 *   4. class声明
 *   5. 指向值的import声明(import {val} from 'xx')
 *   6. function声明
 * 
 * 命名空间-可以包含类型:
 *   1. 使用namespace声明能创建命名空间
 */

/**
 * 一个给定的名字A,可以找出3中不同的意义：类型，值，命名空间，要如何去解析这个名字要看它所在的上下文是怎样的
 * 如：let m: A.A = A 首先被当做命名空间，然后做为类型名，最后是值。
 */
namespace A {
  export let name: string;
  export interface A { // 导出才能使用.获取类型
    name: string;
  }
}
let m: A.A = A;
console.dir(m); // {}
m = {
  name: 'hello'
}
console.dir(m); // {name: 'hello'}

/**
 * 内置组合 - class 创建了类型(指向了类的实例结构)和值(指向类构造函数)
 */
namespace B {
  export class BaseB {}
}
let b: B.BaseB = new B.BaseB(); // 这里BaseB既可以用作类型，也能作为值使用

import {Bar} from './demo-16-foo';
// let x: Bar = Bar.a; // ok,但是执行会报错，因为Bar作为值是undefined - Bar用作类型和值，./demo-16-foo被编译了
let x: Bar = { // 这里仅仅使用了类型，./demo-16-foo不会被编译
  count: 1
}
console.log(x.count); // 1


/**
 * 高级组合 - 只要不产生冲突就是合法的
 * 一个普通的规则是：
 *   1. 值总是会和同名的其它值产生冲突，除非它们在不同命名空间里
 *   2. 类型冲突则发生在使用类型别名声明的情况下 （ type s = string ）
 *   3. 命名空间永远不会发生冲突
 */
interface Foo {
  x: number;
}
interface Foo {
  // x: string; // error: 后续属性声明必须属于同一类型
  y: string;
}
class Foo {
  // x: boolean; // error: 后续属性声明必须属于同一类型
  constructor(public name: string) {}
  getName (): string {
    console.log('执行了Foo的实例的getName方法, 即Foo.prototype.getName方法')
    return this.name;
  }
}
let f1: Foo = {
  x: 0,
  y: '',
  name: '',
  getName: function (): string {
    return ''
  }
}
let f2: Foo = new Foo('Bob');
console.log(f2.x, f2.y, f2.getName()); // undefined undefined Bob

type s = {
  a: string
};
// 注意不能使用接口往类型别名里添加成员
// interface s {} // error: 标识符“s”重复

// namespace声明可以用来添加新类型，值和命名空间，只要不出现冲突
namespace Foo {
  export let x: string; // 这里添加值到Foo的静态部分（构造函数的属性）
  export function getName() {
    console.log('执行了Foo.getName方法')
  }
  export interface Foo {
    d: string
  }
}

let f3 = Foo.x;
Foo.getName(); // ok

let f4: Foo.Foo = {d: 'hello'}; // 这里用了命名空间里面的类型Foo，不会发生冲突
let f5: Foo = { // 这里用了类型Foo
  x: 0,
  y: '',
  name: '',
  getName: function (): string {
    throw new Error('Function not implemented.');
  }
}
let f6 = new Foo('f6'); // 这里用来Foo值,即class Foo

/**
 * export = 和 import module = require("module")
 * 
 * CommonJS 和 AMD 通常都有一个导出对象(exports)的概念，它包含一个模块的所有导出，es6的默认导出(export default)可以替代全部导出行为，
 * 然而这两者不能兼容（即使用了exports.xx 或module.exports = xx就不能使用es6的export {xx},export let xx =和export dafault xx 语法）
 * export = 语法指定从模块导出单个对象。 这可以是类、接口、命名空间、函数或枚举。
 */
// import zip = require('./demo-16-ZipCodeValidator'); // ok
// import {ZipCodeValidator as zip} from './demo-16-ZipCodeValidator'; // error: 仅可使用 "import zip = require("xx)" 或默认导入来导入
import zip from './demo-16-ZipCodeValidator'; // ok
let validator = new zip();
console.log(validator.isAcceptable('12542')); // true
console.log(validator.isAcceptable('dsfs')); // false
