/// <reference path="./lib-global.d.ts" />

/**
 * 这里用作浏览器环境操作DOM
 */
// const greetResult = createGreeting('Bob');
// console.log(greetResult, createGreeting.getHelloStr());

/**
 * node环境
 */
import libUMD from './lib-umd';
libUMD.printName();
console.log(libUMD.name);
import printInfo from './lib-module';
printInfo();