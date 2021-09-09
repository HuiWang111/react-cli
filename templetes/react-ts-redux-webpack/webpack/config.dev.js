/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge')
const common = require('./config.base.js')
const path = require('path')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new DllReferencePlugin({
            manifest: require(path.join(process.cwd(), 'build/common.manifest.json'))
        })
    ],
    devServer: {
        contentBase: path.join(process.cwd(), 'build'),
        publicPath: 'http://localhost:3000/',
        proxy: {
            '/api': {
                target: 'http://192.168.20.16:9999',
                changeOrigin: true,
                pathRewrite: { '^/api': '/api' }
            }
        },
        hot: true,
        overlay: {
            warnings: true,
            errors: true
        },
        quiet: true,
        progress: true,
        historyApiFallback: true,
        inline: true,
        host: 'localhost',
        port: 3000,
        open: true
    }
})