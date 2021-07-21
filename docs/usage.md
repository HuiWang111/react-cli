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
- 类型窄化介绍
    - is
    - as
    - typeof
    - 真值窄化
    - a?.b + 1
    - a.b! + 1
- `interface` 与 `type`
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

