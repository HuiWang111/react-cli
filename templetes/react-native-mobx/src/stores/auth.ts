import { IAuth, IAuthError, ICurrentUser } from '@/types/index'
import { action, observable } from 'mobx'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const TOKEN_KEY = 'TOKEN'

export class AuthStore implements IAuth {
    @observable
    authed: boolean

    @observable
    loading: boolean

    @observable
    user?: ICurrentUser
    
    @observable
    error?: IAuthError

    constructor(auth: IAuth) {
        this.authed = auth.authed
        this.loading = auth.loading
        this.user = auth.user
        this.error = auth.error
    }

    @action
    setAuthed = (authed: boolean): void => {
        this.authed = authed
    }

    @action
    setLoading = (loading: boolean): void => {
        this.loading = loading
    }

    @action
    setCurrentUser = (user?: ICurrentUser): void => {
        this.user = user
    }

    @action
    setError = (error?: IAuthError): void => {
        this.error = error
    }

    static token: string | null = null

    static saveToken = async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token)
        } catch (e) {
            console.error(e)
        }
    }

    static getToken = async (): Promise<string | null> => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY)
            return token
        } catch (e) {
            console.error(e)
            return null
        }
    }

    static removeToken = async (): Promise<void> => {
        await AsyncStorage.removeItem(TOKEN_KEY)
    }
}