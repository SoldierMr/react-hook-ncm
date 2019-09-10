import * as React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import loadable from '@loadable/component'

const HomeComponent = loadable(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@views/home'));
const SongComponent = loadable(() => import(/* webpackChunkName: "song" */ /* webpackPrefetch: true */ '@views/song'));

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Router>
                    <Route exact path="/" component={HomeComponent}></Route>
                    <Route exact path="/song" component={SongComponent}></Route>
                </Router>
            </div>
        )
    }
}

export default App