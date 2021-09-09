/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
    entry: {
        main: path.join(process.cwd(), 'src/index.tsx')
    },
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js',
        path: path.join(process.cwd(), 'build'),
        publicPath: '/'
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            react: path.resolve(process.cwd(), 'node_modules/react/index.js')
        }
    },
    plugins: [
        new HTMLPlugin({
            filename: path.join(process.cwd(), 'build/index.html'),
            template: path.resolve(process.cwd(), 'public/index.html')
        })
    ],
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
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    }
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
                                // modifyVars: { // antd定制主题
                                //     'primary-color': '#1DA57A',
                                //     'link-color': '#1DA57A',
                                //     'border-radius-base': '2px',
                                // },
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: ['url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]']
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    { loader: 'file-loader' }
                ]
            }
        ]
    }
}