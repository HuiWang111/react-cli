import React, { FC } from 'react'
import {
    Route as PublicRoute,
    Switch,
    Redirect,
    useRouteMatch
} from 'react-router-native'
import { publicRouteConfig } from '../config'

const PublicLayout: FC = () => {
    const match = useRouteMatch()

    return (
        <Switch>
            {
                publicRouteConfig.map(route => {
                    return (
                        <PublicRoute key={route.path} { ...route } />
                    )
                })
            }
            <Redirect from={match.url} to={`${match.url}/login`} />
        </Switch>
    )
}

export default PublicLayout
