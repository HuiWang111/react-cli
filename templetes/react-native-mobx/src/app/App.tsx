import React, { FC, lazy, useState } from 'react'
import Provides from './Provides'
import {
    Switch,
    Route as PublicRoute,
    Redirect,
    Router,
} from 'react-router-native'
import { Text } from 'react-native'
import { PrivateRoute } from '@/components/index'
import { history } from './history'
import { AuthStore } from '@/stores/index'
import { useMount } from '@/hooks/index'

const PrivateLayout = lazy(() => import('@/layout/PrivateLayout'))
const PublicLayout = lazy(() => import('@/layout/PublicLayout'))

const App: FC = () => {
    const [initialized, setInitialized] = useState(false)

    useMount(() => {
        const initialize = async () => {
            AuthStore.token = await AuthStore.getToken()
            setInitialized(true)
        }

        initialize()
    })

    if (!initialized) {
        return <Text>initialing...</Text>
    }

    return (
        <Provides>
            <Router history={history}>
                <Switch>
                    <PublicRoute path='/auth' component={PublicLayout} />
                    <PrivateRoute path='/app' component={PrivateLayout} />
                    <Redirect from='/' to='/app' />
                </Switch>
            </Router>
        </Provides>
    )
}

export default App
