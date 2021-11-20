import { AuthStore, TOKEN_KEY } from '../stores'

let baseURL = 'http://10.0.6.36:6666'

if (process.env.NODE_ENV === 'production') {
    baseURL = '/api/'
}

export { baseURL }

export const headers = {
    [TOKEN_KEY]: AuthStore.token || ''
}