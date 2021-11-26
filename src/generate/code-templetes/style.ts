export default function createStyle() {
    return `import { StyleSheet, Dimensions } from 'react-native'

const { height, width } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        width,
        height
    }
})
    `
}