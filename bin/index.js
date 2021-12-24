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
var import_path15 = __toModule(require("path"));
var import_clear = __toModule(require("clear"));
var import_chalk2 = __toModule(require("chalk"));
var import_figlet = __toModule(require("figlet"));

// src/utils.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_ncp = __toModule(require("ncp"));
var COMMANDS = ["create", "generate", "publish"];
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
import { useAppContext, useMount } from 'hooks'

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
import { useAppContext, useMount } from '@/hooks/index'

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
async function generate(commands) {
  const [type, fileName] = commands;
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

// src/publish/utils.ts
var import_promises2 = __toModule(require("fs/promises"));
var import_path14 = __toModule(require("path"));
var import_execa3 = __toModule(require("execa"));
var import_child_process = __toModule(require("child_process"));

// src/publish/contants.ts
var DEFAULT_CONFIG_FILE = "sre-rn-publish.config.js";

// src/publish/utils.ts
function buildApk() {
  return new Promise((resolve) => {
    var _a, _b;
    const proc = (0, import_execa3.default)("gradlew assembleRelease", {
      cwd: (0, import_path14.join)(process.cwd(), "android")
    });
    (_a = proc.stdout) == null ? void 0 : _a.pipe(process.stdout);
    (_b = proc.stdout) == null ? void 0 : _b.on("close", () => {
      resolve(null);
    });
  });
}
function fill(n) {
  return n > 10 ? "" + n : "0" + n;
}
function getYMD() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return {
    year: fill(year),
    month: fill(month),
    day: fill(day)
  };
}
async function openApkDir() {
  try {
    await (0, import_execa3.default)(`explorer ${(0, import_path14.join)(process.cwd(), "android/app/build/outputs/apk/release").replace(/\//g, "\\")}`);
  } catch (e) {
    await (0, import_execa3.default)(`open ${(0, import_path14.join)(process.cwd(), "android/app/build/outputs/apk/release")}`);
  }
}
function getCurrentBranch() {
  return new Promise((resolve, reject) => {
    var _a, _b, _c;
    const proc = (0, import_child_process.exec)("git branch", (err) => {
      reject(err);
    });
    let currentBranch;
    (_a = proc.stdout) == null ? void 0 : _a.on("data", (chunk) => {
      const branch = chunk.split("\n").find((name) => name.includes("*"));
      if (branch) {
        currentBranch = branch.replace("* ", "");
      }
    });
    (_b = proc.stderr) == null ? void 0 : _b.on("data", (chunk) => {
      reject(chunk);
    });
    (_c = proc.stdout) == null ? void 0 : _c.on("close", () => {
      resolve(currentBranch);
    });
  });
}
async function codePush(deploymentName, ownerName, appName, messagePrefix, message, getCustomizedCommand) {
  var _a;
  let command;
  if (getCustomizedCommand) {
    command = getCustomizedCommand({
      deploymentName,
      ownerName,
      appName,
      messagePrefix,
      message
    });
  } else {
    command = `appcenter codepush release-react -a ${ownerName}/${appName} -d ${deploymentName} --description "${messagePrefix} ${message}"`;
  }
  console.info("");
  console.info("> " + command);
  const proc = (0, import_child_process.exec)(command);
  (_a = proc.stdout) == null ? void 0 : _a.pipe(process.stdout);
}
function isCodeUpToDate() {
  return new Promise((resolve, reject) => {
    var _a, _b, _c;
    const proc = (0, import_child_process.exec)("git status");
    let content = "";
    (_a = proc.stdout) == null ? void 0 : _a.on("data", (chunk) => {
      content += chunk;
    });
    (_b = proc.stderr) == null ? void 0 : _b.on("data", (chunk) => {
      reject(chunk);
    });
    (_c = proc.stdout) == null ? void 0 : _c.on("close", () => {
      resolve(content.includes("nothing to commit"));
    });
  });
}
async function cleanCodeChange() {
  try {
    await (0, import_execa3.default)("git checkout .");
  } catch (e) {
  }
}
async function copyApp(isTest) {
  const apkPath = (0, import_path14.join)(process.cwd(), "android/app/build/outputs/apk/release");
  const file = isTest ? "app-release.test.apk" : "app-release.prod.apk";
  const command = `cp ${(0, import_path14.join)(apkPath, "app-release.apk")} ${(0, import_path14.join)(apkPath, file)}`;
  console.info("");
  console.info("> " + command);
  await (0, import_execa3.default)(command);
}
async function writeBuildGradleFileByEnv(isTest, applicationId) {
  if (!isTest) {
    return;
  }
  const content = await (0, import_promises2.readFile)((0, import_path14.join)(process.cwd(), "android/app/build.gradle"), { encoding: "utf-8" });
  await (0, import_promises2.writeFile)((0, import_path14.join)(process.cwd(), "android/app/build.gradle"), content.replace(`applicationId "${applicationId}"`, `applicationId "${applicationId}.test"`));
}
async function writeVersion(version, path6) {
  console.info(`current version is: ${version}`);
  console.info("");
  await (0, import_promises2.writeFile)((0, import_path14.join)(process.cwd(), path6), `export const version = '${version}'`);
}
async function writeEnv(env, path6) {
  await (0, import_promises2.writeFile)((0, import_path14.join)(process.cwd(), path6), `export const env = '${env}'`);
}
async function writeAppName(appName, toReplaceAppName) {
  const filePath = (0, import_path14.join)(process.cwd(), "android/app/src/main/res/values/strings.xml");
  const content = await (0, import_promises2.readFile)(filePath, { encoding: "utf-8" });
  await (0, import_promises2.writeFile)(filePath, content.replace(toReplaceAppName, appName));
}
function getConfigFile(options) {
  if (options.config) {
    return (0, import_path14.join)(process.cwd(), options.config);
  }
  return (0, import_path14.join)(process.cwd(), DEFAULT_CONFIG_FILE);
}

