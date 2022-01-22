/**
 * 8. Symbols, Iterators(迭代器), Generators(生成器)
 */

// 8.1 Symbols - es6起，symbools成为了一种新的原生类型，和number，string一样
// unique symbol 类型() - 这种类型只允许在 const 声明和只读静态属性上使用，为了引用特定的唯一符号，您必须使用 typeof 运算符
// unique symbol is a subtype of symbol, and are produced only from calling Symbol() or Symbol.for(), or from explicit type annotations.

// let uniqueSym: unique symbol = Symbol(); // error: 类型为 "unique symbol" 的变量必须为 "const"
const uniqueSym: unique symbol = Symbol(); // ok
let uniqueSym2: typeof uniqueSym = uniqueSym;

let sym: symbol = Symbol('sym'); // Symbols是不可改变且唯一的

let obj4 = {
  [sym]: 'hello world'
}
console.log(obj4[sym]); // 打印: hello world
console.log(Symbol('') === Symbol('')); // 打印: false - Symbol是唯一的
type KeySymbo = {
  [key: symbol]: any
}
let obj5: KeySymbo = {
  // a: 1, // error
  [sym]: 1
}
console.dir(obj5); // 打印: { [Symbol(sym)]: 1 }

// 内置symbols - 用来表示语言内部的行为
// Symbol.hasInstance - 方法，会被instanceof运算符调用；构造器对象用来识别一个对象是否是其实例
class MyFoo {
  constructor(public name: string) {};
}
class MyFoo2 extends MyFoo {
  // 就给构造函数增加Symbol.hasInstance属性来说，Class能做到，应用Function的形式就做不到
  // (但是这里编译目标为:es6时还是转为了MyFoo2[Symbol.hasInstance] = ..，所以赋值失败！)
  // static [Symbol.hasInstance]: (value: any) => boolean = function (value) { // 遮蔽原型链上的属性的识别，进入自定义的识别
  //   console.dir(value);
  //   return false;
  // };
}
let numForInCusHasInstance: number = 0;
// 这里使用Object.defineProperty遮蔽原型链上的z只读属性
Object.defineProperty(MyFoo2, Symbol.hasInstance, {
  value: (value: any): boolean => { // 不知道为啥会调用多次？？
    numForInCusHasInstance++;
    const result: boolean = numForInCusHasInstance % 2 === 0;
    console.log('value: ', value, `这是第${numForInCusHasInstance}调用【Symbol.hasInstance】方法, 返回: ${result}`,); // 这里面被执行了多次
    // return false;
    return result;
  }})
// A[Symbol.hasInstance] = fun 注意：这种写法
// 应用Class的时候，会间接在构造函数上增加一个动态属性，不会先查看原型链上是否存在同名属性。
// 而应用function的形式的时候，给构造函数增加一个静态方法，相当于给对象赋值，赋值操作会先查看原型链上是否存在同名属性，所以就会有赋值失败的危险。

let myFoo: MyFoo = new MyFoo('Bob');
let myFoo2: MyFoo2 = new MyFoo2('Jay');

console.log('Function.prototype[Symbol.hasInstance]: \n', Object.getOwnPropertyDescriptor(Function.prototype, Symbol.hasInstance)); // Symbol.hasInstance绑定在Function的原型对象上
console.log('MyFoo2[Symbol.hasInstance]: \n', Object.getOwnPropertyDescriptor(MyFoo2, Symbol.hasInstance));
console.log('MyFoo2 instanceof MyFoo2: ', myFoo2 instanceof MyFoo2); // fasle 这里调用了上面自定义的识别器

// ...还有其他内置Symbols，这里不展开了

// 8.2 Iterators（迭代器） - 当一个对象实现了Sym.iterator属性时，我们认为时可迭代的
// 如 Array,Map,Set,String,Int32Array,Uint32Array 等都已经实现了各自的Symbol.iterator.对象上的 Symbol.iterator 函数负责返回供迭代的值
// Symbol.iterator 方法，被 for-of 语句调用。返回对象的默认迭代器。
let obj6 = {
  key1: 'val1',
  key2: 'val1',
  key3: 'val1',
};
let arr4: any[] = [1, 2, 'three', 'four'];
// for-in - 迭代的是对象的键; 
console.log('obj6 for-in 迭代值：')
for (const key in obj6) {
  console.log(key); // key1 key2 key3
}
console.log('arr4 for-in 迭代值：')
for (const key in arr4) {
  console.log(key); // 0 1 2 3
}
// for-of - 迭代的是对象的键对应的值；会调用对象上的Symbol.iterator方法
// for(const value of obj6) {} // error: 类型必须具有返回迭代器的 "[Symbol.iterator]()" 方法；
// 所以普通对象不能使用for-of语句，除非自己添加上

