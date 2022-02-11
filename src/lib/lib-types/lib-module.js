/**
 * 模块化库（存在下面条件之一）:
 *   1. 无条件的调用require或define
 *   2. 有import * as b from 'b', export c 这类声明
 *   3. 赋值给给exports 或module.exports
 * 
 * 极少对window,global的赋值
 */

// es6语法
export default function printInfo () {
  console.log('here is module lib.')
}