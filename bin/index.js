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
var import_fs5 = __toModule(require("fs"));
var import_path6 = __toModule(require("path"));
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
function toCamel(str) {
  const indexes = str.split("").reduce((arr, a, i) => {
    if (a === "-") {
      arr.push(i);
    }
    return arr;
  }, []).map((i) => i + 1);
  return str.split("").map((a, i) => {
    if (indexes.includes(i)) {
      return a.toUpperCase();
    }
    return a;
  }).join("").replace(/-/g, "");
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
      "moment",
      "rn-element",
      "react-router-native",
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
      "@types/react-router-native",
      "@babel/plugin-proposal-decorators",
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

// src/generate/index.ts
var import_fs4 = __toModule(require("fs"));
var import_path5 = __toModule(require("path"));
async function generate(command) {
  const [func, fileName] = command;
  if (func === "module") {
  } else {
    generateFunc(func, fileName);
  }
}
function getProjectType() {
  const json = (0, import_fs4.readFileSync)((0, import_path5.join)(process.cwd(), "package.json")).toString();
  const data = JSON.parse(json);
  return data.projectType;
}
async function generateFunc(func, fileName) {
  const isView = func === "view";
  const fileNameCamel = upperFirst(toCamel(fileName));
  const projectType = getProjectType();
  if (isView && !projectType) {
    console.error("package.json not includes field `projectType`!");
    return;
  }
  const isStyle = func === "style";
  if (isStyle && projectType === "dom") {
    return;
  }
  const { default: createMethod } = await Promise.resolve().then(() => __toModule(require(`./code-templetes/${func}${isView ? "." + projectType : ""}.js`)));
  const content = createMethod(fileNameCamel);
  (0, import_fs4.writeFileSync)((0, import_path5.join)(process.cwd(), `src/${isStyle ? "view" : func}s/${isView ? fileNameCamel : fileName}.${isView ? "tsx" : "ts"}`), content);
  console.info(`${func} ${isView ? fileNameCamel : fileName} is already generated!`);
}

// src/index.ts
var import_package = __toModule(require("../package.json"));
var args = (0, import_yargs_parser.default)(process.argv.slice(2));
function printHelp() {
  console.info(import_fs5.default.readFileSync(import_path6.default.join(__dirname, "helps", "index.txt"), "utf-8"));
}
function printGenerateHelp() {
  console.info(import_fs5.default.readFileSync(import_path6.default.join(__dirname, "helps", "generate.txt"), "utf-8"));
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
      createReactProject(import_path6.default.join(__dirname, "../templetes"));
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
