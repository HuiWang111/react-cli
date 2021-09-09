import { Suspense, FC, PropsWithChildren } from 'react'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { AppContext } from 'hooks'
import { api, store } from './appContext'

const Provides: FC = ({ children }: PropsWithChildren<any>) => {
    return (
        <Suspense
            fallback={
                <div className='absolute-center'>
                    <Spin />
                </div>
            }
        >
            <ConfigProvider locale={zhCN}>
                <AppContext.Provider value={{ api, store }}>
                    { children }
                </AppContext.Provider>
            </ConfigProvider>
        </Suspense>
    )
}

export default Provides