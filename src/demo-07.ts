/**
 * 7. 高级类型
 */

// 7.1 交叉类型（Intersection Types） - 将多个类型合并为一个类型
// 用【&】合并
interface Animal2 {
  height: number,
  weight: number
}
interface People {
  name: string
}
let info: Animal2 & People = {
  height: 170,
  weight: 120,
  name: 'Dina'
};

// 实现混入
function extend<First, Second> (first: First, second: Second): First & Second {
  const result: Partial<First & Second> = {}; // Partial类型 - 将T中所有属性可选
  for (const key in first) {
    if ((first as Object).hasOwnProperty(key)) {
      (<First>result)[key] = first[key];
    }
  }
  for (const key in second) {
    if ((second as Object).hasOwnProperty(key)) {
      (<Second>result)[key] = second[key];
    }
  }
  console.log(first, second);
  return <First & Second>result;
}
class Person {
  constructor(public name: string) {}
}
interface Loggable {
  log(name: string): void
}
class LogConsole implements Loggable {
  log(name: string): void {
    console.log(name);
  }
}
// const p = extend(new Person('Jarry'), LogConsole.prototype); // LogConsole.prototype里面的log不可枚举（用Object.getOwnPropertyDescriptor查看enumerable - false)
const p = extend(new Person('Jarry'), {log: LogConsole.prototype.log});
p.log(p.name);

// 7.2 联合类型 - 表示一个值可能是几种类型之一 (类似或运算)
// 用【|】合并
// 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}
class LayEggs {
  layEggs(): void {
    console.log('peyt is laying eggs.')
  }
}
class MyFish extends LayEggs implements Fish {
  swim(): void {
    console.log('peyt is swimming.')
  };
}
class MyBird extends LayEggs implements Bird {
  fly(): void {
    console.log('peyt is flying.')
  };
}
function getSmallPet(): Fish | Bird {
  return Math.random() > 0.5 ? new MyFish() : new MyBird();
}
let pet =  getSmallPet();
pet.layEggs(); // ok
// pet.fly; // error: 只能访问所有类型的共有的成员
function getSmallPet2(): Fish & Bird {
  return <Fish & Bird>{}
}
let pet2 =  getSmallPet2();
pet2.fly; // ok
pet2.layEggs; // ok
pet2.swim; // ok - 交叉类型可以访问所有类型的全部成员

// 7.3 类型守卫与类型区分（Type Guards and Differentiating Types ）
// Typescript类型守卫机制: 类型守卫就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型
// 返回值是一个类型谓语(parameterName is Type),parameterName必须是来自当前函数签名里的一个参数名
function isFish(pet: Fish | Bird): pet is Fish { 
  return (<Fish>pet).swim !== undefined;
}
if (isFish(pet)) { // 将变量缩减为那个具体的类型(Fish)
  pet.swim(); // ok
} else {
  pet.fly(); // ok
}

// 7.4 typeof 类型守卫 - Typescript可以将【typeof x === 'number'】这种识别为一个类型守卫
function handlePaddinf(padding: string | number) {
  if (typeof padding === 'number') {
    console.log(padding.toFixed(2)); // 自动识别为number,可以调用相关方法
  } else {
    console.log(padding.split(' '));
  }
}
handlePaddinf(10);
handlePaddinf('hello world !');

// 7.5 instanceof类型守卫 - 是通过构造函数来细化类型的一种方式
// instanceof操作符：用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上
// 如：arr instanceof Array - true
if (pet instanceof MyFish) {
  pet.layEggs(); // ok
} else if (pet instanceof MyBird) {
  pet.fly();
}


