import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import styleImport from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        styleImport({ 
            libs: [
                { 
                    libraryName: "antd", 
                    esModule: true,  
                    resolveStyle: (name) => `antd/es/${name}/style/index`
                }
            ]
        })
    ],
    resolve: {
        alias: {
            apis: join(__dirname, 'src/apis'),
            app: join(__dirname, 'src/app'),
            components: join(__dirname, 'src/components'),
            config: join(__dirname, 'src/config'),
            consts: join(__dirname, 'src/consts'),
            hooks: join(__dirname, 'src/hooks'),
            layout: join(__dirname, 'src/layout'),
            models: join(__dirname, 'src/models'),
            stores: join(__dirname, 'src/stores'),
            styles: join(__dirname, 'src/styles'),
            types: join(__dirname, 'src/types'),
            utils: join(__dirname, 'src/utils'),
            views: join(__dirname, 'src/views')
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
})