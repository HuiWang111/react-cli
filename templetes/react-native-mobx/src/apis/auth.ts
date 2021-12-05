import { HttpError } from '@/utils/index'
import { AxiosInstance } from 'axios'
import { ILoginData } from '@/types/index'
import { AppStore, AuthStore } from '@/stores/index'
import { LOGIN_PATH, LOGOUT_PATH } from './resourses'
import { Toast } from 'rn-element'
import { history } from '@/app/index'

export class AuthApi {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}

    login = async (
        data: ILoginData,
        authStore: AuthStore
    ): Promise<void> => {
        try {
            // authInfo.setLoading(true)
            // const res = await this.httpClient.post(LOGIN_PATH, data)
            authStore.setAuthed(true)
            authStore.setCurrentUser({
                id: 1, //res.data.id,
                name: 'hhhh' //res.data.name
            })
            AuthStore.saveToken('test-token')
            Toast.success('登录成功')
            history.push({
                pathname: '/app/dashboard'
            })
        } catch (e) {
            if (e instanceof HttpError) {
                e.preventDefault()
                authStore?.setError({
                    message: e.error.response?.data.message
                })
            }
            console.error(e)
        } finally {
            authStore.setLoading(false)
        }
    }

    logout = async (
        authStore: AuthStore
    ): Promise<void> => {
        try {
            // await this.httpClient.post(LOGOUT_PATH)
            authStore.setAuthed(false)
            authStore.setCurrentUser(undefined)
            AuthStore.removeToken()
            history.push({
                pathname: '/auth/login'
            })
        } catch (e) {
            console.error(e)
        }
    }

    test = async (): Promise<void> => {
        try {
            await this.httpClient.get('/test')
        } catch (e) {
            if (e instanceof HttpError) {
                e.preventDefault()
            }
        }
    }
}