import { FC } from 'react'
import { Button, Row, Col } from 'antd'
import { useAppContext } from 'hooks'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

export const Login: FC = observer(() => {
    const { api, store } = useAppContext()
    const history = useHistory()
    const handleLogin = () => {
        api.auth.login(
            { username: 'root', password: '123456' },
            store.auth
        )
    }

    return (
        <Row align='middle' justify='center' style={{ height: 300 }}>
            <Col>
                <Button type='primary' onClick={handleLogin}>登录</Button>
            </Col>
        </Row>
    )
})
