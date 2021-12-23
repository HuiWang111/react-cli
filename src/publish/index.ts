import { getDefaultConfig, publishReactNative } from './types/react-native'

export function publish(commands: string[]) {
    const [type] = commands;

    switch(type) {
        case 'react-native': {
            break;
        }
        default: {
            console.info(`publish type '${type}' not found`)
        }
    }
}
