import { AppApi } from 'apis'
import { AppStore } from 'stores'

export const store = new AppStore()
export const api = new AppApi(store)