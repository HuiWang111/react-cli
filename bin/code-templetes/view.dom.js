var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/generate/code-templetes/view.dom.ts
__export(exports, {
  default: () => createDomPage
});
function createDomPage(fileName) {
  return `import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext, useMount } from '../hooks'

export const ${fileName}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <div>
            ${fileName}
        </div>
    )
})

    `;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
