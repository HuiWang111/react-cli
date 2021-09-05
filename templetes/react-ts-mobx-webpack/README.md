# React & Typescript 项目模板

## 注意点！！！
- 所有页面、组件均使用函数组件&hook，函数组件性能优于class组件
- 原则上UI组件是无状态组件，所有展示数据都由容器组件通过props或者context传递进来。UI组件中不应该有任何逻辑判断，应该在容器组件中判断好再传递进来。即：容器组件给什么UI组件就展示什么
- 可以抽象的复杂逻辑最好抽到utils中并写好测试用例
- 组件拆分原子化（按功能拆分），组件拆的越细，mobx效率越高
- 安裝react/react-dom/moment/antd/axios/js-cookie/mobx/mobx-react-lite/react-router-dom任何一个新版后，需要重新 `npm run dll`
- > 务必启用vscode插件ESLint，保存的时候自动格式化，配置在下面

## 命名规范
- 文件命名使用驼峰命名，例如：`appContext.ts`
- 组件命名 & 组件文件命名（包括容器组件和UI组件）首字母大写 & 驼峰命名，例如：`NumberInput.tsx`
- 文件夹命名使用中划线命名 & 全部小写，例如：`user-config`
- 方法名、变量、常量、对象属性命名使用驼峰命名，例如：`isBoolean`
- 全局常量、配置常量使用大写字母 & 下划线分割，例如：`const TOKEN_KEY = 'TOKEN'`
- className命名使用中划线命名 & 全部小写，例如：`login-container`
- interface以I开头 & 首字母必须大写 & 驼峰命名，例如：`ICurrentUser`
- 路由命名使用中划线命名 & 全部小写，例如：`reset-pwd`

## vscode ESLint配置
```json
{
    "[javascript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint",
        "editor.formatOnSave": true
    },
    "[typescript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint",
        "editor.formatOnSave": true
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint",
        "editor.formatOnSave": true
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint",
        "editor.formatOnSave": true
    },
    "files.associations": {
        "*.tsx": "typescriptreact"
    },
    "eslint.format.enable": true,
    "editor.detectIndentation": false,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "vue"
    ],
}
```

## 运行
```shell
npm ci # 只在第一次运行时需要
npm run dll # 只在第一次运行时需要
npm start
```

## src/utils/httpUtils使用示例
```tsx
import { Http, HttpError } from 'utils'

const httpClient = new Http().client // 此处为了演示

const fetchSomeData = async () => {
    try {
        await httpClient.get('/someApi')
    } catch (e) {
        if (e instanceof HttpError) {
            // 如果想要阻止默认的错误处理调用preventDefault即可
            e.preventDefault()

            // 阻止之后写自定义的错误处理
        } else {
            console.error(e)
        }
    }
}
```

## 文档
- [mobx](https://zh.mobx.js.org/README.html)
- [Ant Design](https://ant.design/index-cn)
- [moment](http://momentjs.cn/)
- [react](https://zh-hans.reactjs.org/)
- [react-hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)
- [classnames](https://github.com/JedWatson/classnames)
- [jest](https://jestjs.io/zh-Hans/)
- [typescript](https://www.typescriptlang.org/)
- [js-cookie](https://github.com/js-cookie/js-cookie)
- [react-router](https://reactrouter.com/web/example/basic)

## 文章
- [Using MobX for large-scale enterprise state management](https://blog.logrocket.com/using-mobx-for-large-scale-enterprise-state-management/)
- [Why React Hooks cannot be conditioned](https://blog.atomrc.dev/p/why-you-cannot-condition-react-hooks/)

## 目录结构
```
|—— public/
|—— scripts/
|—— src/
    |—— apis/ 后端接口
    |—— app/ 根组件
    |—— assets/ 静态资源
    |—— components/ 公用组件
    |—— config/ 各种全局配置
    |—— consts/ 各种全局常量
    |—— hooks/ 公用hook
    |—— layout/
    |—— models/
    |—— stores/
    |—— styles/ 各种全局样式
    |—— types/
    |—— utils/
    |—— views/
        |—— some-page/
            |—— components/ 放置页面UI组件
                |—— some-component/
                   |—— SomeComponent.tsx
                   |—— some-component.less 
            |—— hooks/ 放置页面hook
                |—— useSome.ts
            |—— styles/ 放置页面样式，使用less
                |—— some-page.less
            |—— containers/ 放置页面容器组件
                |—— SomePage.tsx
                |—— SomePageDetail.tsx
            |—— types.ts 页面类型声明文件
            |—— index.ts 页面入口文件
            |—— constants.ts 页面常量
            |—— route.ts 页面路由文件
|—— webpack/ webpack配置
```

## 数据流
![avatar](https://github.com/HuiWang111/react-ts-templete/blob/bizfocus/mobx/public/assets/flow/flow.png)


## 路由流程
![avatar](https://github.com/HuiWang111/react-ts-templete/blob/bizfocus/mobx/public/assets/router/router.png)

## 开发环境配置修改
### 端口修改
修改webpack/config.dev.js中DEV_CONF.port

### api请求转发地址修改
修改webpack/config.dev.js中DEV_CONF.proxyPath
关于proxy配置详见[devServer.proxy](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)