// 7.6 可以为null的类型
// 默认情况下，类型检查器认为null与undefined可以赋值给任意类型
// 使用类型断言手动去除null和undefined: 语法是添加【!】后缀，如name!从name的类型里面去除null和undefined
function fixedStr (name: string | null) {
  // name.substring(0); // error: 对象可能为 "null"
  // return name?.substring(0); // ok
  function postFix(epithet: string) {
    // let result = name.charAt(0) + ' .the ' + epithet; // error: 编译器无法去除嵌套函数的null(除非是立即调用的函数表达式)
    let result = name!.charAt(0) + ' .the ' + epithet; // ok - 这里明确知道name已经不是null了，用!断言非空
    return result;
  }
  name = name || 'Bob'; // 这里会去除null类型
  return postFix(name);
}
console.log(fixedStr(null));
console.log(fixedStr('Jarry'));

// 7.7 类型别名 - 给一个类型起个新名称(使用【type】关键字)
// 可以作用于原始值，联合类型，元组以及任何其它你需要手写的类型
// 起别名不会新建一个类型 - 它创建了一个新名字来引用那个类型 
type Name = string; // 给原始值起别名通常，没什么用
type NameFunc = () => string; // 函数类型别名
type NameAll = Name | NameFunc; // 联合类型
type PetAll = Fish & Bird; // 交叉类型命名
type LinkedList<T> = T & { next?: T }; // 泛型别名
let bob: LinkedList<Person> = new Person('Bob');
bob.next = new Person('Jou');
console.log('bob.next.name: ', bob.next.name);
type Tree<T> = { // 在属性里引用自己
  value: T;
  left: Tree<T>;
  right: Tree<T>;
}
// type Yikes = Yikes; // error：类型别名“Yikes”循环引用自身
type Yikes2 = Array<Yikes2>; // ok, 但是只能赋值为下面这种值
let yikes: Yikes2 = [[[]]];

// 7.8 接口 vs 别名
// a. 接口创建了一个新的名字，可以在其它任何地方使用；类型别名并不创建新名字—比如，错误信息就不会使用别名
// b. 类型别名不能被 extends 和 implements （自己也不 能 extends 和 implements 其它类型）
// c. 另一方面，如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名
type Alias = {
  num: number
}
interface Interface {
  num: number
}
declare function aliased(arg: Alias): Alias; // 移到Alias上，显示的是对象字面量类型
declare function interfaced(arg: Interface): Interface; // 移到Interface上，显示：interface Interface

// 7.9 字符串字面量类型
type Easing = 'ease-in' | 'wase=out' | 'ease-in-out';
class MyUIElement {
  animate(dx: number, dy: number, easing: Easing) {} // 指定字符串必须的固定值
}
function createElement(tagName: 'img'): HTMLImageElement; // 区分函数重载
function createElement(tagName: 'input'): HTMLInputElement;
function createElement(tagName: string): Element {
  return document.createElement(tagName);
}

// 7.10 数字字面量类型别名
type MyNumber = 1 | 2 | 3;

// 7.11 枚举成员类型
enum EasyType {
  EaseIn,
  EaseOut,
  EaseInOut
}
type MyEnum = EasyType.EaseIn;
let num2: MyEnum = EasyType.EaseIn;

// 7.12 可辨识联合
interface A1 { key: 'a1' }; // key - 可辨识的特征或标签
interface A2 { key: 'a2' };
interface A3 { key: 'a3' };
interface A4 { key: 'a4'}
type A = A1 | A2 | A3 | A4;
function assertNever(a: never): never {
  throw new Error('Unexpected object:' + a);
}
function chooseA(a: A) {
  switch (a.key) {
    case 'a1': return a.key; // a推断为A1类型
    case 'a2': return a.key; // a推断为A2类型
    case 'a3': return a.key; // a推断为A3类型
    case 'a4': return a.key;// 假如忘记a4的case识别
    // 下面使用never类型，编译器用它来进行完整性检查：如果多了一个未处理的A4类型，会报错提示
    default: return assertNever(a);
  }
}
chooseA({ key: 'a1' }); // ok
chooseA({ key: 'a4' }); // ok

