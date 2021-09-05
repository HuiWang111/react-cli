import { FC } from 'react'
import { Switch, useRouteMatch, Redirect } from 'react-router-dom'
import { privateRouteConfig } from 'config'
import { PrivateRoute } from 'components'

const PrivateLayout: FC = () => {
    const match = useRouteMatch()
    
    return (
        <Switch>
            {
                privateRouteConfig.map(route => {
                    return (
                        <PrivateRoute key={route.path} { ...route } />
                    )
                })
            }
            <Redirect from={match.url} to={`${match.url}/dashboard`} />
        </Switch>
    )
}

export default PrivateLayout
