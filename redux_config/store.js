import {applyMiddleware, createStore, combineReducers} from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";


export default function configureStore(tasksInitialState) {

	return createStore(
		reducers,
		tasksInitialState,
		applyMiddleware(thunk)
		);
	}