// 7.13 多态的this类型 - 表示的是某个包含类或接口的子类型，这被称作F-bounded多态性，很容易的表现连贯接口间的继承
// 计算器例子
class BaseCalculator {
  constructor (protected value: number) {}
  getCurrentValue(): number {return this.value;};
  add (num: number): this {
    this.value += num;
    return this
  };
  multiply(operand: number): this {
    this.value *= operand;
    return this
  }
}
class ScientificCalculator extends BaseCalculator {
  constructor(value: number) {
    super(value);
  }
  sin() {
    this.value = Math.sin(this.value);
    return this
  }
}
let s = new ScientificCalculator(2);
console.log('calc value: ', s.multiply(5).sin().add(1).getCurrentValue().toFixed(2)); // 打印：calc value:  0.46

// 7.14 索引类型（Index types） - 使用索引类型，编译器就能够检查使用了动态属性名的代码
// keyof T - 索引类型查询操作符，对于任何类型T,keyof T的结果为T上已知的公共属性名的联合
// K extends T - 表示k是T的子类型（下面这里表示K是keyof T的别名）
// T[K]    - 索引访问操作符(下面表示T里面成员的值的类型，如obj:{name: 's'}, T[K]表示''的类型string)
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][]{
  return keys.map(key => {
    return obj[key]
  })
}
let obj = {name: '1', val: '2'}
console.dir(pluck(obj, ['val'])); // 打印: ["2"]
function getProperty2<T, K extends keyof T> (obj: T, key: K): T[K] {
  return obj[key];
}
console.log(getProperty2(obj, 'val')); // 打印：2
interface Directionary<T> {
  [key: number]: T;
}
let keys: keyof Directionary<string>; // number类型
let values: Directionary<string>[0]; // string类型
interface Directionary2<T> {
  [key: string]: T;
}
let keys2: keyof Directionary2<number>; // string | number类型
let values2: Directionary2<number>[0]; // ok - number类型, 数字键访问会转为字符串
let values3: Directionary2<number>['foo']; // number类型

// 7.15 映射类型 - 是Typescript提供的从旧类型中创建新类型的一种方式
// 在映射类型里，新类型以相同的形式去转换旧类型里每个属性; 
type MyReadonly<T> = { // 成员类型转为只读 - 标准库直接用Readonly<T>
  readonly [P in keyof T]: T[P];
}
type MyPartial<T> = { // 成员类型转为可选 - 标准库直接用Partial<T>
  [P in keyof T]?: T[P];
}
type MyPick<T, K extends keyof T> = { // 从type中选择一组属性来构造一个新类型 - 标准库直接用Pick<type, keys>
  [P in K]: T[P];
}
type Nullable<T> = { // 成员类型允许为null
  [P in keyof T]: T[P] | null;
}
type MyRecord<K extends keyof any, T> = { // 属性键位keys类型,属性值为type类型 - 标准库直接用Record<Keys, Type>
  [P in K]: T;
}
type ThreeStringProps = MyRecord<'prop1' | 'prop2' | 'prop3', number>;
let threeStringProps: ThreeStringProps = {
  prop1: 0,
  prop2: 0,
  prop3: 0
}
type PersonPartial = MyPartial<Person>;
type PersonReadonly = MyReadonly<Person>;
let readonlyPerson: PersonReadonly = new Person('Bob');
// readonlyPerson.name = 'ss'; // error: 只读属性
// 注意这个语法描述的是类型而非成员，如果向添加额外的成员，可以使用交叉类型
type MyPartialNewMember<T> = {
  [P in keyof T]?: T[P];
  // newMember: boolean; // error: 映射的类型可能不声明属性或方法
} & { newMember: boolean } // 使用交叉类型，不能直接放到映射里面
// 代理功能例子
type MyProxy<T> = {
  _value: T;
  get(): T;
  set(value: T): void;
};
type MyProxyify<T> = { // 转为访问器属性
  [K in keyof T]: MyProxy<T[K]>; // T<K>被包装在MyProxy<T>里面,为了兼容赋值语句加了【|T[K]】
};
function myProxyify<T>(obj: T): MyProxyify<T> { // 实现
  let result = {} as MyProxyify<T>;
  // type V = T[keyof T]; // 成员值的类型
  type V = T[Extract<keyof T, string>] // 成员值的类型
  for (const key in obj) {
    const proxy: MyProxy<V> = {
      _value: obj[key],
      get: function (): V {
        console.log('访问了get函数')
        return proxy._value;
      },
      set: function (value: V): void {
        console.log('访问了set函数: ', value)
        proxy._value = value;
      }
    }
    // Object.defineProperty(result, key, proxy); // 不设置访问器属性
    result[key] = proxy; // 仅仅使用对象
  }
  return <MyProxyify<T>>result;
}
function unProxyify<T>(t: MyProxyify<T>): T { // 拆包
  let result = {} as T;
  for(const key in t) {
    result[key] = t[key].get();
  }
  return result;
}
let tObj = {
  prop1: 1,
  prop2: 'hello',
  prop3: true
}
console.dir(tObj);
let tProxyifyObj = myProxyify(tObj);
tProxyifyObj.prop3.set(false);
console.dir(tProxyifyObj);
console.dir(unProxyify(tProxyifyObj));

