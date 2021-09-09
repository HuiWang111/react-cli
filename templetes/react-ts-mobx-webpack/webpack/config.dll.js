/* eslint-disable @typescript-eslint/no-var-requires */
const DllPlugin = require('webpack/lib/DllPlugin')
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        common: [
            'react',
            'react-dom',
            'moment',
            'antd',
            'axios',
            'js-cookie',
            'mobx',
            'mobx-react-lite',
            'react-router-dom'
        ]
    },
    output: {
        filename: '[name].dll.js',
        path: path.join(process.cwd(), 'build'),
        // 存放动态链接库的全局变量名，例如对react来说就是_dll_react
        // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
        library: '_dll_[name]'
    },
    plugins: [
        new DllPlugin({
            name: '_dll_[name]',
            // 描述动态链接库 manifest.json文件输出时的文件名
            path: path.join(process.cwd(), 'build/[name].manifest.json'),
        })
    ]
}