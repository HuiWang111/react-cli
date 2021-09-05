import React, { Suspense, FC, PropsWithChildren } from 'react'
import { Text } from 'react-native'
import { AppContext } from '../hooks'
import { api, store } from './appContext'

const Provides: FC = ({ children }: PropsWithChildren<any>) => {
    return (
        <Suspense
            fallback={<Text>loading...</Text>}
        >
            <AppContext.Provider value={{ api, store }}>
                { children }
            </AppContext.Provider>
        </Suspense>
    )
}

export default Provides