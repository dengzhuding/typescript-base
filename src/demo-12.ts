/**
 * 12. 装饰器 - Decorators
 * 装饰器（Decorators）为我们在类的声明及成员上通过元编程 语法添加标注提供了一种方式。
 * 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上；
 * 装饰器使用 @expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入
 * 启用experimentalDecorators选项支持装饰器语法
 */

// 装饰器元数据是个实验性的特性并且可能在以后的版本中发生破坏性的 改变（breaking changes）。
import 'reflect-metadata'

/**
 * 装饰器工厂 - 就是一个简单的函数，返回一个表达式，以供装饰器在运行时调用
 */
function addProp<T>(key: string, value: T) { // 装饰器工厂
  console.log('执行了装饰器表达式');
  return function (target: Function) { // 装饰器
    console.log('应用了装饰器');
    Object.defineProperty(target, key, {value: value});
  }
}


@addProp('color', 'red')
class A2 {}

console.log((<typeof A2 & {color: string}>A2).color);


// console.log(testFn.a);
 
/**
 * 装饰器组合：多个装饰器应用于一个声明： @f @g -等同于f( g ( x ) )
 * 1. 由上至下依次对装饰器表达式求值。
 * 2. 求值的结果会被当作函数，由下至上依次调用。
 * @param target 
 */
function f(): MethodDecorator {
  console.log('f()被求值');
  return function(target, propertyKey, descriptor) {
    console.log('f()被调用，target: ',target);
  }
}
function g(): MethodDecorator {
  console.log('g()被求值');
  // 方法装饰器
  return function(target, propertyKey, descriptor) {
    console.log('g()被调用，target: ', target);
  }
}

// 类装饰器 - 应用于类构造函数，可用来监视，修改或替换类定义；如果返回新的构造函数，注意处理好原来的原型链
let classDecorator: ClassDecorator = function (target) {
  console.log('类装饰器被执行，target: ', target);
  Object.seal(target); // 冻结静态属性
  Object.seal(target.prototype); // 冻结原型属性
}

// 方法装饰器 - 应用到方法的属性描述符上，可用来监视，修改或替换方法定义，3个参数：
// target - 对于静态成员是类的构造函数，对于实例成员是类的原型对象
// propertyKey - 成员名称, descriptor - 成员的属性描述符
// 如果方法装饰器返回一个值，它会被用作方法的属性描述符
// 注意：TypeScript不允许同时装饰一个成员的 get 和 set 访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。
// 这是因为，在装饰器应用于一个属性描述符时，它联合了 get 和 set 访问器，而不 是分开声明的。
let methodDecorator: MethodDecorator = function (target, propertyKey, descriptor) {
  console.log('方法装饰器被执行，target: ', target);
  descriptor.enumerable = false; // 设置不可枚举
}
// 类装饰器工厂函数
let methodDecoratorFactory = function (tip: string): MethodDecorator {
  console.log(`装饰器被求值：${tip}`);
  return methodDecorator
}

// 属性装饰器 - 声明再一个属性之前，2个参数：target- 对于静态成员是类的构造函数，实例成员是类的原型对象，key - 成员名
// 因此，属性描述符只能用来监视类中是否声明了某个名字的属性
// 如果访问符装饰器返回一个值，它会被用作方法的属性描述符。
let propertyDecorator: PropertyDecorator = function (target, propertyKey) {
  console.log('属性装饰器被执行，target: ', target);
}

// 参数装饰器 - 声明在一个参数声明之前,3个参数：
// target- 对于静态成员是类的构造函数，实例成员是类的原型对象;propertyKey- 成员们;parameterIndex-参数在函数参数列表的索引;
// 注意  参数装饰器只能用来监视一个方法的参数是否被传入

let parameterDecorator: ParameterDecorator = function (target, propertyKey, parameterIndex) {
  console.log('参数装饰器被执行，target: ', target);
}

console.log('类中不同声明上的装饰器应用顺序：')

@classDecorator // 类装饰
class C {
  @propertyDecorator // 属性属性装饰
  public name: string;
  @Reflect.metadata('key', 'A') // 设置元数据的工厂
  greeting: string;
  constructor(@parameterDecorator /** 构造函数参数装饰 */ name: string) {
    this.name = name;
  }
  @f() @g() // 方法装饰
  methods(prop: number) {
    console.log('类的方法被调用了')
  }
  @methodDecoratorFactory('访问器属性') // 访问器属性装饰
  get pName() {
    return this.name;
  }
  set pName(name: string) {
    this.name = name
  }
  greet(): string {
    return Reflect.getMetadata('key', this, 'greeting'); // return A
  }
}
// 属性装饰器被执行
// f()被求值
// g()被求值
// g()被调用
// f()被调用
// 装饰器被求值：访问器属性
// 方法装饰器被执行
// 参数装饰器被执行
// 类装饰器被执行
console.log('类实例化，装饰器不再调用：')
let c4 = new C('Bob');
c4.methods(1);
console.log(c4.greet());