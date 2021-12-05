module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-export-namespace-from"],
        ['babel-plugin-module-resolver', {
            root: ['./src'],
            alias: {
                '@/apis': './src/apis',
                '@/app': './src/app',
                '@/assets': './src/assets',
                '@/components': './src/components',
                '@/config': './src/config',
                '@/consts': './src/consts',
                '@/hooks': './src/hooks',
                '@/layout': './src/layout',
                '@/models': './src/models',
                '@/storages': './src/storages',
                '@/stores': './src/stores',
                '@/styles': './src/styles',
                '@/types': './src/types',
                '@/utils': './src/utils',
                '@/views': './src/views'
            }
        }]
    ]
}
