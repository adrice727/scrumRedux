import {applyMiddleware, createStore, combineReducers} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import * as reducers from "./reducers"

const middleware = applyMiddleware(thunk);

//triggers on change of store
germzFirstStore.subscribe(() => {
    console.log("change happened");
})

export const germzFirstStore = createStore(reducers.reducers, middleware, logger());