/**
 * 15. 高质量声明文件 - 声明
 */


// 1. Objects with Properties - 全局对象变量声明用namespace
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}

// 2. Overloaded Functions - 函数重载
declare function getWidget(n: number): number;
declare function getWidget(s: string): number[];

// 3. Reusable Types (Interfaces) 复用类型 - 接口
interface GreetingSettings {
  greeting: string,
  duration?: number,
  color?: string
}
declare function greet(setting: GreetingSettings): void;

// 4. Reusable Types (Type Aliases) 复用类型 -  类型别名
type GreetingLike = string | (() => string) | MyGreeter
declare function greet2(g: GreetingLike): void

// 5. Organizing Types - 组织类型
declare namespace GreetingLib.options {
  interface log {
    verbose: boolean
  }
  interface alert {
    modal: boolean,
    title?: string,
    color?: string
  }
}

// 6. classes
// declare class MyGreeter {
//   constructor(greeting: string);

//   greeting: string;
//   showGreeting(): void;
// }


/**
 * 举例书写声明文件
 */

declare var foo2:number; // 声明全局变量，也可以用let如果变量用户有块级作用域
declare const FOO: number; // 只读

declare function greet3(greeting: string): void; // 声明全局函数

declare namespace myLib2 { // 声明带属性的对象，namespace描述用点表示法访问的类型或值，声明模块(declare module 'xx')需要export关键字声明导出的成员
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}

interface GreetingSettings2 { // 声明可重用类型-interface
  greeting: string;
  duration?: number;
  color?: string
}

type GreetingLike2 = string | number; // 类型别名

declare function getWidget2(n: number): GreetingSettings2;
declare function getWidget2(s: string): GreetingSettings2[]; // 函数重载

declare class GreeterLib { // 声明一个类或像类一样的对象
  constructor(greeting: string);
  private greeting: string;
  showGreeting(): void;
  abstract notice(): void; //抽象方法，要子类实现
}
declare class GreeterLibChild extends GreeterLib {
  notice(): void;
}

