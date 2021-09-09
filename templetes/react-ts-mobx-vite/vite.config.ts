import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import fs from 'fs';
import path from 'path';

const srcPath = path.join(__dirname, 'src');
console.log(fs.readdirSync(srcPath)
.filter(d => fs.statSync(path.join(srcPath, d)).isDirectory())
.reduce((aliasConf, dir) => {
    aliasConf[dir] = path.join(srcPath, dir);
    return aliasConf;
}, {}))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: fs.readdirSync(srcPath)
    .filter(d => fs.statSync(path.join(srcPath, d)).isDirectory())
    .reduce((aliasConf, dir) => {
        aliasConf[dir] = path.join(srcPath, dir);
        return aliasConf;
    }, {})
});
