/**
 * 6. 枚举 - 可以i当以一些带名字的常量；Typescript支持数字的和基于字符串的枚举
 * 使用枚举：通过枚举的属性来访问枚举成员，和枚举的名字来访问枚举类型
 * 
 * 枚举兼容性：
 * 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的
 */

//  枚举兼容性
enum Status { Ready, Waiting };
enum Color2 { Red, Blue, Green };
let status2 = Status.Ready;
// status2 = Color2.Red; // error: 不同枚举类型不兼容
status2 = Status.Waiting; // ok
status2 = 3; // ok

enum Direction {
  Up = 1, // 初始化为1（不初始化从0开始），其余成员从1自动增长
  Down,
  Left,
  Right
}
let direction: Direction = Direction.Down;
console.log(Direction, direction);

function getNum() {return 0}
//下面这种情况不允许：
// 简短地说，不带初始化器的枚举或者被放在第一的位置，或者被放在使用了数字常量或其它常量初始化了的枚举后面
enum E {
  A = getNum(),
  // B //error: 枚举成员必须具有初始化表达式
}
enum E2 { // ok
  B = 1,
  A = getNum()
}
console.log(E, E2);

// 字符串枚举 - 每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化
enum Direction2 {
  UP = 'UP',
  // Down, // error: 枚举成员必须具有初始化表达式
  Down = 'Down',
  Left = 'LEFT',
  Right = 'RIGHT'
}
console.log('注意：不会为字符串枚举成员生成方向映射,Direction2 - ', Direction2)
const X = 0;
enum E3 {
  down = X // ok
}

/**
 * 枚举成员使用常量表达时初始化
 * 1. 一个枚举表达式字面量（主要是字符串字面量或数字字面量）
 * 2. 一个对之前定义的常量枚举成员的引用（可以是在不同的枚举类型中定义 的）
 * 3. 带括号的常量枚举表达式
 * 4. 一元运算符 + , - , ~ 其中之一应用在了常量枚举表达式
 * 5. 常量枚举表达式做为二元运算符 + , - , * , / , % , << , >> , >>> , & , | , ^ 的操作对象
 *    若常量枚举表达式求值后为 NaN 或 Infinity ，则会在编译阶段报错
*/
enum FileAccess {
  // constant members
  None, // 0
  Read = 1 << 1, // 20
  Write = 1 << 2, // 4
  ReadWrite = Read | Write, // 6
  // computed member
  G = '123'.length,
  K = Direction2.Down
}
console.dir(FileAccess);

// 字面量枚举成员：指不带有初始值的常量枚举成员，或者是值被初始化为任何字符串字面量、数字字面量、应用了一元符号的数字字面量
// 当所有枚举成员都拥有字面量枚举值时，他就带有了一种特殊的语义：
// a. 可作为类型使用
enum ShapeKind {
  Circle,
  Square,
}
interface Circle {
  kind: ShapeKind.Circle,
  radius: number
}
let c2: Circle = {
  // kind: ShapeKind.Square, // error
  kind: ShapeKind.Circle,
  radius: 0
}
// b. 枚举本身变成了每个枚举成员的联合
function f(x: ShapeKind) {
  // x = 'hello'; // error: 不能将类型“"hello"”分配给类型“ShapeKind”
  x = ShapeKind.Square;
  // if (x !== ShapeKind.Square || x !== ShapeKind.Circle) {} // error
}
f(ShapeKind.Circle);
console.log(ShapeKind[1]); // 打印"Square"，属于反向映射

// const枚举：常量枚举只能使用常量枚举表达式，它们在编译阶段会被删除
const enum Directives {
  Up,
  Down,
  Left,
  Right
}
let directives = [Directives.Up, Directives.Down, Directives.Right]; // 编译为let directives = [0, 1, 3]
console.log('使用常量枚举-directives:', directives)

// 外部枚举 - 用来描述已经存在的枚举类型的形状
declare enum Enum { // 同样被删除
  A = 1,
  B, // 没有初始化时被当作需要经过计算的
  C = 2
}
// console.log('外部枚举-Enum：', Enum); //error: Enum is not defined