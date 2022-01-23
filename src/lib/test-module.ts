
export interface InfoOptions {
  name: string;
  age?: number;
}

export let printStr = function (str: string): void {
  console.log(str);
}

export let UserInfo = class {
  constructor(public name: string, public age?: number) {}
  getName (): string {
    return this.name;
  }
}
