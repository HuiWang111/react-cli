var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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

// src/generate/code-templetes/api.ts
__export(exports, {
  default: () => createApi
});

// src/utils.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_ncp = __toModule(require("ncp"));
function upperFirst(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

// src/generate/code-templetes/api.ts
function createApi(fileName) {
  return `import { AxiosInstance } from 'axios'
import { AppStore } from '../stores'

export class ${upperFirst(fileName)}Api {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}
}

    `;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