// src/publish/types/react-native.ts
var import_inquirer3 = __toModule(require("inquirer"));
function mergeConfig({
  shouldCleanCodeChange = true,
  mode = "test",
  shouldRewriteApplicationId = false,
  applicationId = "",
  generateVersion = false,
  versionFilePath = "src/config",
  extname = "ts",
  generateEnv = false,
  envFilePath = "src/config",
  generateAppName = false,
  codePush: codePush2 = false,
  open = false,
  shouldCopyApp = false,
  onComplete
} = {
  shouldCleanCodeChange: true,
  mode: "test",
  shouldRewriteApplicationId: false,
  applicationId: "",
  generateVersion: false,
  versionFilePath: "src/config",
  extname: "ts",
  generateEnv: false,
  envFilePath: "src/config",
  generateAppName: false,
  codePush: false,
  open: false,
  shouldCopyApp: false
}, message = "") {
  return {
    shouldCleanCodeChange,
    mode,
    shouldRewriteApplicationId,
    applicationId,
    generateVersion,
    versionFilePath,
    extname,
    generateEnv,
    envFilePath,
    generateAppName,
    codePush: codePush2,
    open,
    shouldCopyApp,
    message,
    onComplete
  };
}
async function publishReactNative({
  shouldCleanCodeChange,
  mode,
  shouldRewriteApplicationId,
  applicationId,
  generateVersion,
  versionFilePath,
  extname,
  generateEnv,
  envFilePath,
  generateAppName,
  codePush: codePush2,
  open,
  shouldCopyApp,
  message,
  onComplete
}) {
  if (shouldCleanCodeChange) {
    let isContinue = true;
    try {
      if (!await isCodeUpToDate()) {
        const answers = await import_inquirer3.default.prompt([
          {
            type: "list",
            name: "isContinue",
            message: "\u68C0\u6D4B\u5230\u5F53\u524D\u4EE3\u7801\u6709\u672A\u63D0\u4EA4\u7684\uFF0C\u53D1\u5E03\u5B8C\u6210\u4E4B\u540E\u4F1A\u6267\u884C `git checkout .` \u6E05\u9664\u6240\u6709\u6539\u52A8\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u7EE7\u7EED\uFF1F",
            choices: ["\u662F", "\u5426"]
          }
        ]);
        isContinue = answers.isContinue === "\u662F";
      }
    } catch (e) {
    }
    if (!isContinue) {
      return;
    }
  }
  let currentBranch;
  try {
    currentBranch = await getCurrentBranch();
  } catch (e) {
    currentBranch = "";
  }
  const modeRes = typeof mode === "function" ? mode(currentBranch) : mode;
  if (!["test", "production"].includes(modeRes)) {
    Promise.reject("mode must be 'test' or 'production'");
    return;
  }
  const { year, month, day } = getYMD();
  const isTest = modeRes === "test";
  if (shouldRewriteApplicationId) {
    if (!applicationId) {
      Promise.reject("when shouldRewriteApplicationId is true, applicationId is required");
      return;
    }
    writeBuildGradleFileByEnv(isTest, applicationId);
  }
  if (generateVersion) {
    const version = generateVersion({ year, month, day, mode: modeRes });
    await writeVersion(version, `${versionFilePath}/version.${extname}`);
  }
  if (generateEnv) {
    const env = generateEnv(modeRes);
    writeEnv(env, `${envFilePath}/env.${extname}`);
  }
  if (generateAppName) {
    const { appName, toReplaceAppName } = generateAppName(modeRes);
    if (appName !== toReplaceAppName) {
      writeAppName(appName, toReplaceAppName);
    }
  }
  await buildApk();
  if (shouldCopyApp) {
    await copyApp(isTest);
  }
  if (open) {
    await openApkDir();
  }
  if (codePush2) {
    const {
      getCustomizedCommand,
      getDeploymentName,
      getMessagePrefix,
      ownerName,
      appName
    } = codePush2;
    const deploymentName = getDeploymentName == null ? void 0 : getDeploymentName(modeRes);
    if (!deploymentName) {
      Promise.reject("when enable codePush, deploymentName is required");
      return;
    }
    const messagePrefix = (getMessagePrefix == null ? void 0 : getMessagePrefix({ year, month, day, mode: modeRes })) || "";
    await codePush(deploymentName, ownerName, appName, messagePrefix, message, getCustomizedCommand);
  }
  if (shouldCleanCodeChange) {
    await cleanCodeChange();
  }
  onComplete == null ? void 0 : onComplete(modeRes);
}

