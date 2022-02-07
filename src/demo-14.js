/**
 * 14. javascript文件里的类型检查 & JSDoc
 * 
 */

import { type } from 'os';

// @ts-check -  在 JavaScript 文件中启用语义检查。必须在文件顶部

/** @type {number} */
let x;
x = 1;
// x = false; // error
export default x;

// 使用JsDoc提供类型信息

// 14.1 Types

/** @type {string} */
let s1 = '';

/** @type {(name: string) => boolean} */
let func1 = function(name) {return true}

/** @type {number | string} */
let one;
one = Math.random() > 0.5 || true ? 1 : '1';
/** @type {string} */
let one2 = /** @type {number} */ (one).toFixed(2); // 强制转换类型

/**
 * @param {import('./types/demo-14-types').Pet} p  - 参数使用导入类型
 * @param {string=} p2 - 可选参数(Google Closure syntax)
 * @param {string} [p3] - 可选参数(JSDoc syntax)
 * @param {string} [p4='test'] - 默认值参数
 * @return {boolean} - 返回类型returns 和return一样
*/
function walk(p, p2, p3, p4) {
  console.log(`Walking ${p.name}`);
  return true;
}

/** @typedef {import('./types/demo-14-types').Pet} Pet */ // 使用别名
/** @type {Pet} */
let pet = {
  name: 'Bob'
}

// 使用@typedof定义复杂类型
/**
 * @typedef {object} SpecialType
 * @property {string} prop1 - 属性prop1
 * @prop {number} [prop2] - 可选属性prop2
 */
/** @type {SpecialType} */
let obj1 = {
  prop1: ''
}

// @param 可实现类似上述效果
/**
 * @param {object} options
 * @param {string} options.prop1
 */
function special(options) {
  console.log(options.prop1);
}
special({prop1: 'hello world .'});

// @callback 和@typedef相似，但@callback指定函数类型
/** 
 * @callback Predicate
 * @param {number} p - 一个泛型参数
 * @returns {boolean}
 */
/** @type {Predicate} */
let func2 = function (p) {
  return true
}

// @template 声明类型参数
/**
 * @template T
 * @param {T} x
 * @returns {T}
 */
function id(x) {
  return x;
}
let result1 = id(1); // 返回number类型
let result2 = id(''); // 返回string类型

/**
 * @template {string} K - 约束K为字符串或字符字面量
 * @template {{serious(): string}} Seriousalizable 约束必须有serious方法
 * @param {K} key
 * @param {Seriousalizable} obj
 */
function seriousalize(key, obj) {}

// 14.2 Classes
class Base {
  /** @param {string} message */
  say(message) {
    console.log(message);
  }
}
/**
 * @typedef {{print: (msg: string) => void}} Print
 * @extends {Base} - 继承
 * @implements {Print} - 实现(这个标记只能附加到class)
 * 
 * @typedef {object} COptions
 * @property {string} name
 * @property {number} [age=18]
 */
class C extends Base {
  /** @param {COptions} options */
  constructor(options) {

    super();

    /** @public - 设置公共成员*/
    this.name = options.name;
    /** @private - 私有成员 - 只能内部访问 */
    this.age = options.age;
    /**
     * @protected - 受保护成员 -只能内部或子类访问
     * @type {number} - number类型
     * @readonly - 只读 只能在初始化阶段可写
     */
    this.prop3 = 1;
    this.prop3 = 2;
  }
  print() {}
  changeProp3 (/** @type {number} */num) {
    // this.prop3 = num; // error: 无法分配到 "prop3" ，因为它是只读属性
  }
  /** 
   * @override - 重写
   * @param {string} message
   */
  say(message) {
    console.log('C 重写了say方法：')
    super.say(message);
  }
  
}
const c1 = new C({name: 'Bob', age: 11});

/**
 * @constructor - 标记为构造函数
 * 
 * @param {COptions} options
 */
function CreateC(options) {
  this.name = options.name;
  this.print('init');
}
CreateC.prototype.print = function(/** @type {string} */msg) {
  console.log(msg);
}
const c2 = new CreateC({name: 'Bob', age: 11});
// const c3 = CreateC({name: 'Bob', age: 11}); // error: 是否希望包括 "new"(@constructor标记的作用)

/**
 * @this {HTMLElement} - 指定当前上下文
 * @param {MouseEvent} e 
 */
function callbackForLater(e) {
  this.scrollTop = e.clientX;
}

// 14.3 Documentation
/** @deprecated - 弃用标记 */
let aa = {}
aa = 1;

/**
 * @see Print - see允许您链接到程序中的其他名称
 * @type {Print}
 */
let printObj = new C({name: 'Marry'});
printObj.print('hello');

/**
 * 
 * @param {string} prefix
 * @returns Print {@link Print} - link和see很像，但是它可以在其他标签中使用
 */
function PrintFactory(prefix) {
  let print = function (/** @type {string} */msg) {
    console.log(`${prefix}: ${msg}`)
  }
  return {print}
}
let p = PrintFactory('today');
p.print('have a nice day.')

// 14.4 Other
/** @enum - 标记指定成员的对象字面量 */
const Status = {
  One: 1,
  Tow: 2
}
// @enum 与 TypeScript 的枚举完全不同，而且比 TypeScript 的枚举要简单得多。 然而，与 TypeScript 的枚举不同，@enum 可以有任何类型
/** @enum {function(number): number} */
const MathFuncs = {
  Add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1
}
console.log(`MathFuncs.Add1(10) = ${MathFuncs.Add1(10)}`);

/**
 * @description 返回字符串首字母
 * @param {string} str
 * @author dzd <2313@167.com>
 */
function getFirstStr(str) {
  return str.substring(0, 1);
}
console.log(getFirstStr('hello'));