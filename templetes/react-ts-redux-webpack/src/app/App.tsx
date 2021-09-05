import React, { Suspense, FC } from 'react'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import store from './store'
import 'styles/index.less'

const App: FC = () => {
    return (
        <Provider store={store}>
            <Suspense fallback='loading...'>
                <ConfigProvider locale={zhCN}>
                    app
                </ConfigProvider>
            </Suspense>
        </Provider>
    )
}

export default App
