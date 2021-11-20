import React, { FC } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { useAppContext } from '../../../hooks'
import { observer } from 'mobx-react-lite'

export const Dashboard: FC = observer(() => {
    const { api, store } = useAppContext()
    const handleLogout = () => {
        api.auth.logout(store.auth)
    }

    return (
        <View style={styles.row}>
            <View style={styles.col}>
                <Text>Dashboard! </Text>
                <Button onPress={handleLogout} title='退出登录' />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    row: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
    },
    col: {
        width: 120
    }
})