/**
 * 2. 接口 - 为类型命名和为你的代码或第三方代码定义契约
 */

// 2.1 接口
function printLabel (obj: {label: string}) : void {
  console.log(obj.label);
}
let myObj = {
  size: 10,
  label: 'hello '
}
printLabel(myObj);

// 接口重写
interface LabeldValue {
  label: string;
  color?: string; // 可选属性：对可能存在的属性预定义；可以捕获引用了不存在的属性时的错误; 使用了--strictNullChecks,可选参数会被自动地加上【 | undefined】
  readonly x: number; // 只读属性：只能在对象创建的时候修改其值
  [propName: string]: any; //索引签名：这里表示可以有任意数量的属性
}
function printLabel2 (obj: LabeldValue) {
  console.log(obj.label);
}
let myObj2: LabeldValue = {
  label: 'world',
  x: 1
}
// myObj2.x = 2; // error 只读属性
printLabel2(myObj2); // 只要传入的对象满足必要条件（含有label属性）就被允许
// printLabel2({a: 1}); // error


// TypeScript具有 ReadonlyArray<T> 类型，它与 Array<T> 相似，只是把所有可 变方法去掉了，因此可以确保数组创建后再也不能被修改：
let readonlyArr: ReadonlyArray<number> = [1, 2, 3];
let numberArr: Array<number> = [5, 6, 7];
// readonlyArr[1] = 10; // error
// numberArr = readonlyArr; // error
numberArr = readonlyArr as number[]; // 类型断言重写ok

// 使用接口表示函数类型
interface SearchFunc {
  (source: string, subString: string): boolean; // 调用签名
}
let mySearch: SearchFunc;
mySearch = function (a) { // a,b 会进行类型推断; 参数数量可以少，不能多
  // return ''; // error
  return true
}

// 使用接口描述可索引的类型，入a[]，ageMap['daniel']
interface StringArray {
  [index: number]: string; // 索引签名：描述了对象索引的类型，还有相应的索引返回值类型
}
let myArray: StringArray;
myArray = ['a', 'b'];
myArray = {
  // a: 1, // error
  1: 'a',
  2: 'b'
}
// Typescript支持字符串和数字索引签名。
// 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引的子类型，
// 因为当使用number来索引时，JavaScript会将它转换成string再去索引对象
class Animal {
  name: string;
  constructor (public n: string) {
    this.name = n;
  }
}
class Dog extends Animal {
  breed: string;
  constructor (b: string, name: string) {
    super(name);
    this.breed = b;
  }
}

interface NotOkay {
  // [x: number]: Animal; // error
  // [x: string]: Dog;
  [x: number]: Dog; // ok number索引返回必须相同或为string索引子类型
  [x: string]: Animal;
  // name: string; // error：与上面string索引返回值冲突
  name: Dog; // OK
}
// 只读索引签名，防止给索引赋值
interface RaadonlyStringArray {
  readonly [index: number]: string;
}
let arr3: RaadonlyStringArray = ['a', 'b'];
// RaadonlyStringArray[0] = 'new a '; // error

// 使用接口描述类类型
interface ClockInterface { // 为实例方法所用
  currentTime: Date;
  setTime(d: Date): void;
  // new(hour: number, minute: number); //error
}
class Clock implements ClockInterface {
  currentTime: Date = new Date(); // 直接赋值
  // 类具有2个类型：静态部分的类型、实力的类型
  // 当一个类实现了一个接口时，只对其实例部分进行类型检查
  // constructor存在于类的静态部分，所以不在检查范围
  constructor(hour: number, minute: number) {}
  setTime(d: Date): void {
    this.currentTime = d;
  }
}

// 检查构造函数
interface ClockConstructor { // 为构造函数所用
  new (hour: number, minute: number): ClockInterface;
}
function createClock(Clock: ClockConstructor, hour: number, minute: number): ClockInterface {
  // a. 这里会检查传入的Clock是否符合构造函数签名
  return new Clock(hour, minute)
}
class DigitalClock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date): void {}
  constructor(hour: number, minute: number, s: number) {}
}
class AnalogClock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date): void {}
  constructor(hour: number, minute: number) {}
}

// let digital = createClock(DigitalClock, 10, 12); // error: DigitalClock构造函数有3个参数，不符合ClockConstructor
let analog = createClock(AnalogClock, 10, 12); // ok 

// b. 使用类表达式检查构造函数
const Clock2: ClockConstructor = class Clock2 implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date): void {}
  constructor(hour: number, minute: number) {} // 这里需要满足ClockConstructor
}

// 继承接口
interface Shape {
  color: string;
}
interface Square extends Shape {
  sideLength: number;
}
let square = <Square>{}; //泛型写法,与let s: Square = {...}相比不用设置初始值
square.color = 'red';
square.sideLength = 10;

// 用接口描述混合类型
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
function getCounter(): Counter {
  let counter = <Counter>function (start: number): string {
    counter.interval += start;
    return counter.interval.toFixed(2);
  }
  counter.interval = 0;
  counter.reset = function () {
    counter.interval = 0
  }
  return counter
}
const c1 = getCounter();
console.log('counter.interval = ', c1(20));
c1.reset();
c1.interval = 10;
console.log('counter.interval = ', c1(20));

// 接口继承类：当接口继承了一个类类型时，它会继承类的成员但不包括其实现；接口同样会继承到类的private和protected成员
class Control {
  private state: any; // 私有成员
}
interface SelectableContril extends Control { // 只能Control的子类才能实现此接口
  select(): void;
}
class Button extends Control implements SelectableContril {
  select(): void {}
}
class TextBox extends Control {
  select(): void {};
}
// class Image implements SelectableContril { // error
//   select(): void {}
// }
