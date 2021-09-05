import { UserStore } from './user'
import { AuthStore } from './auth'

const token = AuthStore.getToken()

export class AppStore {
    user = new UserStore(this)
    auth = new AuthStore({
        authed: !!token,
        loading: false
    })
}

export { AuthStore, TOKEN_KEY } from './auth'