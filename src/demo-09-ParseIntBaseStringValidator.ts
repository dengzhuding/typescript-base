

export class ParseIntBaseStringValidator {
  isAcceptable(s: string): boolean {
    return s.length === 5 && parseInt(s).toString() === s;
  }
}

// 重新导出 - 不会在当前模块导出哪个模块，也不会定义一个新的局部变量
export {MainZipCodeValidator as RegExpBasedZipCodeValidator} from './demo-09-StringValidator'
// console.log(RegExpBasedZipCodeValidator); // error: 找不到名称“RegExpBasedZipCodeValidator”