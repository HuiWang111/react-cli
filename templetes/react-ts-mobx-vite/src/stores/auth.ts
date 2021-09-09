import { IAuth, IAuthError, ICurrentUser } from 'types'
import { action, observable } from 'mobx'
import Cookies from 'js-cookie'

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

    static saveToken = (token: string): void => {
        Cookies.set(TOKEN_KEY, token)
    }

    static getToken = (): string | undefined => {
        return Cookies.get(TOKEN_KEY) || undefined
    }

    static removeToken = (): void => {
        Cookies.remove(TOKEN_KEY)
    }
}