import ReactDOM from 'react-dom'
import App from 'app/App'
import { Router } from 'react-router-dom'
import { history } from 'app/history'
import { configure } from 'mobx'
import 'styles/index.less'

const init = () => {
    configure({
        enforceActions: "always"
    })

    ReactDOM.render(
        <Router history={history}>
            <App />
        </Router>,
        document.getElementById('root')
    )
}

init()