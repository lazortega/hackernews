import {createStore} from "redux";

const initialState = {searchs: []};

function historyReducer(state = initialState, action) {
    switch (action.type) {
        case 'push':
            return {
                searchs: [...state.searchs, action.payload]
            };
        default:
            break;
    }

    return state;
}

const store = createStore(historyReducer);

export default store;
