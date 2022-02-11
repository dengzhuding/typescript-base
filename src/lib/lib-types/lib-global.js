/**
 * 全局库-指能在全局命名空间下访问的（不需要任何形式的import）
 * 会看到：
 *   1. 顶级的var声明或function声明(Top-level var statements or function declarations)
 *   2. 赋值给window.someName(One or more assignments to window.someName)
 *   3. 假设DOM原始值(document, window等)存在(Assumptions that DOM primitives like document or window exist)
 * 不会看到：
 *   1. 检查或使用模块加载器(require, define)
 *   2. CommonJS/Node.js风格(let xx = require('xx'), module.exports= xx, exports.xx = xx)
 *   3. 使用define(...)
 *   4. 文档说明了如何去require或import
 *   
 */

// 全局库示例

var helloStr = 'hello';
// function
function createGreeting (name) {
  const el =  document.querySelector('#greeting');
  if (el) {
    el.textContent = `helloStr${name}`;
    return true;
  }
  return false;
}
// 静态属性
createGreeting.getHelloStr = function () {
  return helloStr;
}
