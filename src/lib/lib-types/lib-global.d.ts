
// 全局声明函数
declare function createGreeting(name: string): boolean;
// 声明属性
declare namespace createGreeting {
  function getHelloStr(): string;
}