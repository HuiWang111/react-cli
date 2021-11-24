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
    - [ ] `sre generate store [storeName]`
    - [ ] `sre generate view [viewName]`
    - [ ] `sre generate style [styleName]`
    - [ ] `sre generate api [apiName]`
    - [ ] `sre generate model [modelName]`
    - [ ] `sre generate module [moduleName]`
- [ ] 增加templete命令，可以将本机的文件夹作为templete加入的脚手架中