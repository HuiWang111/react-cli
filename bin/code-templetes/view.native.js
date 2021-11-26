var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/generate/code-templetes/view.native.ts
__export(exports, {
  default: () => createNativePage
});
function createNativePage(fileName) {
  return `import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Button } from 'rn-element'
import { useAppContext, useMount } from '../hooks'

export const ${fileName}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <View>
            <Text>${fileName}</Text>
        </View>
    )
})

    `;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
