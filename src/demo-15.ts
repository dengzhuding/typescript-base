/**
 * 15. 高质量声明文件
 */

/// <reference path="demo-15-lib-t.d.ts" />

import * as demo15Lib from './demo-15-lib'
for (let key in demo15Lib) {
  (global as any )[key] = (demo15Lib as any )[key]
}
// 1. Objects with Properties
let result = myLib.makeGreeting('hello');
let count = myLib.numberOfGreetings;

// 2. 函数重载
getWidget(1);
getWidget('1');
// getWidget(true); // error

// 3. 复用类型 - 接口
greet({
  greeting: 'hello world',
  duration: 1000
})

// 4. 复用类型 -  类型别名
function getGreeting() {return 'hello'}
greet2('');
greet2(getGreeting);
greet2(new demo15Lib.MyGreeter(''));
// greet2(true); // error

// 5. 组织类型
const g = new demo15Lib.MyGreeter2();
g.log({
  verbose: true
})
g.alert({
  modal: true,
  title: 'title'
})

const myGreeter = new demo15Lib.MyGreeter('');
myGreeter.greeting = 'howdy';
