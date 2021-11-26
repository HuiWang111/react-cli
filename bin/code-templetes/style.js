var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/generate/code-templetes/style.ts
__export(exports, {
  default: () => createStyle
});
function createStyle() {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
