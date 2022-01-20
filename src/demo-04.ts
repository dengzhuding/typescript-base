/**
 * 4. 函数
 */

// named function
function add (x: number, y: number): number {
  return x + y;
}
// 匿名函数
const printMsg = function (message: string) {
  console.log(message);
}

// 完整函数类型： 参数类型和返回值类型（没有返回值也需要用void）
let myAdd: (x: number, y: number) => number = add;
// 注意箭头函数和函数类型的区别：函数类型用分号（;）,箭头函数用赋值语句（=）
// 注意下面右边参数没有书写类型，也能自行推断（类型推论）
myAdd = (x, y) => 1;

// 传递个一个函数的参数必须于函数期望的参数个数一致；
// ? - 可选参数
// = 默认参数(没传参数或出入undefined时生效)
// ... 剩余参数
function buildName (firstName = 'will', lastName: string, ...otherNames: string[]) {
  // 这里如果要默认参数生效，需要明确传入第一个参数为undefined
  return firstName + ' ' + lastName + otherNames.join(' ');
}
console.log(buildName(undefined, 'hello'));
console.log(buildName(undefined, 'hello', 'world', '!', 'how', 'are', 'you', '.'));

// 使用箭头函数绑定固定this值
const desk = {
  suits: ['a', 'b', 'c', 'd'],
  createCardPicker: function () {
    // 在调用desk.createCardPiocker时定义下面箭头函数，此时this为desk
    return () => {
      const pickedCard = Math.floor(Math.random() * 52);
      const pickedSuit = Math.floor(pickedCard / 13);
      const card = pickedCard % 13;
      return {
        // 这里this被推断为desk类型了,不知道为啥。。这里也没有提供显式的this参数（估计是成员函数自有的推断）
        suit: this.suits[pickedSuit],
        card
      }
    }
  }
}
const picker = desk.createCardPicker();
const card = picker();
console.log('card', card);
// 下面这里的createCardPicker调用上下文为window，会报错
// const createCardPicker = desk.createCardPicker;
// const picker2 = createCardPicker();
// console.log('card2', picker2());

function test(this: Window) { // 这里的this参数编译后js会删掉，仅用作类型推断
// function test() { // 设置了noImplicitThis: true: "this" 隐式具有类型 "any"时警告
  console.log(this)
}

// 回调函数里的this参数
interface UIElement {
  events: {
    [eventName: string]: Function
  };
  // this: void意味着onclick不需要一个this类型
  addClickListener (eventType: string, onclick: (this: void, event: MyEvent) => void): void;
  emit(eventType: string): void
}
class MyEvent {
  constructor (public type: string) {}
}
class Handle {
  type: string = '';
  onClickBad (this: void, e: MyEvent) { // 不能用this.type，绑定在原型链(Handle.prototype)上面
    // this.type = e.type;
    console.log('this - uiElement & event: ', this, e); // 这里this为上层调用传入的上下文
  };
  onClickGood = (e: MyEvent) => { // 能用this.type;缺点是onClickGood绑定在实例(成员属性)上面
    this.type = e.type;
    console.log('this - Handle实例 & event:', this, e); // 这里this为Handle实例
  }
}
const handle = new Handle();
let uiElement: UIElement = {
  // 绑定事件
  addClickListener: function (eventType: string, onclick: (this: void, e: MyEvent) => void): void {
    const e: MyEvent = new MyEvent(eventType);
    this.events[eventType] = onclick;
    console.log(`add ${eventType} Listener success.`);
  },
  // 触发
  emit: function (eventType: string): void {
    if ((this.events as Object).hasOwnProperty(eventType)) {
      const e: MyEvent = {
        type: eventType
      }
      this.events[eventType].call(this, e);
    }
  },
  // 保存监听的事件
  events: {}
};
uiElement.addClickListener('click-bad', handle.onClickBad);
uiElement.addClickListener('click-good', handle.onClickGood);
uiElement.emit('click-bad');
uiElement.emit('click-good');

// 函数重载（传入不同参数以及不同返回）：为同一个函数提供多个函数定义来进行函数重载
function mergeMember(member: number): number; // 第一个重载
function mergeMember(member: string): string; // 第二个重载
function mergeMember(member: any): boolean; // 第三个重载
function mergeMember(member: any): any {
  if (typeof member === 'number') {
    return member;
  } else if (typeof member === 'string') {
    return member.substring(0);
  }
  return false
}
console.log(mergeMember('hello'), mergeMember(10), mergeMember([]));
