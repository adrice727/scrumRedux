import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import update from 'react-addons-update';


//initial state for tasks dataset
var tasksInitialState = {
    numberOfTasks: 0,
    tasks: []
}

const tasksReducer = (state=tasksInitialState, action) => {
    if (action.type === "ADD") {
        state = {
            ...state, 
            numberOfTasks: state.numberOfTasks + action.payload, 
            tasks: [...state.tasks, action.newTask]
            }
    }
    if (action.type === "DEC") {
        state = {...state, numberOfTasks: state.numberOfTasks - action.payload}
    }
    if (action.type === "TASKS_RECEIVED") {
        state = {...state, tasks: action.payload, numberOfTasks: action.payload.length}
    }
    if (action.type === "FETCHING_FAILED") {
        state = {...state, tasks: action.payload}
    }
    return state;
}

//not sure what this is for yet
const otherReducer = (state={}, action) => {
    return state;
}

//allows us have one store while calling on one reducer dependent on the data set being augmented
const reducers = combineReducers({
    tasks: tasksReducer,
    other: otherReducer
})


const middleware = applyMiddleware(thunk);
const germzFirstStore = createStore(reducers, middleware);

//triggers on change of store
germzFirstStore.subscribe(() => {
    console.log("change happened");
})


function fetchTasks(){

    return function(dispatch){
        axios.get("api/v1/loadtasks")
            .then((response) => {
                dispatch({type: "TASKS_RECEIVED", payload: response.data})
            })
            .catch((err) => {
                dispatch({type: "FETCHING_FAILED", payload: err})
            })
    }
}





class Lander extends React.Component {

    render() {
    	return(
    		<div>
    			<div className="tile">
    			{this.props.children}
				</div>
    		</div>
    	)
    }
}


class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName : "Front Page"
        };
    }
    render() {
        return(
            <div>
                <div className="toolbar">Toolbar status: {this.state.pageName}</div>
            </div>
        )
    }
}



@connect((germzFirstStore) => {
    return {
        taskList: germzFirstStore.tasks
    }
})
class TaskBoard extends React.Component {

componentWillMount() {
    this.props.dispatch(fetchTasks());
}

    addTask() {
        const taskData = {
            task: ReactDOM.findDOMNode(this.refs.taskInput).value,
        };
        axios.post('api/v1/newtask', taskData)
        .then((response) => {
            germzFirstStore.dispatch({type: "ADD", payload: 1, newTask: taskData})
        });
    }

    render() {

        if(this.props.taskList.tasks !== null) {
            var loopTasks = this.props.taskList.tasks.map((tasksEntered) => {
                return (
                    <div className="taskBox">{tasksEntered.task}</div>
                );
            });
        } else {
            var loopPosts = <div>No more posts!</div>
        }


    	return(
			<div className="headerBox">
                <div className="headerTitle">Nothing</div>
                <form>
                    <input ref="taskInput" className="inputTask" type="text" />
                    <button onClick={this.addTask.bind(this)} ref="taskSubmit" className="inputButton">Submit</button>
                </form>
                <div className="columnContainer">
                    <div className="scrumColumn">
                        <div className="columnHeader">To Do: {this.props.taskList.numberOfTasks}</div>
                        {loopTasks}
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">In Progress</div>
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">Complete</div>
                    </div>
                </div>
			</div>
    	)
    }
}


class Settings extends React.Component {

    render() {
    	return(
			<div className="headerBox">
				<div className="headerTitle">Settings</div>
			</div>
    	)
    }
}

class Layout extends React.Component {

    render() {
        return(
            <div>
                <Toolbar />
                <Router history={hashHistory}>
                    <Route path='/' component={Lander}>
                        <IndexRoute component={TaskBoard}></IndexRoute>
                        <Route path='settings' component={Settings}></Route>
                    </Route>
                </Router>
            </div>
        )
    }
}



ReactDOM.render(<Provider store={germzFirstStore}>
                <Layout />
                </Provider>, document.getElementById('content'));