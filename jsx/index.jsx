import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import Dragula from 'react-dragula';


//initial state for tasks dataset
var tasksInitialState = {
    tasks: []
}

const tasksReducer = (state=tasksInitialState, action) => {
    if (action.type === "ADD") {
        state = {
            ...state, 
            tasks: [...state.tasks, action.newTask]
            }
    }
    if (action.type === "DEC") {
        state = {...state, numberOfToDo: state.numberOfToDo - action.payload}
    }
    if (action.type === "TASKS_RECEIVED") {
        state = {...state, tasks: action.payload}
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
                console.log(response.data[0].taskstatus);
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

componentDidMount() {
    var toDo = ReactDOM.findDOMNode(this.refs.toDo);
    var inProgress = ReactDOM.findDOMNode(this.refs.inProgress);
    var complete = ReactDOM.findDOMNode(this.refs.complete);
    Dragula([toDo, inProgress, complete])
        .on("drop", function(el, container) {
            console.log(container.id);
        var taskData = {
            taskid: el.id,
            taskstatus: container.id
        }
        axios.post('api/v1/taskstatus', taskData)
        .then((response) => {
            console.log("suck sess");
        });
        });
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

    function toDoStatus(value) {
        return value.taskstatus === "toDo";
    }

    var toDoTasks = this.props.taskList.tasks.filter(toDoStatus);

    function inProgressStatus(value) {
        return value.taskstatus === "inProgress";
    }

    var inProgressTasks = this.props.taskList.tasks.filter(inProgressStatus);

    function completeStatus(value) {
        return value.taskstatus === "complete";
    }

    var completeTasks = this.props.taskList.tasks.filter(completeStatus);

        if(toDoTasks !== null) {
            var loopToDo = toDoTasks.map((tasksEntered) => {
                return (
                    <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
                );
            });
        } else {
            var loopPosts = <div>No more posts!</div>
        }

        if(inProgressTasks !== null) {
            var loopInProgress = inProgressTasks.map((tasksEntered) => {
                return (
                    <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
                );
            });
        } else {
            var loopPosts = <div>No more posts!</div>
        }

        if(completeTasks !== null) {
            var loopComplete = completeTasks.map((tasksEntered) => {
                return (
                    <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
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
                        <div className="columnHeader">To Do: {this.props.taskList.tasks.length}</div>
                        <div ref="toDo" id="toDo" className="container toDo">{loopToDo}</div>
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">In Progress: {this.props.taskList.numberOfInProgress}</div>
                        <div ref="inProgress" id="inProgress" className="container inProgress">{loopInProgress}</div>
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">Complete: {this.props.taskList.numberOfComplete}</div>
                        <div ref="complete" id="complete" className="container complete">{loopComplete}</div>
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