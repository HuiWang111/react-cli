# React & Typescript 项目模板

## 运行
```shell
npm ci # 只在第一次运行时需要
npm run dll # 只在第一次运行时需要
npm start
```

## src/utils/httpUtils使用示例
```tsx
import { http, HttpError } from 'utils'

const fetchSomeData = async () => {
    try {
        await http.get('/someApi')
        // success...
    } catch (e) {
        // error ...
        if (e instanceof HttpError) {
            // 如果使用统一的错误处理，则调用useDefaultHandler方法
            // 并将error对象传递过去
            e.useDefaultHandler(e.error)

            // 否则不调用即可，在这里中自己写错误处理
            
        } else {
            console.error(errorObj)
        }
    }
}
```

## 文档
- [@reduxjs/toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [Ant Design](https://ant.design/index-cn)
- [moment](http://momentjs.cn/)
- [react](https://zh-hans.reactjs.org/)
- [react-hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)
- [classnames](https://github.com/JedWatson/classnames)
- [jest](https://jestjs.io/zh-Hans/)
- [typescript](https://www.typescriptlang.org/)
- [js-cookie](https://github.com/js-cookie/js-cookie)

## 文章
- [Using TypeScript with Redux Toolkit](https://blog.logrocket.com/using-typescript-with-redux-toolkit/)
