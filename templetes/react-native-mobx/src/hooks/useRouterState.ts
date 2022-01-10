import { useLocation } from 'react-router-native'
import History from 'history'

export const useRouterState = <S = History.LocationState> (): S => {
    const { state } = useLocation<S>()
    return state
}
