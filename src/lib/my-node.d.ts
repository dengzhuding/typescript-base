/**
 * 这里面的声明node.d.ts都有，安装@types/node就行(url,path等模块声明)
 */
declare module 'url' {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathanme?: string;
  }
  export function parse(urlStr: string): Url
}
// 声明外部模块,用法： import * as Path from 'path'
declare module 'path' {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export let sep: string;
}

// 简写声明-简写模块里所有导出的类型将是any,用法： import x, {y} from 'hot-new-module'
declare module 'hot-new-module';

// 模块声明通配符, 用法：import fileContent from './xxx.txr!text'
declare module '*!text' {
  const content: string;
  export default content;
}

// UMD模块,用法：import {isPrime} from 'math-lib'
// export function isPrime(x: number): boolean;
// export as namespace mathLib;
