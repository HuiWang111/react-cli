/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const common = require('./config.base.js')
const path = require('path')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
const HTMLPlugin = require('html-webpack-plugin')

const DEV_CONF = {
    host: 'localhost',
    port: 3000,
    proxyPath: 'http://192.168.20.16:9999',
    get publicPath() {
        return `http://${this.host}:${this.port}`
    }
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new DllReferencePlugin({
            manifest: require(path.join(process.cwd(), 'build/common.manifest.json'))
        }),
        new HTMLPlugin({
            filename: path.join(process.cwd(), 'build/index.html'),
            template: path.resolve(process.cwd(), 'public/index.dev.html')
        })
    ],
    devServer: {
        contentBase: path.join(process.cwd(), 'build'),
        publicPath: DEV_CONF.publicPath,
        proxy: {
            '/api': {
                target: DEV_CONF.proxyPath,
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
        host: DEV_CONF.host,
        port: DEV_CONF.port,
        open: true
    }
})