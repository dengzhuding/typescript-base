/**
 * 3. 类
 * 类类型兼容性：
 * 类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型
 * a. 比较两个类类型的对象时，只有实例的成员会被比较
 * b. 静态成员和构造函数不在比较的范围内
 * c. 当检查类实例的兼容时，如果目标类型包含一个私有成员（或受保护成员），那么源类型必须包含来自【同一个类】的这个私有成员
 */

class Greeter {
  greeting: string; // 实例属性
  constructor(message: string) { // 构造函数
    this.greeting = message;
  }
  greet () { // 实例方法
    return `hello ${this.greeting}`
  }
  static className: string = 'Greeter'; // 静态属性Greeter.className
}

let greeter = new Greeter('world');
console.log(greeter.greet());
console.log(`Greeter.className: ${Greeter.className}`);

// 类的继承：用extends - 类从基类中继承了属性和方法
namespace extendsExample {
  class Animal { // 基类
    name: string;
    static animalProp: boolean = true; // 静态属性 - 存在于类本身而不是实例上面，用Animal.animalProp访问
    public baseName: string = 'animal'; // public（默认） - 公共修饰符
    private isLive: boolean = true; // private - 私有修饰符，不能在声明它的类的外部访问（派生类也不行）
    protected canEat: boolean = true; // protected - 受保护修饰符，和private很相似，不过在派生类中可以访问；构造函数也能标记为protected,这意味这这个类不能在包含它的类外被实例化，但是能被继承
    readonly rTip: string = 'ok'; // readonly - 只读修饰符，只读属性必须在声明时或构造函数里被初始化
    // 存取器，ts支持通过getters/setters来截取对对象成员的访问(要求输出es5或更高)；只带get的存取器自动被推断为readonly;
    get fullName (): [string, string] { // 通过.fullName进获取属性时
      return [this.name, this.secondName]
    };
    set fullName (nameArr: [string, string]) {
      let [name, secondName] = nameArr; // 解构成员
      this.name = name;
      this.secondName = secondName;
    };
    constructor(theName: string, private secondName: string = 'dd') { // 参数属性(参数添加修饰符，就能创建并初始化成员属性) - secondName
      this.name = theName; // 使用参数属性，这局就可以省略了
    }
    move(distanceInMeters: number = 10): void {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
      console.log(`secondName: ${this.secondName}`);
    }
    getStatus () {
      console.log(`private prop -  ${this.name} is live: `, this.isLive);
    }
  }
  class Dog extends Animal { // 派生类，又叫子类
    constructor (name: string) {
      super(name);
    }
    move(distanceInMeters = 5): void { // 重写父类的move方法
      super.move(distanceInMeters);
      // console.log(this.isLive); //error: 属性“isLive”为私有属性，只能在类“Animal”中访问
      console.log(`protected prop - ${this.name} canEat: `, this.canEat); // ok, protected 修饰在派生类中可以访问

    }
  }
  class Horse extends Animal {
    constructor (name: string) {
      super(name); // 派生类的构造函数必须包含 "super" 调用
    }
    move(distanceInMeters = 55): void {
      super.move(distanceInMeters);
    }
  }
  let A: typeof Animal = Animal; // 取Animal类的类型，而不是实例的类型
  console.log(`static prop: `, A.animalProp);
  let d: Animal = new Dog('Sammy');
  let h = new Horse('Tom');
  d.move();
  h.move(11);
  // d.isLive; // error: 属性“isLive”为私有属性，只能在类“Animal”中访问
  d.getStatus();
  console.log(`${d.name} full name: `, d.fullName);
  d.fullName = ['hello', 'world'];
  console.log(`${d.name} full name: `, d.fullName);
}

// 抽象类 - 作为其他派生类的基类使用，它们一般不会直接被实例化；不同于接口，抽象类可以包含成员的实现细节
// abstract关键字用于定义抽象类和在抽象类内部定义抽象方法
abstract class Fruit {
  category: string = 'fruit';
  abstract name: string;
  abstract getName (): string; // 抽象方法和属性必须在派生类中实现
  protected abstract setName(name: string): void; // 可以包含访问修饰符
}
class Apple extends Fruit {
  getName(): string {
    return this.name;
  }
  protected setName(name: string): void {
    this.name = name;
  }
  constructor (public name: string) {
    super(); // 派生类的构造函数必须包含 "super" 调用
  }
  otherFn () {
    console.log(`${this.name}:  exec otherFn.`);
  }
}
// let apple = new Fruit(); // error: 无法创建抽象类的实例
let apple: Fruit = new Apple('Tom');
let apple2: Apple = new Apple('Marry');
console.log(`apple - name: ${apple.name}`);
// apple.otherFn(); // error: 类型“Fruit”上不存在属性“otherFn”, 因为前面声明apple是Fruit类型，改为apple: Apple就行
apple2.otherFn();

// 把类当作接口使用
class Point {
  x!: number; // 非空断言
  y!: number;
}
interface Point3d extends Point {
  z: number;
}
let point3d: Point3d = {
  x: 0,
  y: 0,
  z: 1
}
