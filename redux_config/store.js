import {applyMiddleware, createStore, combineReducers} from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";


	const configureStore = () => {

	const middleware = applyMiddleware(thunk);
	const store = createStore(reducers, middleware);

	//triggers on change of store
	store.subscribe(() => {
	    console.log("change happened");
	})

	return store;
}

export default configureStore;