// 7.16 有条件类型 - Typescript2.8引入了有条件类型，它能够表示非统一的类型
// T extends U ? X : Y - 若T能够赋值给U，那么类型是X,否则为Y
type Z = true extends boolean ? string : number; // string
type TypeName<T> = 
  T extends string ? "string":
  T extends number ? "number":
  T extends boolean ? "boolean":
  T extends undefined ? "undefined":
  T extends Function ? "Function":
  "object";
type T0 = TypeName<number>; // "number"
type T1 = TypeName<null>; // "object"

// 7.17 分布式有条件类型
// 如果有条件类型里待检查的类型是 naked type parameter ，那么它也被称为“分 布式有条件类型”。 
// 分布式有条件类型在实例化时会自动分发成联合类型。 
// 例如， 实例化 T extends U ? X : Y ， T 的类型为 A | B | C ，会被解析为 (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y) 
type T2 = TypeName<string | number>; // "string" | "number"
// 7.17.1 过滤联合类型
type Diff<T, U> = T extends U ? never : T; // 从 T 中删除可分配给 U 的类型
type Filter<T, U> = T extends U ? T : never; // 从 T 中删除不可分配给 U 的类型
type MyNonNullable<T> = Diff<T, null | undefined>; // 从 T 中移除null 和undefined，标准库已经实现-NonNullable

type MyU = number | string | undefined;
type T3 = Diff<MyU, string>; // number | undefined
type T4 = Filter<MyU, string>; // string
type T5 = MyNonNullable<null | string>; // string

// 7.17.2 有条件类型与映射类型结合
type TPart = {
  p1: string,     // 值不为函数
  p2: () => void, // 值为函数
  p3: () => void  // 值为函数
}

type FunctionPropertyNames<T> = { // 返回值是函数的键的名称组成的联合类型
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]; // [keyof T] -索引访问操作符
type T6 = FunctionPropertyNames<TPart>; // "p2" | "p3"

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>; // 返回值是函数的新类型
type T7 = FunctionProperties<TPart>; // {p2: () => void, p3: () => void}

type NonFunctionPropertyNames<T> = { // 返回值不是函数的键的名称组成的联合类型
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];
type T8 = NonFunctionPropertyNames<TPart>; // "p1"

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>; // 返回值不是函数的新类型
type T9 = NonFunctionProperties<TPart>; // {p1: string;}
// 与联合类型和交叉类型相似，有条件类型不允许递归地引用自己。比如下面的错 误。 例子 - 不知道为啥没报错
// type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // Error
 
