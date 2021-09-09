/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/app/App'
import { name as appName } from './app.json'

init()

function init() {
    AppRegistry.registerComponent(appName, () => App)
}
