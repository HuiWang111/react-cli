import { FC } from 'react'
import { Button, Row, Col } from 'antd'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'

export const Dashboard: FC = observer(() => {
    const { api, store } = useAppContext()
    const handleLogout = () => {
        api.auth.logout(store.auth)
    }

    return (
        <Row align='middle' justify='center' style={{ height: 300 }}>
            <Col>
                Dashboard! 
                <Button type='primary' onClick={handleLogout}>退出登录</Button>
            </Col>
        </Row>
    )
})