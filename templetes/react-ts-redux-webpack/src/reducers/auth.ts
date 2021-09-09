import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import { IAuthState, ICurrentUser, IAuthError } from 'types/auth'
import { http, HttpError } from 'utils'

const initialState: IAuthState = {
    isAuth: false,
    loading: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = payload
        },
        setAuthSuccess: (state, { payload }: PayloadAction<ICurrentUser>) => {
            state.currentUser = payload
            state.isAuth = true
        },
        setAuthFailed: (state, { payload }: PayloadAction<IAuthError>) => {
            state.error = payload
        },
        setLogout: (state) => {
            state.currentUser = undefined
            state.isAuth = false
        }
    }
})

const { setLoading, setAuthFailed, setAuthSuccess, setLogout } = authSlice.actions
export const authSelector = (state: RootState): IAuthState => state.auth
export const authReducer = authSlice.reducer

export const login = (data: Record<string, any>): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await http.post('/login', data)
        dispatch(setAuthSuccess(res.data))
    } catch (e) {
        if (e instanceof HttpError) {
            dispatch(setAuthFailed(e.error.response))
        } else {
            console.error(e)
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const logOut = (): AppThunk => async (dispatch) => {
    try {
        await http.post('/logout')
        dispatch(setLogout())
    } catch (e) {
        if (e instanceof HttpError) {
            // 
        } else {
            console.error(e)
        }
    }
}
