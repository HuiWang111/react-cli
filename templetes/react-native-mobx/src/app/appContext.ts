import { AppApi } from '@/apis/index'
import { AppStore } from '@/stores/index'
import App from './App'

export const store = new AppStore()
export const api = new AppApi(store)

export default App