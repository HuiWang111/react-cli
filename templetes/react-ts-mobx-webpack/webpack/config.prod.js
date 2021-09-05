/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./config.base.js')
const TerserPlugin = require('terser-webpack-plugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const getLessModifyVars = require('./getLessModifyVars')

module.exports = merge(common, {
    entry: {
        main: path.join(process.cwd(), 'src/index.tsx')
    },
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        path: path.join(process.cwd(), 'build'),
        publicPath: '/'
    },
    resolve: {
        // 针对Npm中的第三方模块优先采用 jsnext:main中指向的ES6模块化语法的文件
        mainFields: ['jsnext:main', 'browser', 'main']
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif)$/,
                type: 'asset'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
                exclude: /src/,
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
            }
        ]
    },
    optimization: {
        splitChunks: {
            /**
             * initial 入口chunk，对于异步导入的文件不处理
             * async 只对异步导入的文件做处理
             */
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: false,
            cacheGroups: {
                defaultVendors: {
                    name: 'defaultVendors',
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 1,
                    priority: -10 // 权重高低
                },
                default: {
                    name: 'default',
                    test: /[\\/]src[\\/]/,
                    minChunks: 2, // 最少复用次数
                    priority: -20,
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        },
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    sourceMap: true,
                    warnings: false,
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    },
                    output: {
                        beautify: false,
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        // 开启Scope Hosting
        new ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        new HTMLPlugin({
            filename: path.join(process.cwd(), 'build/index.html'),
            template: path.resolve(process.cwd(), 'public/index.html')
        })
    ]
})