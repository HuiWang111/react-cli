import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from 'reducers'

const rootReducer = combineReducers({
    authReducer
})

export type RootState<T extends (...args: any) => any = (...args: any) => any> = ReturnType<T>;

export default rootReducer