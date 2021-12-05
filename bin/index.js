#!/usr/bin/env node --experimental-json-modules
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
var import_yargs_parser = __toModule(require("yargs-parser"));
var import_fs12 = __toModule(require("fs"));
var import_path14 = __toModule(require("path"));
var import_clear = __toModule(require("clear"));
var import_chalk = __toModule(require("chalk"));
var import_figlet = __toModule(require("figlet"));

// src/utils.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_ncp = __toModule(require("ncp"));
var COMMANDS = ["create", "generate"];
function getCmdAndOptions(args2) {
  const command = args2["_"];
  if (command && command.length > 0 && !COMMANDS.includes(command[0])) {
    throw new Error(`setup-react-env command must be in [${COMMANDS.join(", ")}]`);
  }
  delete args2["_"];
  return { command, options: __spreadValues({}, args2) };
}
function writeFileAndPrint(fileName, content, cwd, spinner) {
  const fullName = import_path.default.join(cwd, fileName);
  let printContent;
  if (import_fs.default.existsSync(fullName)) {
    import_fs.default.writeFileSync(fullName, content);
    printContent = `write file: ${fullName}`;
  } else {
    printContent = `not found file: ${fullName}`;
  }
  if (spinner) {
    spinner.text = printContent;
  } else {
    console.info(printContent);
  }
}
function copyDir(srcDir, destDir) {
  return new Promise((resolve, reject) => {
    (0, import_ncp.default)(srcDir, destDir, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
function upperFirst(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
function toCamelCase(str) {
  const indexes = str.split("").reduce((arr, a, i) => {
    if (/(-|_)/.test(a)) {
      arr.push(i);
    }
    return arr;
  }, []).map((i) => i + 1);
  return str.split("").map((a, i) => {
    if (indexes.includes(i)) {
      return a.toUpperCase();
    }
    return a;
  }).join("").replace(/(-|_)/g, "");
}
function isUpperCase(letter) {
  return letter.toUpperCase() === letter;
}
function isCamelCase(str) {
  return str.slice(1).split("").some(isUpperCase) && str.indexOf("-") < 0 && str.indexOf("_") < 0;
}

// src/create/index.ts
var import_path4 = __toModule(require("path"));

// src/create/question.ts
var import_inquirer = __toModule(require("inquirer"));
var import_promises = __toModule(require("fs/promises"));
var Question = class {
  async getTempletes(templeteDir) {
    try {
      const templetesName = await (0, import_promises.readdir)(templeteDir);
      this._templetes = templetesName.filter((name) => name !== "react-ts-redux-webpack");
    } catch (e) {
      console.error(e);
    }
  }
  async ask() {
    try {
      return await import_inquirer.default.prompt([
        {
          type: "input",
          message: "please input project name",
          name: "projectName",
          validate: function(input) {
            if (input && input.trim().length) {
              return true;
            }
            return "project name is required !";
          }
        },
        {
          type: "list",
          name: "templete",
          message: "select templete",
          choices: this._templetes
        }
      ]);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

// src/create/projects/react-demo.ts
var import_fs2 = __toModule(require("fs"));
var import_path2 = __toModule(require("path"));
var import_execa = __toModule(require("execa"));
var import_ora = __toModule(require("ora"));
var ReactDOMProject = class {
  constructor(cwd, name, templeteName, templeteDir) {
    this.cwd = cwd;
    this.name = name;
    this.templeteName = templeteName;
    this.sourceDir = import_path2.default.join(templeteDir, this.templeteName);
  }
  updatePackageJson() {
    const fullName = import_path2.default.join(this.cwd, "package.json");
    if (import_fs2.default.existsSync(fullName)) {
      const json = import_fs2.default.readFileSync(fullName).toString();
      const data = JSON.parse(json);
      data.name = this.name;
      import_fs2.default.writeFileSync(fullName, JSON.stringify(data, null, 4));
    } else {
      console.warn(`package.json not found in ${this.cwd}`);
    }
  }
  async create() {
    try {
      const spinner = (0, import_ora.default)(`clone ${this.templeteName} templete...`).start();
      await copyDir(this.sourceDir, this.cwd);
      this.updatePackageJson();
      spinner.text = "start install dependencies";
      spinner.stop();
      await (0, import_execa.default)("npm", ["ci"], {
        cwd: this.cwd,
        stdio: [2, 2, 2]
      });
      console.info("");
      console.info("------------------------------------------------------");
      console.info(`\u8FD0\u884C cd ${this.name} && npm run dll && npm start \u542F\u52A8\u9879\u76EE`);
      console.info("------------------------------------------------------");
    } catch (e) {
      console.error(e);
    }
  }
};

// src/create/projects/react-native.ts
var import_fs3 = __toModule(require("fs"));
var import_path3 = __toModule(require("path"));
var import_execa2 = __toModule(require("execa"));
var import_ora2 = __toModule(require("ora"));
var import_rimraf = __toModule(require("rimraf"));
var ReactNativeProject = class {
  constructor(cwd, name, templeteDir) {
    this.cwd = cwd;
    this.name = name;
    this.templeteName = "react-native-mobx";
    this.sourceDir = import_path3.default.join(templeteDir, this.templeteName);
  }
  async installDependencies() {
    await (0, import_execa2.default)("npm", [
      "i",
      "axios",
      "mobx",
      "mobx-react-lite",
      "rn-element",
      "react-router-native@5.2.0",
      "react-native-safe-area-context",
      "@react-native-async-storage/async-storage"
    ], {
      cwd: this.cwd,
      stdio: [2, 2, 2]
    });
  }
  async installDevDependencies() {
    await (0, import_execa2.default)("npm", [
      "i",
      "@types/react",
      "@types/react-native",
      "@types/react-router-native",
      "@babel/plugin-proposal-decorators",
      "@babel/plugin-proposal-export-namespace-from",
      "babel-plugin-module-resolver",
      "eslint-plugin-spellcheck",
      "--save-dev"
    ], {
      cwd: this.cwd,
      stdio: [2, 2, 2]
    });
  }
  removeFiles() {
    import_rimraf.default.sync(import_path3.default.join(this.cwd, "__tests__"));
    import_fs3.default.unlinkSync(import_path3.default.join(this.cwd, "App.tsx"));
  }
  rewriteFiles() {
    const spinner = (0, import_ora2.default)("start rewrite files").start();
    const toRewriteFiles = [".eslintrc.js", ".eslintignore", "babel.config.js", "tsconfig.json", "index.js"];
    for (const file of toRewriteFiles) {
      writeFileAndPrint(file, import_fs3.default.readFileSync(import_path3.default.join(this.sourceDir, file)), this.cwd, spinner);
    }
    spinner.stop();
  }
  async copyDirs() {
    try {
      const dirs = ["src", "scripts"];
      for (const dir of dirs) {
        const srcFullName = import_path3.default.join(this.sourceDir, dir);
        const destFullName = import_path3.default.join(this.cwd, dir);
        await copyDir(srcFullName, destFullName);
      }
    } catch (e) {
      console.error(e);
    }
  }
  updatePackageJson() {
    const fullName = import_path3.default.join(this.cwd, "package.json");
    if (import_fs3.default.existsSync(fullName)) {
      const json = import_fs3.default.readFileSync(fullName).toString();
      const data = JSON.parse(json);
      data.projectType = "native";
      import_fs3.default.writeFileSync(fullName, JSON.stringify(data, null, 4));
    } else {
      console.warn(`package.json not found in ${this.cwd}`);
    }
  }
  async create() {
    const spinner = (0, import_ora2.default)(`react native init ${this.name}...`).start();
    try {
      await (0, import_execa2.default)(`react-native init ${this.name} --template react-native-template-typescript`);
      spinner.stop();
      console.info("install dependencies");
      await this.installDependencies();
      console.info("install dev dependencies");
      await this.installDevDependencies();
      this.removeFiles();
      this.rewriteFiles();
      spinner.text = "copy files....";
      spinner.start();
      this.copyDirs();
      spinner.stop();
      this.updatePackageJson();
    } catch (e) {
      spinner.stop();
      console.error(e);
    }
  }
};

// src/create/index.ts
async function createReactProject(templeteDir) {
  try {
    const question = new Question();
    await question.getTempletes(templeteDir);
    const answers = await question.ask();
    let platform = "React-DOM";
    if (answers.templete.startsWith("react-native")) {
      platform = "React-Native";
    }
    let project;
    if (platform === "React-DOM") {
      project = new ReactDOMProject(import_path4.default.join(process.cwd(), answers.projectName), answers.projectName, answers.templete, templeteDir);
    } else {
      project = new ReactNativeProject(import_path4.default.join(process.cwd(), answers.projectName), answers.projectName, templeteDir);
    }
    await (project == null ? void 0 : project.create());
  } catch (e) {
    console.error(e);
  }
}

// src/generate/generators/api.ts
var import_fs4 = __toModule(require("fs"));
var import_path5 = __toModule(require("path"));
var Api = class {
  constructor(fileName, absolutePath) {
    this._fileName = fileName;
    this._absolutePath = absolutePath;
  }
  get _templete() {
    return `import { AxiosInstance } from 'axios'
import { AppStore } from '${this._absolutePath}stores/index'

export class ${upperFirst(toCamelCase(this._fileName))}Api {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}
}

`;
  }
  generate() {
    const filePath = `src/apis/${this._fileName}.ts`;
    (0, import_fs4.writeFileSync)((0, import_path5.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/generators/model.ts
var import_fs5 = __toModule(require("fs"));
var import_path6 = __toModule(require("path"));
var Model = class {
  constructor(fileName, absolutePath) {
    this._fileName = fileName;
    this._absolutePath = absolutePath;
  }
  get _templete() {
    const className = upperFirst(toCamelCase(this._fileName));
    return `import { I${className} } from '${this._absolutePath}types/index'

export class ${className} implements I${className} {
    constructor() {
        
    }
}

`;
  }
  generate() {
    const filePath = `src/models/${this._fileName}.ts`;
    (0, import_fs5.writeFileSync)((0, import_path6.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/generators/store.ts
var import_fs6 = __toModule(require("fs"));
var import_path7 = __toModule(require("path"));
var Store = class {
  constructor(fileName) {
    this._fileName = fileName;
  }
  get _templete() {
    return `import { action, observable, makeObservable } from 'mobx'

export class ${upperFirst(toCamelCase(this._fileName))}Store {
    constructor() {
        makeObservable(this)
    }
}

`;
  }
  generate() {
    const filePath = `src/stores/${this._fileName}.ts`;
    (0, import_fs6.writeFileSync)((0, import_path7.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/generators/style.ts
var import_fs8 = __toModule(require("fs"));
var import_path9 = __toModule(require("path"));

// src/generate/generators/abstracts/select-directory.ts
var import_inquirer2 = __toModule(require("inquirer"));
var import_path8 = __toModule(require("path"));
var import_fs7 = __toModule(require("fs"));
var SelectDirectory = class {
  constructor(root) {
    this._root = root;
  }
  async _recursiveSelect(dir, head = null, acc = "") {
    let children = (0, import_fs7.readdirSync)(dir).filter((c) => (0, import_fs7.statSync)((0, import_path8.join)(dir, c)).isDirectory());
    if (head) {
      children = [head, ...children];
    }
    try {
      const { selected } = await import_inquirer2.default.prompt([
        {
          type: "list",
          name: "selected",
          message: "select directory",
          choices: children
        }
      ]);
      if (selected === ".") {
        return acc;
      } else {
        const fullPath = (0, import_path8.join)(dir, selected);
        if ((0, import_fs7.readdirSync)(fullPath).some((c) => (0, import_fs7.statSync)((0, import_path8.join)(fullPath, c)).isDirectory())) {
          acc += "/" + selected;
          return this._recursiveSelect(fullPath, ".", acc);
        } else {
          return acc + "/" + selected;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  _selectDirectory() {
    return this._recursiveSelect(this._root);
  }
};

// src/generate/generators/style.ts
var Style = class extends SelectDirectory {
  constructor(fileName) {
    super((0, import_path9.join)(process.cwd(), "src/views"));
    this._fileName = fileName;
  }
  get _templete() {
    return `import { StyleSheet, Dimensions } from 'react-native'

const { height, width } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        width,
        height
    }
})
`;
  }
  async generate() {
    const directory = await this._selectDirectory();
    const filePath = (0, import_path9.join)("src/views", directory, `${this._fileName}.ts`);
    (0, import_fs8.writeFileSync)((0, import_path9.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/generators/view.dom.ts
var import_fs9 = __toModule(require("fs"));
var import_path11 = __toModule(require("path"));

// src/generate/generators/abstracts/view.ts
var import_path10 = __toModule(require("path"));
var View = class extends SelectDirectory {
  constructor(fileName) {
    super((0, import_path10.join)(process.cwd(), "src/views"));
    this._fileName = fileName;
    this._fileNameCamel = upperFirst(toCamelCase(fileName));
  }
};

// src/generate/generators/view.dom.ts
var DOMView = class extends View {
  constructor(fileName) {
    super(fileName);
  }
  get _templete() {
    return `import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext, useMount } from 'hooks/index'

export const ${this._fileNameCamel}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <div>
            ${this._fileNameCamel}
        </div>
    )
})

`;
  }
  async generate() {
    const directory = await this._selectDirectory();
    const filePath = (0, import_path11.join)("src/views", directory, `${this._fileNameCamel}.tsx`);
    (0, import_fs9.writeFileSync)((0, import_path11.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/generators/view.native.ts
var import_fs10 = __toModule(require("fs"));
var import_path12 = __toModule(require("path"));
var NativeView = class extends View {
  constructor(fileName) {
    super(fileName);
  }
  get _templete() {
    return `import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Button } from 'rn-element'
import { useAppContext, useMount } from '@/hooks'

export const ${this._fileNameCamel}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <View>
            <Text>${this._fileNameCamel}</Text>
        </View>
    )
})

`;
  }
  async generate() {
    const directory = await this._selectDirectory();
    const filePath = (0, import_path12.join)("src/views", directory, `${this._fileNameCamel}.tsx`);
    (0, import_fs10.writeFileSync)((0, import_path12.join)(process.cwd(), filePath), this._templete);
    console.info("");
    console.info(`${filePath} is already generated!`);
  }
};

// src/generate/utils.ts
var import_fs11 = __toModule(require("fs"));
var import_path13 = __toModule(require("path"));
function getProjectType() {
  const json = (0, import_fs11.readFileSync)((0, import_path13.join)(process.cwd(), "package.json")).toString();
  const data = JSON.parse(json);
  return data.projectType;
}

// src/generate/index.ts
async function generate(command) {
  const [type, fileName] = command;
  if (isCamelCase(fileName)) {
    console.error("do not use camelCase, please use snake_case or kebab-case");
    return;
  }
  const projectType = getProjectType();
  const absolutePath = projectType === "native" ? "@/" : "";
  switch (type) {
    case "api": {
      new Api(fileName, absolutePath).generate();
      break;
    }
    case "model": {
      new Model(fileName, absolutePath).generate();
      break;
    }
    case "store": {
      new Store(fileName).generate();
      break;
    }
    case "style": {
      if (projectType !== "native") {
        console.error("your projectType should be `native`");
      } else {
        new Style(fileName).generate();
      }
      break;
    }
    case "view": {
      if (!projectType) {
        console.error("package.json not include field `projectType`!");
      } else if (projectType === "native") {
        new NativeView(fileName).generate();
      } else {
        new DOMView(fileName).generate();
      }
      break;
    }
    case "block": {
      await new Api(fileName, absolutePath).generate();
      await new Model(fileName, absolutePath).generate();
      await new Store(fileName).generate();
      if (projectType === "native") {
        console.info("");
        console.info("please select style file directory");
        await new Style(fileName).generate();
      }
      console.info("");
      console.info("please select view file directory");
      if (projectType === "native") {
        await new NativeView(fileName).generate();
      } else {
        await new DOMView(fileName).generate();
      }
      break;
    }
    default:
      console.error("type is not correct!!!");
  }
}

// src/index.ts
var import_package = __toModule(require("../package.json"));
var args = (0, import_yargs_parser.default)(process.argv.slice(2));
function printHelp() {
  console.info(import_fs12.default.readFileSync(import_path14.default.join(__dirname, "helps", "index.txt"), "utf-8"));
}
function printGenerateHelp() {
  console.info(import_fs12.default.readFileSync(import_path14.default.join(__dirname, "helps", "generate.txt"), "utf-8"));
}
function printVersion() {
  console.info(import_package.default.version);
}
function main() {
  const { command, options } = getCmdAndOptions(args);
  if (command && command.length > 0) {
    if (command[0] === "create") {
      (0, import_clear.default)();
      console.info(import_chalk.default.yellow(import_figlet.default.textSync("setup react env", { horizontalLayout: "full" })));
      createReactProject(import_path14.default.join(__dirname, "../templetes"));
    } else if (command[0] === "generate") {
      if (options.help) {
        printGenerateHelp();
      } else {
        generate(command.slice(1));
      }
    }
  } else if (options.help) {
    printHelp();
  } else if (options.version) {
    printVersion();
  }
}
main();
