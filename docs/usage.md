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
### react的介绍
- react 与 vue
    - 插值表达式 {{ name }}
    ```jsx
    <div>{ name }</div>
    ```
    - data: { isActive: true }
    ```js
    const [isActive, setIsActive] = useState(false);
    ```
    - Vue.component
    在react中，使用组件不需要注册，只需要导出、导入即可
    ```js
    // Component.js
    export const Component = () => {
        return (
            <div>
                // ...
            </div>
        );
    }
    ```
    ```js
    // Page.js
    import { Component } from './Component';

    const Page = () => {
        return (
            <Component></Component>
        );
    }
    ```
    - 事件
    ```jsx
    // vue
    <div @click="handleClick"></div>
    ```
    ```jsx
    // react
    // !!! 注意，vue中看着是字符串的有可能是表达式；而在react中不存在这种情况，字符串和表达式是严格区分的
    // { name } 是表达式， "name" 是字符串；使用模板字符串需要这样 {`hello, ${name}`}
    <div onClick={handleClick}></div>
    ```
    - v-html
    ```jsx
    const html = '<span></span>';
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
    ```
    - 生命周期
    ```js
    import { useEffect } from 'react';

    useEffect(() => {
        // 每一次渲染都会执行这个回调

    });

    useEffect(() => {
        // mounted回调

        return () => {
            // beforeDestroy回调

        }
    }, []);

    useEffect(() => {
        // 该回调第一次会执行以及somevar有变化的时候也会执行

    }, [somevar]);
    ```
    - 组件传值方法
        - props传递
        ```jsx
        const Child = ({ name }) => {
            console.log(name); // name
        };
        const Parent = () => {
            return (
                <Child name='name'>
            );
        }
        ```
        - context传递
        ```js
        import { createContext, useContext } from 'react';

        const NameContext = createContext({
            name: 'name'
        });

        const { name } = useContext(NameContext);
        ```
        - 状态管理 `mobx` `redux`
        - 发布订阅模式
            类似于 `vue` 的 vm.$emit，但是react中不提供这样的api，需要自己写自定义事件的监听和触发，一般不建议使用
    - slot
    ```jsx
    // jsx中没有slot改变，类似的事children
    const Comp = ({ children }) => {
        return (
            <div>
                { children } // <a></a>
            </div>
        )
    };

    const Demo = () => {
        return (
            <Comp>
                <a></a>
            </Comp>
        );
    }
    ```
    - 条件渲染 v-if
    ```jsx
    condition && <div></div>

    condition ? <div></div> : null
    ```
    - 列表渲染 v-for
    ```jsx
    list.map(item => {
        return <div key={item.id}></div>
    })
    ```
    - 双向绑定 v-model
    ```jsx
    // react中默认不实现双向绑定
    const [value, setValue] = useState('1');

    const handleChange = (value) => {
        setValue(value);
    }

    <input value={value} onChange={handleChange} />
    ```
- react hook
    - 关注点分离
- react 17的变化
    - react17以前jsx被编译为React.createElement，因此需要在每个文件显式引入react。
    - react17不再需要显式引入react，使用react其他api只需要如下引入方式
    ```js
    import { useState, useEffect } from 'react';
    ```
- [react-preview](https://reactpreview.com/usage) vscode插件介绍

### react相关文档
- [官方中文文档](https://react.docschina.org/)
- [React Router 使用教程](https://www.ruanyifeng.com/blog/2016/05/react_router.html)
- [React 技术栈系列教程](https://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html)
- [React 入门实例教程](https://blog.csdn.net/u014388408/article/details/50595047)

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

### 模板说明
- 状态管理选定为 `mobx`
- `mobx` 使用介绍
- 模板目录介绍
- vscode eslint
- `httpUtil` 统一错误处理介绍
- 是否需要使用 `model` 的讨论


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

