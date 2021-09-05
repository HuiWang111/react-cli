import { UserStore } from './user'
import { AuthStore } from './auth'

export class AppStore {
    user = new UserStore(this)
    auth = new AuthStore({
        authed: !!AuthStore.token,
        loading: false
    })
}

export { AuthStore, TOKEN_KEY } from './auth'