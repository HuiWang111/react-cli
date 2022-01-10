import { useLocation } from 'react-router-dom'
import History from 'history'

export const useRouterState = <S = History.LocationState> (): S => {
    const { state } = useLocation<S>()
    return state
}
