/**
 * UMD - UMD 模块既可以用作模块（通过导入），也可以用作全局模块（在没有模块加载器的环境中运行时）
 * UMD 模块检查是否存在模块加载器环境
 * 在node中用require加载，在浏览器用script标签
 */

(
  function (root, factory) {
    // "b" - 依赖的模块
    // root - 全局this; factory - 内容函数
    if (typeof define === 'function' && define.amd) {
      // AMD环境
      define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
      // commonJS环境
      module.exports = factory(require('path'));
    } else {
      // 浏览器全局
      root.libUMD = factory(root['b']);
    }
  }
)(typeof self !== 'undefined' ? self : this, function (b) {
  // Use b in some fashion.

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {
    name: 'test',
    printName() {
      console.log(this.name);
    }
  }
})