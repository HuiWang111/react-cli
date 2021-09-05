import { FC, lazy } from 'react'
import Provides from './Provides'
import {
    Switch,
    Route as PublicRoute,
    Redirect
} from 'react-router-dom'
import { PrivateRoute } from 'components'

const PrivateLayout = lazy(() => import('layout/PrivateLayout'))
const PublicLayout = lazy(() => import('layout/PublicLayout'))

const App: FC = () => {
    return (
        <Provides>
            <Switch>
                <PublicRoute path='/auth' component={PublicLayout} />
                <PrivateRoute path='/app' component={PrivateLayout} />
                <Redirect from='/' to='/app' />
            </Switch>
        </Provides>
    )
}

export default App
