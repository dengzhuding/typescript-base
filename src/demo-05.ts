/**
 * 5. 泛型 - 使用了类型变量的函数
 */

// 类型变量：是一种特殊的变量，只用于表示类型而不是值
function identity<T>(arg: T): T { // 注意：这里需要在函数名后声明类型变量<T>，不然会提示找不到T
  return arg;
}
let str2: string = identity<string>('hello'); // 可以传入类型参数
let num: number = identity(1); // 利用类型推论-即编译器会根据传入的参数自动地帮助我们确定T的类型
console.log(`identity(1)返回：${num}`);

// 接收类型参数T和参数arg - 是个元素类型为T的数组,返回元素类型为T的数组
function loggingIdentity<T>(arg: T[]): Array<T> { // Array<T> 跟 T[] 相同效果，都是元素为T的数组
  console.log('参数arg的length:', arg.length);
  return arg;
}
const numArr = loggingIdentity([1, 2, 3]);
console.log(`loggingIdentity([1, 2, 3])返回：${numArr}`);

// 泛型函数的类型
// a. 跟非泛型的函数没什么不同，只是又一个类型参数在最前面
let myIdentity: <T>(arg: T, d: string) => T = identity;
// b. 用带有签名的对象字面量来定义泛型类型
let myIdentity2: {<T>(arg: T): T} = identity;
// c. 使用泛型接口
interface GrnericIdentity {
  <T>(arg: T): T;
}
let myIdentity3: GrnericIdentity = identity;

// 可以把泛型参数当作整个接口的一个参数，这样就能知道使用的是哪个泛型类型（比如：Dictionary<string> 而不是Dictionary）
interface GrnericIdentityFn<T> {
  (arg: T): T;
}
let myIdentity4: GrnericIdentityFn<number> = identity; // 传入类型参数number，指定了用的类型
// myIdentity4(''); // error
console.log(myIdentity4(12));

// 泛型类 - 看上去与泛型接口差不多，泛型类使用（<>）括起泛型类型，跟在类名后面
class GenericNumber<T> {
  // static prop: T; // error: 静态成员不能引用类类型参数
  static prop: string = 'prop';
  zeroValue!: T;
  add!: (x: T, y: T) => T;
}
const myGen = new GenericNumber<number>();
const myGen2 = new GenericNumber<string>();
// myGen.zeroValue = ''; // error
myGen.zeroValue = 0; // ok
myGen2.zeroValue = ''; // ok
myGen.add = function (x: number, y: number) {
  return x + y;
}

// 泛型约束 - 通过extends继承接口来约束泛型参数
interface LengthWise {
  length: number;
}
function loggingIdentity2<T extends LengthWise> (arg: T): T { // 约束了T必须是LengthWise子类型
  console.log(arg.length);
  return arg;
}
loggingIdentity2({length: 1, val: ''}); // ok 

function getProperty<T, K extends keyof T>(obj: T, key: K) { // keyof关键字：返回key的联合类型，如'key1' | 'key2'| ..
  return obj[key];
}
let obj3 = {
  key1: 1,
  key2: '2'
}
console.log(getProperty(obj3, 'key2'));

// 在泛型里使用类类型
function creat<T>(C: {new(): T}): T {
  return new C();
}


class BeeKeeper {
  hasMask: boolean;
}
class ZooKeeper {
  nameTag: string;
}
class MyAnimal {
  numLegs: number;
}
class Bee extends MyAnimal {
  keeper: BeeKeeper;
}
class Lion extends MyAnimal {
  keeper: ZooKeeper;
}
// 使用圆形属性推断并约束构造函数与类实例的关系
function createInstance<T extends MyAnimal>(C: new () => T): T {
  return new C();
}
// createInstance(Bee).keeper.hasMask = true; // 提示ok，不过编译后由于为赋值，运行会报错
// createInstance(Bee).keeper.nameTag = true; // error: 类型“BeeKeeper”上不存在属性“nameTag”（会进行类型推断）
// createInstance(Lion).keeper.nameTag = 'lion'; // ok
const bee = createInstance<Bee>(Bee);
bee.keeper = new BeeKeeper();
// bee.keeper = new ZooKeeper(); // error
bee.keeper.hasMask = true;
console.log('bee.keeper.hasMask: ', bee.keeper.hasMask);
