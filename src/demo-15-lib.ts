/**
 * 15. 高质量声明文件 - 实现
 */

// 1. 对象
export const myLib = {
  makeGreeting: function (s: string) {
    console.log(s);
    return s;
  },
  numberOfGreetings: 0
}
// 2. 函数重载
export function getWidget(): any {
  return 1
}

// 3. 复用类型 - 接口
export function greet() {}

// 4. 复用类型 -  类型别名
export class MyGreeter {
  name: string;
  greeting: string;
  constructor(name: string) {
    this.name = name;
  }
}

export function greet2() {}

// 5. 组织类型
export class MyGreeter2 {
  log(options: GreetingLib.options.log) {
    if (options.verbose) {
      console.log('log - verbose');
    }
  }
  alert(options: GreetingLib.options.alert) {
    console.log('alert - is modal: ' + options.modal);
    if (options.title) {
      console.log('alert - title: ' + options.title);
    }
  }
}