// src/publish/index.ts
var import_chalk = __toModule(require("chalk"));
async function publish(commands, options) {
  var _a;
  const [type] = commands;
  switch (type) {
    case "react-native": {
      try {
        const configFile = getConfigFile(options);
        const publishConfig = await Promise.resolve().then(() => __toModule(require(configFile)));
        const config = mergeConfig(publishConfig, options.m);
        await publishReactNative(config);
      } catch (e) {
        console.info(import_chalk.default.red((_a = e.message) != null ? _a : e));
      }
      break;
    }
    default: {
      console.info(`publish type '${type}' not found`);
    }
  }
}

// src/index.ts
var import_package = __toModule(require("../package.json"));
var args = (0, import_yargs_parser.default)(process.argv.slice(2));
function printHelp() {
  console.info(import_fs12.default.readFileSync(import_path15.default.join(__dirname, "helps", "index.txt"), "utf-8"));
}
function printGenerateHelp() {
  console.info(import_fs12.default.readFileSync(import_path15.default.join(__dirname, "helps", "generate.txt"), "utf-8"));
}
function printVersion() {
  console.info(import_package.default.version);
}
function main() {
  const { command, options } = getCmdAndOptions(args);
  if (command && command.length > 0) {
    switch (command[0]) {
      case "create": {
        (0, import_clear.default)();
        console.info(import_chalk2.default.yellow(import_figlet.default.textSync("setup react env", { horizontalLayout: "full" })));
        createReactProject(import_path15.default.join(__dirname, "../templetes"));
        break;
      }
      case "generate": {
        if (options.help) {
          printGenerateHelp();
        } else {
          generate(command.slice(1));
        }
        break;
      }
      case "publish": {
        publish(command.slice(1), options);
        break;
      }
      default: {
        console.info(`command '${command[0]}' not found`);
      }
    }
  } else if (options.help) {
    printHelp();
  } else if (options.version) {
    printVersion();
  }
}
main();
