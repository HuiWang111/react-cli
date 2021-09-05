import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { useAppContext } from '../../../hooks'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-native'
import { Toast, Loading } from 'rn-element'
import { RootSiblingParent } from 'react-native-root-siblings'

export const Login: FC = observer(() => {
    const { api, store } = useAppContext()
    const history = useHistory()
    const handleLogin = () => {
        api.auth.login(
            { username: 'root', password: '123456' },
            store.auth
        )
    }

    return (
        <RootSiblingParent>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Button onPress={handleLogin} title='登录' />
                </View>
            </View>
        </RootSiblingParent>
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
