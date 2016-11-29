import {applyMiddleware, createStore, combineReducers} from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";


export default function() {

const middleware = applyMiddleware(thunk);
const store = createStore(reducers, middleware);

//triggers on change of store
store.subscribe(() => {
    console.log("change happened");
})

}