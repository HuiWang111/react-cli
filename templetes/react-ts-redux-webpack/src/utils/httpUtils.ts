import axios from 'axios'
import { CustomizedEvent } from './event'

export const http = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
})

export class HttpError {
    error: any
    useDefaultHandler: (error: any) => void

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(error: any, useDefaultHandler: (error: any) => void) {
        this.error = error
        this.useDefaultHandler = useDefaultHandler
    }
}

const httpErrorEvent = new CustomizedEvent()
const httpErrorEventName = 'useDefaultErrorHandler'

httpErrorEvent.addListener(httpErrorEventName, (e: any): void => {
    // 统一错误处理
    console.error(e)
})

const useDefaultHandler = (error: any): void => {
    httpErrorEvent.emit(httpErrorEventName, error)
}

http.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(new HttpError(error, useDefaultHandler))
    }
)
