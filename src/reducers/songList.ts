import {Action, IState, INITIAL_STATE} from '@actions/songList'

const GET_HOT_LISTS :string = 'get_hot_lists'
const GET_NEW_SONGS :string = 'get_new_songs'
const GET_BOARD_SONGS :string = 'get_board_songs'

export default function reducer(state: IState = INITIAL_STATE, action: Action) {
    switch (action.type) {
        case GET_HOT_LISTS : {
            return {
                ...state,
                lastUpdated_hotLists: Date.now(),
                hotLists: action.hotLists,
            }
        }
        case GET_NEW_SONGS : {
            return {
                ...state,
                lastUpdated_newLists: Date.now(),
                newLists: action.newLists,
            }
        }
        case GET_BOARD_SONGS : {
            return {
                ...state,
                lastUpdated_boardSongs: {...state.lastUpdated_boardSongs, [action.idx]: Date.now()},
                boardSongs: {...state.boardSongs, [action.idx]: action.boardSongs},
            }
        }
    }
}

