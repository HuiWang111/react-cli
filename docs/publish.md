# Publish Command

## Quickly Start
- Step1. install global
```bash
npm i setup-react-env -g
# or
yarn global add setup-react-env
```

- Step2. create config file
```bash
touch sre-rn-publish.config.js
```
```js
// sre-rn-publish.config.js
module.exports = {
    shouldCleanCodeChange: true,
    // 根据当前分支来决定发布正式还是发布测试
    mode: (currentBranch) => {
        return currentBranch === 'production'
            ? 'production'
            : 'test'
    },
    shouldRewriteApplicationId: true,
    applicationId: 'com.fgnewapp',
    // 通过当前日期来生产版本号
    generateVersion: ({ year, month, day }) => {
        return `C1.${year.slice(2)}.${month}.${day}`
    },
    // 生成环境变量
    generateEnv: (mode) => {
        return mode
    },
    // 根据环境变量生成不同的appName（安装后显示的名称）
    generateAppName: (mode) => {
        return {
            appName: mode === 'test'
                ? '新版数字仓储测试版'
                : '新版数字仓储',
            toReplaceAppName: '新版数字仓储'
        }
    },
    codePush: {
        getMessagePrefix: ({ year, month, day }) => {
            return `${year}${month}${day} `
        },
        getDeploymentName: (mode) => {
            return mode === 'test'
                ? 'Staging'
                : 'Production'
        },
        ownerName: 'scmc',
        appName: 'finish-goods',
        /**
         * 默认使用最新的 appcenter codepush ... 命令
         * 如果使用的旧版本的codepush可以用这个函数返回一个命令
         * 具体用法见下方文档
         */
        getCustomizedCommand: () => {
            return ...
        }
    },
    shouldCopyApp: true
}
```

- Step3. scripts in package.json
```json
"scripts": {
    // ...
    "build": "sre publish react-native --no-codePush --open",
    "publish": "sre publish react-native"
},
```

- Step4. run publish command 
```bash
npm run publish
# or
npm run publish -- -m "publish message"
```

## Configuration
### shouldCleanCodeChange
打包完成后是否执行 `git checkout .` 清空代码的改动
由于打包过程中可能会有写入文件的操作造成代码的改动，而这些打包完成之后无需保留，此时可以设置该项为true

| type | default | required |
| ---- | ---- | ---- |
| boolean | true | false |

### mode
打正式包还是打测试包

| type | default | required |
| ---- | ---- | ---- |
| `test` or `production` | none | false |

### shouldRewriteApplicationId
是否重写applicationId，区分测试和生产环境的applicationId可以实现在同一台机器上同时安装测试版和正式版

| type | default | required |
| ---- | ---- | ---- |
| boolean | false | false |

### applicationId
当开启重写applicationId时，需要将目前applicationId传递进来；applicationId在 android/app/build.gradle 文件中

| type | default | required |
| ---- | ---- | ---- |
| string | none | false |

### generateVersion
是否生成版本

| type | default | required |
| ---- | ---- | ---- |
| false or GenerateVersionCallback | false | false |
```ts
type GenerateVersionCallback = (params: GenerateVersionParams) => string;
type PublishMode = 'test' | 'production';

export interface GenerateVersionParams {
    year: string;
    month: string;
    day: string;
    mode: PublishMode;
}
```

### versionFilePath
版本号写入文件的路径

| type | default | required |
| ---- | ---- | ---- |
| string | `src/config` | false |

### extname
写入文件的拓展名

| type | default | required |
| ---- | ---- | ---- |
| `ts` or `js` | `ts` | false |

### generateEnv
是否生成环境变量

| type | default | required |
| ---- | ---- | ---- |
| false or GenerateEnvCallback | false | false |
```ts
type GenerateEnvCallback = (mode: PublishMode) => string;
```

### envFilePath
环境变量写入文件的路径

| type | default | required |
| ---- | ---- | ---- |
| string | `src/config` | false |

### generateAppName
是否重写app安装后的显示名称，常用于安装后区分测试版还是正式版

| type | default | required |
| ---- | ---- | ---- |
| false or GenerateAppNameCallback | false | false |
```ts
interface GenerateAppNameCallbackReturn {
    appName: string;
    toReplaceAppName: string;
}

type GenerateAppNameCallback = (mode: PublishMode) => GenerateAppNameCallbackReturn;
```

### codePush
打包完成后是否自动 codepush

| type | default | required |
| ---- | ---- | ---- |
| false or CodePushOptions | false | false |
```ts
type GetMessagePrefixCallback = (params: GenerateVersionParams) => string;
type GetDeploymentNameCallback = (mode: PublishMode) => string;
type GetCustomizedCommandCallback = (params: {
    deploymentName: string,
    ownerName: string,
    appName: string,
    messagePrefix: string,
    message: string
}) => string;

interface CodePushOptions {
    getCustomizedCommand?: GetCustomizedCommandCallback;
    getMessagePrefix?: GetMessagePrefixCallback;
    getDeploymentName: GetDeploymentNameCallback;
    ownerName: string;
    appName: string;
}
```

### open
打包发布完成之后是否自动打开apk所在文件夹

| type | default | required |
| ---- | ---- | ---- |
| boolean | false | false |

### shouldCopyApp
打包完成后是否自动复制一个apk文件。
test模式会复制一个名为 app-release.test.apk，production 模式会复制一个名为 app-release.prod.apk；

| type | default | required |
| ---- | ---- | ---- |
| boolean | false | false |

### onComplete
打包发布完成之后的回调

| type | default | required |
| ---- | ---- | ---- |
| (mode: PublishMode) => void | false | false |

## Options
```bash
sre publish react-native --m "pusblish message"
```
指定发布热更时的 description

```bash
sre publish react-native --config ./pulish.config.js
```
指定配置文件，覆盖默认配置文件
