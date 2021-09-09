import { AuthStore, TOKEN_KEY } from 'stores'

let baseURL = '/api/'

if (process.env.NODE_ENV === 'production') {
    baseURL = '/api/'
}

export { baseURL }

export const headers = {
    [TOKEN_KEY]: AuthStore.getToken()
}