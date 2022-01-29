import { FC } from 'react'
import { Button, Row, Col } from 'antd'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import './index.less'

export const Dashboard: FC = observer(() => {
    const { api, store } = useAppContext()
    const handleLogout = () => {
        api.auth.logout(store.auth)
    }

    return (
        <div className='container'>
            <div className='button'>
                女士
            </div>
        </div>
    )
})