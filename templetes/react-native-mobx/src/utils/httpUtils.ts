import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { Toast, Loading } from 'rn-element'
import { baseURL, headers } from '@/config/index'

const HTTP_PRIVATE_KEY = 'HTTP_PRIVATE_KEY'
interface IHttpErrorInstance {
    error: Error;
    preventDefault: () => void;
    getInternalUseDefaultErrorHandler: (privateKey?: string) => boolean | undefined;
}

export class HttpError implements IHttpErrorInstance {
    error: Error
    useDefaultErrorHandler: boolean
    response: AxiosResponse

    constructor(error: Error, response: AxiosResponse) {
        this.error = error
        this.useDefaultErrorHandler = true
        this.response = response

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

    getHttpErrorInstance = (response: AxiosResponse): IHttpErrorInstance => {
        const httpErrorInstance = {
            __proto__: HttpError.prototype,
            error: this.error,
            response,
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

    private handleError(response: AxiosResponse) {
        const message = response.data.msg || response.data.message
        const httpError = new HttpError(new Error(message), response)
        setTimeout(() => {
            const useDefaultErrorHandler = httpError.getInternalUseDefaultErrorHandler(HTTP_PRIVATE_KEY)
            if (useDefaultErrorHandler) {
                // 统一错误处理
                Toast.error(message || '操作失败')
            }
        }, 0)
        return httpError
    }

    initialize(): void {
        this.client.interceptors.request.use(config => {
            Loading.show()
            return config
        })

        this.client.interceptors.response.use(
            response => {
                Loading.hide()
                return new Promise((resolve, reject) => {
                    if (response.data.code === '00') {
                        resolve(response)
                    } else {
                        const httpError = this.handleError(response)
                        reject(httpError.getHttpErrorInstance(response))
                    }
                })
            },
            (error: AxiosError) => {
                Loading.hide()
                Toast.error('网络异常，请稍后重试')
                return Promise.reject(error)
            }
        )
    }
}
