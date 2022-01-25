/**
 * 10. 声明合并 - 指编译器将针对同一个名字的多个独立声明合并为单一声明
 * 
 * Typescript 中的声明会创建3中实体之一：
 *     Namespace - 包含了用.符号来访问名字
 *     Type      - 用声明的模型创建一个类型并绑定到给定的名字上
 *     Value     - 创建在JavaScript输出中看到的值
 */

// Declare Type    Namespace    Type    Value
// namespace       X                    X          - 命名空间声明会创建Namespace, Value
// Class                        X       X          - 
// Enum                         X       X          - 类和枚举声明会创建Type, Value
// Interface                    X                  - 
// Type Alas                    X                  - 接口和类型别名声明会创建Type
// Function                             X          - 
// Variable                             X          - 函数和变量声明会创建Value

// 10.1 interface合并 - 接口的非函数成员应该时唯一的，如果不唯一，必须时相同类型；
// 对于函数成员会被当作重载，后面接口优先级更高（除非存在类型是单一字符串字面量-如'str',那么将被提升到重载最顶端）
interface Box {
  width: number;
  height: number;
  print(value: string): string;
}
interface Box {
  slace: number;
  // width: string; // error: 后续属性声明必须属于同一类型
  print(value: number, opt: NonNullable<object>): number;
}
let b: Box = {
  width: 0,
  height: 0,
  slace: 0,
  print: function<T> (value: T, opt?: NonNullable<object>): T { // 这里重载会放在前面（更高优先级）
    console.log(value);
    return value
  }
}
b.print(1, {});

// 10.2 namespace合并 - 与接口相似，同名的命名空间也会合并成员
// 对于命名空间的合并，模块导出的同名接口进行合并，构成单一命名空间内含合并后的接口；
// 对于命名空间里值的合并，如果当前已存在给定名字的命名空间，那么后来的命名空间的导出成员会被加到已经存在的那个模块里； 
namespace ZooSpace {
  export interface Animal {
    name: string;
  }
  export class Monkey implements Animal {
    eggCount: number; // 虽然上面不包含eggCount，但这里实现的是合并后的接口
    name: string = 'monkey';
  }
  const ZOONAME = 'BIB ZOO'; // 非导出成员仅在原有的命名空间可见
  export function printBaseInfo () {
    console.log(ZOONAME)
  }
}

namespace ZooSpace {
  export interface Animal { // 合并命名空间里面的interface
    eggCount: number;
  }
  export class Lion implements Animal {
    eggCount: number;
    name: string;
    printInfo(): void {
      ZooSpace.printBaseInfo()
    }
  }
  // export class Monkey {} // error: 标识符“Monkey”重复; 和命名空间外面一样，不能合并类
}
let lion = new ZooSpace.Lion();
lion.printInfo();

// 10.3 namescpace 与 class, function, enum 类型合并
// 命名空间可以与其他类型的声明进行合并，只要命名空间的定义符合将要合并的类型的定义；合并结果为包含两者的声明类型；

// 合并命名空间和类
class Album  {
  label: Album.AlbumLabel; // 这里引用了合并后的类型
}
namespace Album {
  export class AlbumLabel {
    labelName: string;
    getCount (): number {
      return Album.COUNT;
    }
  }
  export let COUNT = 10; // 为类添加静态属性或静态方法
}
let album = new Album();
album.label = new Album.AlbumLabel();
console.log(album.label.getCount()); // 10

function buildLabel (name: string): string {
  return `${buildLabel.prefix}${name}${buildLabel.suffix}`
}
namespace buildLabel { // 用来拓展函数属性
  export let prefix = 'build name: start - ';
  export let suffix = ' - end';
}
console.log(buildLabel('Bob'));

// 拓展枚举类型
enum Color {
  red = 1,
  green = 2,
  blue = 4
}
namespace Color {
  export function mixColor(name: string): number {
    switch (name) {
      case 'yellow': return Color.red + Color.green;
      case 'white': return Color.red + Color.green + Color.blue;
      case 'magenta': return Color.red + Color.blue;
      case 'cyan': return Color.green + Color.blue;
      default: return 0;
    }
  }
}

let color: Color = Color.mixColor('yellow');
console.log(color);

// 10.4 非法的合并 - 目前，类不能与其他类或变量合并，可以使用Typescript的混入（mixin）模仿类的合并

// 10.5 模块拓展 - 虽然Javascript不支持合并，但你可以为导入的对象打补丁以更新它们
import {Observable} from './lib/test-observable';
// 拓展模块
declare module './lib/test-observable' {
  // 但是，有两点限制需要注意：
  // 1. 你不能在扩展中声明新的顶级声明－仅可以扩展模块中已经存在的声明。
  // 2. 默认导出也不能扩展，只有命名的导出才可以（因为你需要使用导出的名字来
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>
  }
}
Observable.prototype.map = function (f) {
  type newtype = ReturnType<typeof f>;
  const newObservable = new Observable<newtype>()
  this.deps.forEach((value, key) => {
    let newKey = f(key);
    newObservable.deps.set(newKey, new Set(value));
  })
  return newObservable;
}

let observable = new Observable<number>();
observable.subscribe(1, (topic) => {console.log(topic, '触发1')});
const remove = observable.subscribe(1, (topic) => {console.log(topic, '触发2')});
// remove();
observable.subscribe(1, (topic) => {console.log(topic, '触发3')});
setTimeout(() => {
  observable.publish(1);
}, 1000);

let observable2 = observable.map(function (x) {
  return x.toFixed(2);
})
observable2.subscribe('1.00', (topic) => {console.log(topic, '触发4')})
observable2.subscribe('hello', (topic) => {console.log(topic, '触发5')})
setTimeout(() => {
  observable2.publish('1.00');
  observable2.publish('hello');
}, 2000);

// declare global { // 你也以在模块内部添加声明到全局作用域中;全局扩展与模块扩展的行为和限制是相同的
//   interface Array<T> {
//     toObservable(): Observable<T>;
//   }
// }