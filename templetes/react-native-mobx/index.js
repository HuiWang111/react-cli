/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/app/App'
import { name as appName } from './app.json'
import { configure } from 'mobx'

init()

function init() {
    configure({
        enforceActions: "always"
    })

    AppRegistry.registerComponent(appName, () => App)
}
