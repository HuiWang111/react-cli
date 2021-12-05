import { createContext, useContext } from 'react'
import { AppStore } from '@/stores/index'
import { AppApi } from '@/apis/index'

export interface IAppContext {
    api: AppApi;
    store: AppStore;
}

export const AppContext = createContext<IAppContext | null>(null)

export const useAppContext = (): IAppContext => {
    const appContext = useContext(AppContext)
    return appContext as IAppContext
}
