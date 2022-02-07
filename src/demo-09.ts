/// <reference path="./lib/test-module.d.ts" />
/// <reference path="./lib/my-node.d.ts" />

/**
 * 9. 模块 - 模块在其自身的作用域里执行，而不是全局作用域；
 * 这意味着定义一个模块里面的变量，函数，类等在模块外部时不可见的，除非你明确的使用export形式之一导出它们；
 * 如果想使用其他模块导出的变量，用import形式之一；
 * Typescript与ECMAScript2015一样，任何包含顶级import或者export的文件都被当作一个模块，相反，如果一个文件不带有顶级的import或export声明，那么他的内容被视为全局可见的（因此对模块也是可见的）
 */

// 9.1 命名空间（内部模块）namespace - 命名空间是位于全局命名空间下的一个普通的带有名字的JavaScript对象
// 推荐写法namespace X {}
// 使用命名空间时为了提供【逻辑分组】和【避免命名冲突】
namespace Validation {
  export const num = 1;
  export function fn() {};
  export interface Options {name: string}
}
import Options = Validation.Options;
let myOpt: Options = {
  name: ''
}
let num2 = Validation.num;

// 可以分离到不同文件 - 因为不同文件之间存在依赖关系，加入了引用标签来告诉编译器文件之间的关联。
// 第一种方式，把所有的输入文件编译为一个输出文件，需要使用 --outFile: tsc --outFile sample.js Test.ts
// 第二种方式，我们可以编译每一个文件（默认方式），那么每个源文件都会对应生 成一个JavaScript文件。 
// 然后，在页面上通过 <script> 标签把所有生成的 JavaScript文件按正确的顺序引进来


// 9.2 外部模块（模块） - 像命名空间一样，模块可以包含代码和声明。 不同的是模块可以声明它的依赖。 包含import/export声明的文件

import * as allValidator from './demo-09-AllValidator'; // 将整个模块导出到一个变量,并通过它来访问模块内容
console.dir(allValidator);

import {StringValidator as MyStringValidator} from './demo-09-StringValidator'; // 导入一个模块中的某个导出内容并重命名
let obj: MyStringValidator = {
  isAcceptable: function (s: string): boolean {
    return false
  }
}

// import './my-moudle.js'; // 不推荐，一些模块会设置一些全局状态供其它模块使用；这些模块可能没有任何的导出或用户根本就不关注它的导出

import printFn  from './demo-09-StringValidator'; // 导出默认导出的内容
printFn();

// CommonJS和AMD的环境里都有一个 exports 变量，这个变量包含了一个模块的所有导出内容；类似es6中export default语法
// 但是 export default 语法不能兼容CommonJS 和AMD的exports
// 为了兼容，Typescript提供了：export =语法 - 定义一个模块的导出对象(类，接口，命名空间，函数或枚举)
// 若使用 export = 导出一个模块，则必须使用TypeScript的特定语法 import module = require("module") 来导入此模块
// export = function () {console.log('here is the "export =" grammer export module')}; // ./demo-09-testFn内容
import fn = require('./demo-09-testFn');
fn();

// 可选的模块加载和其它高级加载场景
// 编译器会检测是否每个模块都会在生成的JavaScript中用到。 
// 如果一个模块标识符只在类型注解部分使用，并且完全没有在表达式中使用时，就不会生 成 require 这个模块的代码。
// Node,js里的动态模块加载
declare function require(moduleName: string): any;
// 下面这里由于导入的模块仅用作类型，所以编译后不会生成require()的代码，就能实现动态加载了
import {LettersOnlyValidator as Letter} from './demo-09-LettersOnlyValidator';
function getBoolean(): boolean {
  return true || Math.random() > 0.5;
}
let needZipValidation: boolean = getBoolean();
if (needZipValidation) {
  // 要注意 import 定义的标识符只能在表示类型处(- typeof Letter)使用（不能在会转换成 JavaScript的地方）
  let LettersOnlyValidator: typeof Letter = require('./demo-09-LettersOnlyValidator').LettersOnlyValidator;
  console.dir(LettersOnlyValidator);
  let validator = new LettersOnlyValidator();
  console.log('validator.isAcceptable("sss"): ', validator.isAcceptable('sss'));
}

// 使用其他的Javascript库
// a. 外部模块 - 为每个模块都定义一个.d.ts文件（最好还是卸载一个大的.d.td文件里）
import * as testModule from './lib/test-module';
testModule.printStr('hello world'); // 使用里面的方法
let userInfo: testModule.InfoOptions = new testModule.UserInfo('Bob'); // 使用里面interface和类
import * as URL from 'url'; // 这里没有安装@types/node,用的自定义的声明文件 - /// <reference path="./lib/my-node.d.ts" / >
let myUrl = URL.parse('http://www.hello.com');
console.log('myUrl: ', myUrl);

// b. 外部模块简写 - 简写模块里所有导出的类型将是any : declare module 'hot-new-module';
// import x, {y} from 'hot-new-module';
// x(y); // 检查不会报错，执行报错：Cannot find module 'hot-new-module'

/**
 * 创建模块结构指导：
 * a. 仅导出单个class或funciton - 用export deafult
 * b. 使用重新导出进行拓展 - import {Calculator} from './Calculator'; ...; export {Calculator as Calculator};
 * c. 模块里面不要使用命名空间namespace
 * */
