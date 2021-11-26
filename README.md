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

## TODOS
- [x] 模板增加基本的hook，如`useMount`等
- [x] create 命令改成选择模板
- [ ] 增加generate命令，自动生成文件
    - [x] `sre generate store [storeName]`
    - [x] `sre generate view [viewName]`
    - [x] `sre generate style [styleName]`
    - [x] `sre generate api [apiName]`
    - [x] `sre generate model [modelName]`
    - [ ] `sre generate module [moduleName]`
- [ ] 增加templete命令，可以将本机的文件夹作为templete加入的脚手架中