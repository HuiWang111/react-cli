import { lazy, ComponentType } from 'react'

interface IRouteConfig {
    path: string;
    component: ComponentType;
}

const Login = lazy(() => import('@/views/login'))
const Dashboard = lazy(() => import('@/views/dashboard'))

export const publicRouteConfig: IRouteConfig[] = [
    { path: '/auth/login', component: Login }
]

export const privateRouteConfig: IRouteConfig[] = [
    { path: '/app/dashboard', component: Dashboard }
]