/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const tsImportPluginFactory = require('ts-import-plugin')
const getLessModifyVars = require('./getLessModifyVars')

module.exports = {
    entry: {
        main: path.join(process.cwd(), 'src/index.tsx')
    },
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        path: path.join(process.cwd(), 'build'),
        publicPath: '/'
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts|tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true
                            })
                        ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /src/,
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                // antd定制主题
                                // modifyVars: getLessModifyVars()
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                type: 'asset/inline'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                type: 'asset/resource'
            }
        ]
    }
}