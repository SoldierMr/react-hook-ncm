import React from 'react';
import ReactDom from 'react-dom';
import App from './App'
import { StoreContext, makeStore } from '@store'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
OfflinePluginRuntime.install()

const store = makeStore()

ReactDom.render(
    <StoreContext.Provider value={store}>
        <App />
    </StoreContext.Provider>
    , document.getElementById('root')
)
