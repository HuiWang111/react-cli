import { AppApi } from '../apis'
import { AppStore } from '../stores'
import App from './App'

export const store = new AppStore()
export const api = new AppApi(store)

export default App