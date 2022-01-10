# setup-react-env

## install
```shell
npm i setup-react-env -g
```

## usage
### to create react app
```shell
setup-react-env create
# or
sre create
```

### version
```shell
setup-react-env --version
# or
sre --version
```

### help
```shell
setup-react-env --help
# or
sre --help
```

### generate
[how to use generate command](https://github.com/HuiWang111/setup-react-env/blob/main/docs/generate.md)

### publish
[how to use publish command](https://github.com/HuiWang111/setup-react-env/blob/main/docs/publish.md)

## TODOS
- [ ] 增加templete命令，可以将本机的文件夹作为templete加入的脚手架中
- [ ] react-native-mobx模板更新点
    - [ ] 增加 `utils/prompt.tsx` (考虑是否组件库直接兼容支持传字符串)
    - [x] httpUtils 增加loading效果及其他更新
    - [x] 增加 `useRouterState` hook
    - [x] consts中增加Toast时间常量
    