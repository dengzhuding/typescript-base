declare module 'test-module' {
  export interface InfoOptions {
    name: string;
    age: number;
  };
  export function printStr(str: string): void;
  export class UserInfo {
    constructor(public name: string, public age: string): void;
    getName(): string;
  }
}