/**
 * 13. 三斜线指令 - 是包含单个XML标签的单行注释，前面只能出现注释，否则被视为普通单行注释
 * 
 * /// <reference path="..." />  - 用作文件之间依赖关系的声明
 * /// <reference types="..." /> - 声明对包的依赖
 * /// <reference lib="..." />   - 该指令允许文件显式包含现有的内置lib文件
 * /// <reference no-default-lib="true"/> - 该指令将文件标记为默认库
 * /// <amd-module name="NamedModule"/> 该amd-module指令允许将可选模块名称传递给编译器
 */

/// <reference types="node" />
import http from 'http'
let server = http.createServer((req, res) => {
})
let fooStr = 'foo'.padEnd(10, 'hello');
console.log(fooStr);