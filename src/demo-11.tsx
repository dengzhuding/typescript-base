/**
 * 11. JSX - 是一种嵌入式的类似XML的语法，它可以被转换成合法的Javascript
 * Typescript支持内嵌，类型检查以及将JSX直接编译为Jacascript
 * TypeScript具有三种JSX模式： preserve ， react 和 react-native;这些模式只在代码生成阶段起作用 - 类型检查并不受影响
 *   preserve     - 模式下生成代码中会保留JSX以供后续的转换操作使用（比如：Babel）,另外，输出文件会带有 .jsx 扩展名
 *   react        - 模式会生成 React.createElement ，在使用前不需 要再进行转换操作了，输出文件的扩展名为 .js 
 *   react-native - 相当 于 preserve ，它也保留了所有的JSX，但是输出文件的扩展名是 .js
 */
import React from 'react';

// 在tsx文件中禁止使用尖括号类型断言，只能用as语法
/**
 * @interface for test
 */
interface Foo2 {
  name: string;
}
let foo2 = {} as Foo2;
foo2.name = 'hello';

// 固有元素（小写字母开头） vs 基于值的元素（大写字母开头）
// JSX表达式<expr /> - expr可能引用环境自带的某些东西（如DOM环境下的div,span等）或者是你自定义的组件 ，区别：
// 1. 对于React，固有元素会生成字符串（ React.createElement("div") ）， 然而由你自定义的组件却不会生成 （ React.createElement(MyComponent) ）
// 2. 传入JSX元素里的属性类型的查找方式不同。 固有元素属性本身就支持，然而 自定义的组件会自己去指定它们具有哪个属性。

declare global {
  namespace JSX {
    // 固有元素会使用特殊的接口JSX.IntrinsicElements来查找（默认的，如果这个接口没有指定，会全部通过）
    interface IntrinsicElements {
      bar: {foo?: boolean};
    }

    // 元素的实例类型必须赋值给JSX.ElementClass或抛出一个错误
    // 默认的 JSX.ElementClass 为 {} ，但是它可以被扩展用来限制JSX的类型 以符合相应的接口
    // interface ElementClass extends React.Component<any> { // - react设定的类型
    //     render(): React.ReactNode;
    // }

    // 使用哪个属性来确定类型取决
    // interface ElementAttributesProperty { props: {}; }  // - react设定的类型
  }
}
<div/>;
<bar foo={true}/>;

// 基于值的元素 - 会在它所在的作用域里面按照标识查找;
// 有2种方式定义基于值的元素：
// a. 无状态函数组件（SFC）- 优先解析：第一个参数是props参数，强制返回值可以赋值给JSX.Element
interface TestButtonProps {
  id: string;
  title: string;
  child: JSX.Element;
}
function TestButton({id, title, child}: TestButtonProps) {
  return <button id={id} title={title}>{child}</button>
}
<TestButton id="test-btn-1" title={'Button'} child={<span>hello</span>}/>

// b. 类组件
class MyComponent { // 类
  render() {}
}
let myComponent = new MyComponent();
// 元素 类的类型 - MyComponent
// 元素 实例的类型 - {render() => void}

function MyFactoryFunction () { // 工厂函数
  return {
    render() {}
  }
}
let myFactoryFunction = MyFactoryFunction();
// 元素 类的类型 - MyFactoryFunction
// 元素 实例的类型 - {render() => void}
<span title='hello span'></span>;
<bar foo={true}/>;

// 属性类型检查
// 对于固有元素：是JSX.IntrinsicElements的类型
// 对于基于值的类型：
//   它取决于先前确定的在元素实例类型上的某个属性的类型;至于该使用哪个属性来确定类型取决于JSX.ElementAttributesProperty;
//   它应该使用单一的属性来定义;这个属性名之后会被使用;TypeScript 2.8,如果未指定 JSX.ElementAttributesProperty,那么将使用类元素构造函数或SFC调用的第一个参数的类型
interface MyComponent2PropType {
  name: string;
  other: number;
  count: number;
}
class MyComponent2 extends React.Component<MyComponent2PropType, {name: string}> { // React.Component<P, S> P - 传入参数类型，S - 组件内状态类型
  props: MyComponent2PropType;
  state: Readonly<{ name: string; }>;
  render() {
    this.setState({
      name: '2'
    })
    return 'hello'
  }
}
<MyComponent2 name='hello' other={1} count={2}/>;

// 子孙类型检查 - 用 JSX.ElementChildrenAttribute 来决定 children 名

// 如不特殊指定子孙的类型，我们将使用React typings里 的默认类型
<div>
  <h1>hello</h1>
</div>
function MyComponent4 (props: {children: JSX.Element}) {
  return (
    <div>
      {props.children}
    </div>
  )
}
<MyComponent4><h2>hello</h2></MyComponent4>

// 指定children类型
class MyComponent3 extends React.Component<{children: JSX.Element | JSX.Element[]}, {}> {
  render() {
    return (
    <div>
      {this.props.children}
    </div>
    )
  }
}
<MyComponent3>
  <h1>hello world.</h1>
  <h1>hello world2.</h1>
</MyComponent3>

// JSX结果类型 - 默认的JSX表达式结果类型为any
// 你可以自定义这个类型，通过指定JSX.Element接口;然而,不能够从接口里检索元素,属性或JSX的子元素的类型信息;它是一个黑盒

// 嵌入的表达式 - JSX允许你使用{}标签来内嵌表达式
let a = <div>
  {['hello', 'world'].map(i => {
    return (
      // <span>{i / 2}</span> // error: 算术运算左侧必须是 "any"、"number"、"bigint" 或枚举类型
      <span>{i}</span>
    )
  })}
</div>

// React整合 - 要想一起使用JSX和React，你应该使用React类型定义 。
// ///<reference path="react.d.ts">
interface Props {
  foo: string;
}
class MyComponent5 extends React.Component<Props, {}> {
  render() {
    return (
      <span>{this.props.foo}</span>
    )
  }
}
<MyComponent5 foo='hello world.'/>;
// <MyComponent5 foo={1}/>; // error: 需要的是string类型

// 工厂函数 - jsx: react 编译选项使用的工厂函数是可以配置的
// 可以使用 jsxFactory 命令行选项，或内联的 @jsx 注释指令在每个文件上设置。比如
// import { render, h } from 'preact';
// /** @jsx h */
// const x = <div/>