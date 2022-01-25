/**
 * 观察者模式：
 *    在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。
 * 这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。
 * 
 * 2个主要角色
 *   - Subject(主体：被观察着 - 可被多个观察者关注，同时可以发出通知到所有观察者)
 *   - Observer(观察者)
 * 优点：支持简单的广播通信，自动通知所有已订阅过的对象；目标对象与观察者之间的抽象耦合关系能够单独拓展以及复用
 * 缺点：通知所有观察者花费时间；观察者之间循环依赖会造成崩溃
 */
interface Context { // 通知信息的结构
  data: any;
}
interface Observer {
  subject: Subject; // 保存观察目标
  update(content: Context): void; // 收到通知
  subscribe(subject: Subject): void; // 订阅目标
}
interface Subject {
  observers: Observer[]; // 保存观察者列表
  notify(message: string): void; // 发出通知

  add(observer: Observer): void; //添加观察者
  remove(observer: Observer): void; //移除观察者
}

class MyObserver implements Observer {
  subject: Subject;
  update(content: Context): void {
    console.log(content.data);
  }
  constructor(public name: string = 'observer') {}
  subscribe(this: Observer ,subject: Subject): void {
    this.subject = subject;
    subject.add(this);
  }
}

class MySubject implements Subject {
  observers: Observer[] = [];
  notify(message: string): void {
    const context: Context = {
      data: message
    };
    for (const observer of this.observers) {
      observer.update(context);
    }
  }
  add(...arg: Observer[]): void {
    this.observers = this.observers.concat(arg);
  }
  remove(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      return
    }
    this.observers.splice(index, 1);
  }
  
}

export {
  MyObserver as Observer,
  MySubject as Subject
}
// let o = new MyObserver();
// let s = new MySubject();
// o.subscribe(s);
// s.add(new MyObserver('o1'), new MyObserver('o2'), new MyObserver('o3'));
// setTimeout(() => {
//   s.notify('主题发出通知')
// }, 2000);

 /**
 * Observables 与 Observer之间的订阅发布关系（比观察者模式多了一个中间件）：
 * 订阅：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
 * 发布：Observable 通过回调 next 方法向 Observer 发布事件。
 * 发布者和订阅者两个模块完全不用知道对方的存在
 */

export class Observable<T> { // T - 发布者类型
  deps: Map<T, Set<Function>> = new Map(); // 保存发布者-订阅者关系
  constructor () {}
  // 订阅
  subscribe(topic: T, func: (topic: T) => void) { // 返回解除订阅的方法
    let subscribes = this.deps.get(topic);
    if (!subscribes) {
      subscribes = new Set();
      this.deps.set(topic, subscribes);
    }
    subscribes.add(func);
    return (function (thisVal, topic, func) { // 封装一个闭包
      return () => {
        thisVal.removeSubscribe(topic, func);
      }
    })(this, topic, func)
  }
  removeSubscribe(topic: T, func: Function) { // 解除订阅
    let subscribes = this.deps.get(topic);
    if (!subscribes) {
      return
    }
    subscribes.delete(func);
  }
  /**
   * @description 发布通知
   * @param topic 发布者
   * @param arg 可以传入任意数里参数，会在订阅者回调回显
   * @returns void
   */
  publish (topic: T, ...arg: any[]): void {
    const subscribes = this.deps.get(topic);
    if (!subscribes) {
      return
    }
    subscribes.forEach(fn => {
      fn.apply(null, [topic, ...arg]);
    })
  }
  
}
// let observable = new Observable<string>();
// observable.subscribe('test', () => {console.log('触发1')});
// const remove = observable.subscribe('test', () => {console.log('触发2')});
// remove();
// observable.subscribe('test', () => {console.log('触发3')});
// setTimeout(() => {
//   observable.publish('test');
// }, 1000);

