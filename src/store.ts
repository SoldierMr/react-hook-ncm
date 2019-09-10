import {createStore, Store} from 'redux'
import reducer from './reducer'
import {create} from 'redux-react-hook'

export function makeStore() {
    return createStore(reducer)
}

export const { StoreContext, useDispatch, useMappedState } = create()