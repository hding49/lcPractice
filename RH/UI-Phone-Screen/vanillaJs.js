// ============================
// Vanilla JS 系统复习大纲注释版
// ============================

// 1. 基础语法和数据类型
/*
  - 变量声明：var, let, const
    * var 是函数作用域，let 和 const 是块作用域
    * const 声明常量，不能重新赋值
  - 基本数据类型：Number, String, Boolean, null, undefined, Symbol, BigInt
    * 使用 typeof 来判断类型
    * 注意隐式和显式类型转换
  - 复杂数据类型：Object, Array, Function
    * 引用类型赋值是引用地址，比较是引用地址比较
  - 字符串模版
    * 使用模板字符串 `${变量}`
  - 字符串常用方法：
    * slice(), substring(), substr(), indexOf(), includes(), startsWith(), endsWith()
*/

// 2. 函数与作用域
/*
  - 函数声明与表达式
    function foo() {}
    const foo = function() {};
    const foo = () => {};
  - 箭头函数没有 this 绑定，也没有 arguments 对象
  - 函数参数和默认值：function foo(a, b=2){}
  - 剩余参数和展开运算符
    function foo(...args) {}
    const arr2 = [...arr1, 4, 5];
  - 作用域链和闭包
    * 变量提升（hoisting）
    * 闭包用于数据私有化和缓存等场景
  - this 关键字绑定规则
    * 默认绑定、隐式绑定、显式绑定(call/apply/bind)、new绑定
*/

// 3. 对象和原型链
/*
  - 对象字面量定义
    const obj = {a:1, b:2};
  - 属性访问
    obj.a; obj['b'];
  - 对象遍历
    for...in 遍历属性（含原型链）
    Object.keys(), Object.values(), Object.entries()
  - 属性描述符、getter/setter
  - 原型链与继承
    Object.create()
    class 语法和原型继承
    instanceof 操作符
*/

// 4. 数组操作
/*
  - 创建和访问数组
  - 常用数组方法
    * 变异方法：push(), pop(), shift(), unshift(), splice(), sort(), reverse()
    * 不变方法：map(), filter(), reduce(), forEach(), find(), some(), every()
  - 数组去重
  - 多维数组扁平化
  - 稀疏数组与空位的区别
*/

// 5. 异步编程
/*
  - 回调函数
  - Promise
    new Promise(), then(), catch(), finally()
    Promise 链和错误处理
  - async / await
  - 事件循环机制，宏任务和微任务
*/

// 6. DOM 操作和事件处理
/*
  - DOM 选择器
    getElementById(), getElementsByClassName(), querySelector(), querySelectorAll()
  - 创建和修改节点
    createElement(), appendChild(), removeChild(), innerHTML, textContent
  - 事件绑定
    addEventListener(), removeEventListener()
    事件冒泡与捕获
    事件委托
  - 事件对象常用属性
    event.target, event.currentTarget, event.preventDefault(), event.stopPropagation()
*/

// 7. BOM (浏览器对象模型)
/*
  - window 对象
  - 定时器
    setTimeout(), setInterval(), clearTimeout(), clearInterval()
  - location, history, navigator 对象
  - localStorage 和 sessionStorage
*/

// 8. 错误处理
/*
  - try...catch...finally
  - 自定义错误和抛出
    throw new Error('message');
*/

// 9. ES6+ 新特性
/*
  - 解构赋值
  - 模板字符串
  - 默认参数
  - 箭头函数
  - 模块导入导出 import/export
  - Set 和 Map
  - class 和继承
  - Symbol
*/

// 10. 面试常见题型技巧
/*
  - 实现简易 Promise
  - 实现深拷贝函数
  - 数组去重
  - 实现事件总线 EventEmitter
  - 实现 debounce 和 throttle
  - 实现 flatten 多维数组扁平化
  - 手写 bind 函数
  - 解释 this 指向和绑定机制
  - 实现函数柯里化
*/
