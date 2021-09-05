import axios, { AxiosInstance, AxiosError } from 'axios'
import { Toast } from 'rn-element'
import { STATUS_CODE_MAP, RESPONSE_CODE_MAP } from '../consts'
import { history } from '../app'
import { baseURL, headers } from '../config'
import { store } from '../app'
import { AuthStore } from '../stores'

const HTTP_PRIVATE_KEY = 'HTTP_PRIVATE_KEY'
interface IHttpErrorInstance {
    error: AxiosError;
    preventDefault: () => void;
    getInternalUseDefaultErrorHandler: (privateKey?: string) => boolean | undefined;
}

export class HttpError implements IHttpErrorInstance {
    error: AxiosError
    useDefaultErrorHandler: boolean

    constructor(error: AxiosError) {
        this.error = error
        this.useDefaultErrorHandler = true

        this.preventDefault = this.preventDefault.bind(this)
    }
    
    preventDefault(): void {
        this.useDefaultErrorHandler = false
    }

    getInternalUseDefaultErrorHandler(privateKey?: string): boolean | undefined {
        if (privateKey === HTTP_PRIVATE_KEY) {
            return this.useDefaultErrorHandler
        }

        console.warn('getInternalUseDefaultErrorHandler is internal method, cannot call directly')
    }

    getHttpErrorInstance = (): IHttpErrorInstance => {
        const httpErrorInstance = {
            __proto__: HttpError.prototype,
            error: this.error,
            preventDefault: this.preventDefault,
            getInternalUseDefaultErrorHandler: this.getInternalUseDefaultErrorHandler
        }

        return httpErrorInstance
    }
}

export class Http {
    client: AxiosInstance = axios.create({
        baseURL,
        timeout: 1000,
        headers
    })

    constructor() {
        this.initialize()
    }

    initialize(): void {
        this.client.interceptors.request.use(config => {
            return config
        })

        this.client.interceptors.response.use(
            response => {
                return response
            },
            (error: AxiosError) => {
                const msg = STATUS_CODE_MAP[error.response?.status as number]
                
                switch (error.response?.status) {
                    case 400:
                    case 403: {
                        Toast.error(msg)
                        return Promise.reject(error)
                    }
                    case 401: {
                        Toast.error(msg)
                        store.auth?.setAuthed(false)
                        store.auth?.setCurrentUser(undefined)
                        AuthStore.removeToken()
                        history.replace({
                            pathname: '/login'
                        })
                        return
                    }
                    default: {
                        const httpError = new HttpError(error)
                        setTimeout(() => {
                            const useDefaultErrorHandler = httpError.getInternalUseDefaultErrorHandler(HTTP_PRIVATE_KEY)
                            if (useDefaultErrorHandler) {
                                console.error(error)
                                // 统一错误处理
                                const msg = RESPONSE_CODE_MAP[error.response?.data.code]
                                if (msg) {
                                    Toast.error(msg)
                                }
                            }
                        }, 0)
                        return Promise.reject(httpError.getHttpErrorInstance())
                    }
                }
            }
        )
    }
}
