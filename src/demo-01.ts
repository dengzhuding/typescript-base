/**
 * 1. 基础类型 & 变量声明
 */

let isDone: boolean = false;
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o711; // 八进制
let decLiteral: number = 6; // 十进制
let hexLiteral: number = 0xf00d; // 十六进制
let str: string = 'hello';
str = `${str} world!`;
let arr: number[] = [1, 2, 3]; // 元素类型接[]表示数组
let arr2: Array<string> = ['a', 'b']; // 数组泛型， Array< 元素类型

// 元组类型Tuple允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
let x: [string, number];
x = ['abcde', 2];
console.log(x[0].substring(1)); // 当访问一个已知索引的元素，会得到正确的类型
// x[3] = 'cc'; //error

// 联合类型用 | 隔开
let y: number | string;
y = 1;
y = 2;
// y = true; // error

// enum枚举类型
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
let colorName: string = Color[3];
console.log(`c: Color = ${c}, colorName: string = ${colorName}`)

// any任意类型
let noSure: any = 10;
noSure.toFixed(2); // success

// void空类型-表示没有任何类型,只能赋值为undefined或null，当函数没有返回值时用到
let f1 = function (): void {}
let unusable: void = f1();
unusable = undefined;
// unusable = 1; //error

// undefined类型 null类型，默认情况下undefined和null是所有类型的子类型，就是说可以把undefined和null赋值给number等类型的变量
// 然而，当指定了--strictNullChecks标记，null和undefined只能赋值给void和它们自身
let xx: undefined;
xx = undefined;
// str = xx; // 开启--strictNullChecks标记：error-不能将类型“undefined”分配给类型“string”; strictNullChecks = false 不报错
unusable = xx; // 任何时候都可以将undefined赋值给void类型

// never类型标识的是那些永不存在的值的类型
function error(msg: string): never {
  throw new Error(msg);
}
function infiniteLoop (): never {
  while (true) {}
}

// object类型-表示非原始类型（number,string,boolean,null,undefined）
// declare function create(o: object | null): void // declare意味着您永远不打算为该变量提供值（意味着它是在typescript编译器看不到的地方定义的）
function create (o: object | null) {}
create(null);

// 类型断言: 1. 尖括号语法（<type>someValue）; 2. as语法（someValue as type）
let someValue: any = 'hello world'; // 这里系统推断为any类型
let strLen: number = (someValue as string).length; // 使用类型断言方便使用.length方法
strLen = (<string>someValue).length;

// let, const（赋值后不能改变，object的属性可变） - 块级作用域（{}包裹区域），不能重复声明，在声明之前不能读写（声明之前属于暂时性死区）
// var - 声明可以再包含它的函数，模块，命名空间或全局作用域内部任何位置被访问（函数作用域）
// notDeclared = 1; // error
let notDeclared: number;
// let notDeclared: number; // error: 重复声明

for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log('use [var] i:', i); // 期望0 1 2 ...9, 实际打印10 10 10 ...10
  }, 100 * i);
}
// 对于上面问题，可以使用闭包解决
for (var i = 0; i < 10; i++) {
  (function (k) {
    setTimeout(() => {
      console.log('use 闭包 i:', k); // 实际打印0 1 2 ...9
    }, 100 * k);
  })(i) // 闭包生成新的函数作用域
}
// 用let直接解决
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log('use [let] i:', i); // 期望0 1 2 ...9, 实际打印0 1 2 ...9
  }, 100 * i);
}

// 解构，...剩余变量语法
let input: number[] = [1, 2];
let {length: len}: {length: number} = input; // 结构对象len = input.length 
input.push(3);
input.push(4);
let [first, second] = input;
function f2([first, second, ...others]: number[]) {
  console.log('结构数组成员: ', first, second, others);
}
f2(input);
function f3({length}: number[]) {
  console.log('结构对象属性length: ', length)
}
f3(input);

// 默认值( = ) - 让你在属性未undefined时使用缺省值; 允许缺失( ? )
// 解构表达式要尽量保持小而简单
function f4(obj: {a: string, b?: number}): void {
  const {a, b = 100} = obj; // b缺失时默认未100
  console.log(`a: ${a}, b: ${b}`);
}
f4({a: 'hello'});

// 展开操作符（...） - 将一个数组展开未另一个数组，或将一个对象展开未另一个对象
let a1 = [1, 2], a2 = [3, 4];
let o1 = {o: 'oo'}, o2 = {p: 'pp'};
let a3 = [0, ...a1, ...a2];
let o3 = {
  ...o1,
  ...o2,
  p: 'qq' // 出现在展开对象后面的属性会覆盖前面的属性；展开对象时，仅包含对象自身的可枚举属性
}
console.log('展开符：');
console.dir(a3);
console.dir(o3);