// 实现Iterator接口（可迭代协议）：标准库已经内置了Iterable<T>接口,T为返回值的类型
interface MyIterable {
  [Symbol.iterator]: () => ({
    next: () =>{
      done: boolean,
      value: any
    }
  })
}
class Counter implements Iterable<number> { // 计数器
  constructor(public limit: number) {}
  [Symbol.iterator](): Iterator<number> { // Counter.prototype上添加[Symbol.iterator]属性
    let count = 1;
    let limit = this.limit;
    const result = {
      next: (...args: []): IteratorResult<number> => {
        if (count <= limit) {
          return {value: count++, done: false}
        } else {
          return {value: count, done: true}
        }
      }
    }
    return result;
  }
}
const c3 = new Counter(3);
console.log('c3 for-of 迭代值：')
for (const value of c3) {
  console.log(value); // ok
}
console.dir(c3);

// Array实现了Symbol.iterator方法，在Array.prototype里面: Array.prototype.hasOwnProperty(Symbol.iterator) 为 true
console.log('arr4 for-of 迭代值：')
for (const value of arr4) { // ok
  console.log(value); // 1 2 three four
}

// 8.3 Generators(生成器) - es6新增，拥有在一个函数内部【暂停】和【恢复】代码执行的能力
// 语法： function* () {},function *() {},{* fn(){}},class{public * fn(){}}
// 箭头函数不能用来定义生成器函数
let genFn = function* (): any {
  let firstVal = yield 1; // yield - 会暂停代码执行，知道等到.next(value)方法触发，将value作为yield语句的返回继续
  // console.log('firstVal: ', firstVal); // firstVal:  nextVal - 2
  let secondVal = yield 2;
  // console.log('secondVal: ', secondVal); // secondVal:  nextVal - 3
  return 'end'; // 这里return返回的值会在最终done为true时的value里面，即{value: 'end', done: true}
}
let fn = genFn(); // g - 生成器对象；类型为Generator<number, void, unknown>
console.dir(fn.next('nextVal - 1')); // { value: 0, done: false } - 接收到函数内第一个yield抛出的值，这里传入的值不会被使用，因为第一次调用.next()是为了开始执行生成器函数
console.dir(fn.next('nextVal - 2')); // { value: 2, done: false }
console.dir(fn.next('nextVal - 3')); // { value: 'end', done: true }
// 上面执行顺序：
// a. fn.next('nextVal - 1') —》开始执行生成器函数，遇到第一个yield，返回1，暂停函数执行；打印-{ value: 1, done: false }
// b. fn.next('nextVal - 2') —》开始执行生成器函数, 从第一个yield处继续，送入'nextVal - 2'，赋值给firstVal；打印-firstVal:  nextVal - 2
//    遇到第二个yield，返回2，暂停函数执行；打印-{ value: 2, done: false }
// c. fn.next('nextVal - 2') —》开始执行生成器函数,从上一个yield处继续，送入nextVal - 3'，赋值给secondVal；打印- secondVal:  nextVal - 3
//    到函数执行结束；返回'end'; 打印 - { value: 'end', done: true }

console.log('genFn() for-of 迭代值：')
for (const value of genFn()) { // 生成器拥有可迭代行为
  console.log(value); // 1 2 ,done=true的值不被包括
}

// *增强yeild的行为：让它能够迭代一个可迭代对象，从而一次就能产出一个值
// yield* 后面可接普通迭代对象（如[1,2]）,也可接生成器产生的迭代器（如genFn()）
function *genFn2() {
  // yield [1, 2, 3] 是只返回一次[1, 2, 3]值，用*后会依次抛出，相当于for (val of [1, 2, 3]) {yield val}
  // for (const val of [1, 2, 3]) {
  //   yield val;
  // }
  yield* [1, 2, 3];
  yield* genFn();
}
console.log('genFn2() for-of 迭代值：')
for (const value of genFn2()) { // 生成器拥有可迭代行为
  console.log(value); // 1 2 3 1 2
}

// return() 和throw()方法都可以用于强制生成器进入【关闭状态】
let gen3 = genFn2();
// function getResult<T>(generator: Generator<T>): IteratorResult<T> {
//   return generator.next();
// }
console.log('gen3: ');
console.log(gen3.next());   // { value: 1, done: false }
console.log(gen3.return()); // { value: undefined, done: true } - 强制关闭
console.log(gen3.next());   // { value: undefined, done: true }

console.log('gen4: ');
let gen4 = (function*() {
  for (const val of [1, 2, 3]) {
    yield val;
  }
})();
try {
  console.log(gen4.next()); // { value: 1, done: false }
  console.log(gen4.throw('manual error')); // 未执行打印
  console.log('...') // 未执行打印
} catch(e) {
  console.log('error msg:', e); // error msg: manual error
}
console.log(gen3.next()); // { value: undefined, done: true }console.log('gen4: ');

console.log('gen5: ');
let gen5 = (function*() {
  for (const val of [1, 2, 3]) {
    try {
      yield val;
    } catch(e) {}
  }
})();
try {
  console.log(gen5.next()); // { value: 1, done: false }
  console.log(gen5.throw('manual error')); // { value: 2, done: false }
  console.log('...') // ...
} catch(e) {
  console.log('error msg:', e); // 不执行此处，因为生成器内部已处理异常
}
console.log(gen5.next()); // { value: 3, done: false }
console.log(gen5.next()); // { value: undefined, done: true }

