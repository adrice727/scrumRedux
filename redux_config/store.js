import {applyMiddleware, createStore, combineReducers} from "redux";
import thunk from "redux-thunk";

import configReducer from "./reducers";


const configureStore = () => {

	const middleware = applyMiddleware(thunk);
	const store = createStore(configReducer, middleware);

	//triggers on change of store
	store.subscribe(() => {
	    console.log("change happened");
	})

	return store;
}

export default configureStore;