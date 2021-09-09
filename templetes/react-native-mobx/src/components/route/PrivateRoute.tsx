import React, { FC, ReactElement, ComponentType } from 'react'
import { Route, RouteProps, Redirect, RouteComponentProps } from 'react-router-native'
import { useAppContext } from '../../hooks'

export const PrivateRoute: FC<RouteProps> = ({
    component,
    ...restProps 
}: RouteProps): ReactElement => {
    const { store } = useAppContext()
    const Component = component as ComponentType<RouteComponentProps<any>> | ComponentType<any>
    
    return (
        <Route
            {...restProps}
            render={props => {
                if (store.auth?.authed) {
                    return <Component {...props} />
                }

                return <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
            }}
        />
    )
}
