/**
 * 9.2 模块导出
 */

// 任何声明（比如变量，函数，类，类型别名或者接口）都能通过添加export关键字来导出
export interface StringValidator {
  isAcceptable(s: string): boolean
}
class ZipCodeValidator implements StringValidator {
  numberRegexp: RegExp = /^[0-9]+$/;
  isAcceptable(s: string): boolean {
    return s.length === 5 && this.numberRegexp.test(s)
  }
}
export {ZipCodeValidator as MainZipCodeValidator } // 对导出部分重命名

// 默认导出 - 只能有一个; 默认导出类和函数可以省略名字，也可以导出一个值export default 1;
export default function () {console.log('this is module - StringValidator deafult export fn.')};