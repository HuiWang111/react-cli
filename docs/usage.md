# setup-react-env

### 项目模板
- [react-dom](https://github.com/HuiWang111/react-ts-templete/tree/bizfocus/mobx)
- [react-native](https://github.com/HuiWang111/RNTemplete)

### 为什么使用setup-react-env？
- 快速搭建项目，提升开发效率
- 形成统一的规范 (也统一 `react-dom` 和 `react-native` 写法)

### 如何使用？
- 安装
```shell
npm i setup-react-env -g
```
- 创建项目
```shell
setup-react-env --init
# or
setup-react-env -i
```
- 查看版本号
```shell
setup-react-env --version
# or
setup-react-env -v
```

### 模板说明
- 状态管理选定为 `mobx`
- `mobx` 使用介绍
- 模板目录介绍
- vscode eslint
- `httpUtil` 统一错误处理介绍
- 是否需要使用 `model` 的讨论

### typescript介绍
- 泛型介绍
    - 类型共性的提取
    ```ts
    const array: Array<string> = ['a', 'b'];
    ```
    - 定义一个复杂类型的时候，其中一部分无法确定是什么类型（需要在具体场景下确定），如果写any的话就无法进行类型约束，这个时候就需要用到泛型
    - 类似于函数传参

- 类型窄化介绍
    - is [示例](https://github.com/HuiWang111/utils/blob/master/src/validate.ts)
    - as
    ```ts
    const age: string | number = 18;

    const printAge = (age: number) => {
        console.log(age);
    }

    printAge(age as number);
    ```
    - typeof
    ```ts
    let some: string | number;

    if (typeof some === 'string') {
        some.toUpperCase();
    } else if (typeof some === 'number') {
        some.toFixed(2);
    }
    ```
    - 真值窄化
    ```ts
    let some: string | undefined;

    if (some) {
        some.toUpperCase();
    }
    ```
    - a.b?.c
    ```ts
    interface A {
        b?: {
            c: 1
        }
    }

    const a: A = {};

    console.log(a.b.c) // error
    console.log(a.b?.c) // a.b && a.b.c
    ```
    - a.b! + 1
    ```ts
    interface A {
        b?: number;
    }

    const a: A = { b: 1 };

    console.log(a.b + 1) // error
    console.log(a.b! + 1)
    ```
- [type-challenges](https://github.com/type-challenges/type-challenges/blob/master/README.zh-CN.md)

### react的介绍
- react hook
    - 关注点分离
- react 17的变化
    - react17以前jsx被编译为React.createElement，因此需要在每个文件显式引入react。
    - react17不再需要显式引入react，使用react其他api只需要如下引入方式
    ```js
    import { useState, useEffect } from 'react'
    ```
- [react-preview](https://reactpreview.com/usage) vscode插件介绍

### mobx & mobx-react-lite的介绍
- observable
    - observable.map
    - observable.set
    - observable.shallow
- observer
- computed
- toJS
- slice

### 为何使用mobx 而不是redux？
- mobx简单易懂，与vue的状态管理思想很相近
- 虽然redux更符合react函数式编程的思想，但我认为数据管理使用面向对象(mobx更适合面向对象)的思想去写更好(组件当然使用函数式编程更好)
- mobx性能不会比redux差，而且mobx更简单(redux需要理解 `action/reducer/saga/middleware/slice/store/immutable/thunk` 等概念)


### 业务逻辑与组件的解耦
- 业务逻辑与UI组件应该完全解耦
- 业务逻辑与容器组件应该松散耦合
    - 业务逻辑写到store和model中
    - 容器组件只是在调用封装好的业务逻辑函数

### react-demo 与 react-native 模板的差异点
- react-native中的 `AsyncStorage` 模块的 `setItem` | `getItem` | `removeItem` 操作都是异步的

