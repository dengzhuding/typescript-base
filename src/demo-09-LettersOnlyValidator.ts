import {StringValidator} from './demo-09-StringValidator'

export class LettersOnlyValidator implements StringValidator {
  lettersRegexp: RegExp = /^[A-Za-z]+$/;
  isAcceptable(s: string): boolean {
    return this.lettersRegexp.test(s);
  }
}