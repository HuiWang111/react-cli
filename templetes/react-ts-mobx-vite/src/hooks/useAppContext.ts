import { createContext, useContext } from 'react'
import { AppStore } from 'stores'
import { AppApi } from 'apis'

export interface IAppContext {
    api: AppApi;
    store: AppStore;
}

export const AppContext = createContext<IAppContext | null>(null)

export const useAppContext = (): IAppContext => {
    const appContext = useContext(AppContext)
    return appContext as IAppContext
}
