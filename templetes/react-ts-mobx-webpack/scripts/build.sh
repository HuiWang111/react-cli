#!/bin/bash

mkdir temp
mv build/common.dll.js build/common.manifest.json build/common.dll.js.map -t temp/
rm -rf build
webpack --config webpack/config.prod.js
mv temp/common.dll.js temp/common.manifest.json temp/common.dll.js.map -t build/
rm -rf temp