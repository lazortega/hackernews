import {createStore} from "redux";

const initialState = {arrayTest: []};

function historyReducer(state = initialState, action) {
    switch (action.type) {
        case 'push':
            return {
                arrayTest: [...state.arrayTest, action.payload]
            };
        default:
            break;
    }

    return state;
}

const store = createStore(historyReducer);

export default store;
