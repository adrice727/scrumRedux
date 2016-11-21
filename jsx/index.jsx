import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';

var initialState = {
    numberOfTasks: 0,
    tasks: []
}

const tasksReducer = (state=initialState, action) => {
    if (action.type === "ADD") {
        state = {...state, numberOfTasks: state.numberOfTasks + action.payload}
    }
    if (action.type === "DEC") {
        state = {...state, numberOfTasks: state.numberOfTasks - action.payload}
    }
    if (action.type === "TASKS_RECEIVED") {
        state = {...state, tasks: action.payload}
    }
    if (action.type === "FETCHING_FAILED") {
        state = {...state, tasks: action.payload}
    }
    return state;
}

const otherReducer = (state={}, action) => {
    return state;
}


const reducers = combineReducers({
    tasks: tasksReducer,
    other: otherReducer
})

//redux's state
const middleware = applyMiddleware(thunk);
const germzFirstStore = createStore(reducers, middleware);

//triggers on change of store
germzFirstStore.subscribe(() => {
    console.log("number of tasks:");
})


function fetchTasks(){

    return function(dispatch){
        axios.get("api/v1/loadtasks")
            .then((response) => {
                console.log(response.data);
                dispatch({type: "TASKS_RECEIVED", payload: response.data})
            })
            .catch((err) => {
                dispatch({type: "FETCHING_FAILED", payload: err})
            })
    }
}







class Lander extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
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
    constructor(props) {
        super(props);
    }

componentWillMount() {
    this.props.dispatch(fetchTasks());
}

    addTask() {
        const taskData = {
            task: ReactDOM.findDOMNode(this.refs.taskInput).value,
        };
        axios.post('api/v1/newtask', taskData)
        .then((response) => {
            germzFirstStore.dispatch({type: "ADD", payload: 1})
        });
    }

    render() {


        if(this.props.taskList.tasks !== null) {
            var loopTasks = this.props.taskList.tasks.map((tasksEntered) => {
                return (
                    <div>{tasksEntered.task}</div>
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
                        <h4>To Do: {this.props.taskList.numberOfTasks}</h4>
                        {loopTasks}
                    </div>
                    <div className="scrumColumn">
                        <h4>In Progress</h4>
                    </div>
                    <div className="scrumColumn">
                        <h4>Complete</h4>
                    </div>
                </div>
			</div>
    	)
    }
}


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
    	return(
			<div className="headerBox">
				<div className="headerTitle">Settings</div>
			</div>
    	)
    }
}

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
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