// 7.17.3 有条件类型中的类型推断
// 现在在有条件类型的 extends 子语句中，允许出现 infer 声明，它会引入一个 待推断的类型变量。
// 这个推断的类型变量可以在有条件类型的true分支中被引用。 允许出现多个同类型变量的 infer

type MyReturnType<T> = // 获取函数类型的返回类型,标准库以实现- ReturnType<T>
T extends (...arg: any[]) => infer R ? R : any; // R - 待推断的类型变量
declare function f3(): {a: number, b: string};
type f2ReturnTtpe = MyReturnType<typeof f3>; // {{a: number, b: string}

type Unpacked<T> = 
  T extends (infer U)[] ? U: // 匹配到数组 - U[]，返回U类型
  T extends (...arg: any[]) => infer U ? U : // 匹配到函数,返回返回值类型
  T extends Promise<infer U> ? U: // 匹配到Promise类型，返回传入的类型变量类型
  T;
type T10 = Unpacked<number[]>; // number
type T11 = Unpacked<Promise<string>>; // string
type T12 = Unpacked<boolean>; // boolean - 未匹配到，返回初始类型

// 下面的例子解释了在协变位置上，同一个类型变量的多个候选类型会被推断为联合 类型：
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never; // U - 协变位置
type T13 = Foo<{ a: string, b: string }>; // string 
type T14 = Foo<{ a: string, b: number }>; // string | number

// 相似地，在抗变位置上，同一个类型变量的多个候选类型会被推断为交叉类型：
type Bar<T> = T extends {a: (x: infer U) => void, b: (x: infer U) => void} ? U : never; // U - 抗变位置
type T15 = Bar<{a: (x: string) => void, b: (x: string) => void}>; // string
type T16 = Bar<{a: (x: string) => void, b: (x: number) => void}>; // string & number 也就是 never

// 当推断具有多个调用签名（例如函数重载类型）的类型时，用最后的签名（大概是 最自由的包含所有情况的签名）进行推断。 
// 无法根据参数类型列表来解析重载。 
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;
type T30 = ReturnType<typeof foo>; // string | number
// 无法在正常类型参数的约束子语句中使用 infer 声明： 
// type MyReturnType2<T extends (...args: any[]) => infer R> = R; // 错误，不支持 
// 但是，可以这样达到同样的效果，在约束里删掉类型变量，用有条件类型替换： 
type AnyFunction = (...args: any[]) => any; 
type ReturnType3<T extends AnyFunction> = 
  T extends (...args: any []) => infer R ? R : any; 

// 7.17.4 预定义的有条件类型 
/**
 * TypeScript 2.8在 lib.d.ts 里增加了一些预定义的有条件类型： 
 * Exclude<T, U> -- 从 T 中剔除可以赋值给 U 的类型。  
 * Extract<T, U> -- 提取 T 中可以赋值给 U 的类型。 
 * NonNullable<T> -- 从 T 中剔除 null 和 undefined 。 
 * ReturnType<T> -- 获取函数返回值类型。 
 * InstanceType<T> -- 获取构造函数类型的实例类型。
 */ 

/**
 * 实用工具类型
 * Partial<T> ，TypeScript 2.1 
 * Readonly<T> ，TypeScript 2.1 
 * Record<K,T> ，TypeScript 2.1 
 * Pick<T,K> ，TypeScript 2.1 
 * Exclude<T,U> ，TypeScript 2.8 
 * Extract<T,U> ，TypeScript 2.8 
 * NonNullable<T> ，TypeScript 2.8 
 * ReturnType<T> ，TypeScript 2.8 
 * InstanceType<T> ，TypeScript 2.8 
 * Required<T> ，TypeScript 2.8 
 * ThisType<T> ，TypeScript 2.8
 * 
 * 所有Api都可以从官网了解：https://www.typescriptlang.org/docs/handbook/
 */

