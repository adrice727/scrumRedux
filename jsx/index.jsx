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
    tasks: [],
    toDoLength: 0,
    inProgressLength: 0,
    completeLength: 0
}

const tasksReducer = (state=tasksInitialState, action) => {
    if (action.type === "ADD") {
        state = {...state, tasks: [...state.tasks, action.newTask]}
    }
    if (action.type === "ADD_TODO_COUNTER") {
        state = {...state, toDoLength: state.toDoLength + action.payload}
    }
    if (action.type === "ADD_INPROGRESS_COUNTER") {
        state = {...state, inProgressLength: state.inProgressLength + action.payload}
    }
    if (action.type === "ADD_COMPLETE_COUNTER") {
        state = {...state, completeLength: state.completeLength + action.payload}
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
                dispatch({type: "TASKS_RECEIVED", payload: response.data})
                var toDo = 0;
                var inProgress = 0;
                var complete = 0;
                response.data.map((tasksEntered) => {
                    if(tasksEntered.taskstatus === "toDo"){
                        toDo = toDo + 1;
                    }
                    else if(tasksEntered.taskstatus === "inProgress"){
                        inProgress = inProgress + 1;
                    }
                    else if(tasksEntered.taskstatus === "complete"){
                        complete = complete + 1;
                    }
                })
                dispatch({type: "ADD_TODO_COUNTER", payload: toDo})
                dispatch({type: "ADD_INPROGRESS_COUNTER", payload: inProgress})
                dispatch({type: "ADD_COMPLETE_COUNTER", payload: complete})
            })
            .catch((err) => {
                dispatch({type: "FETCHING_FAILED", payload: err})
            })
    }
}

function addCounter(taskType){
    var taskType = taskType;
    return function(dispatch) {
        if(taskType === "toDo"){
            dispatch({type: "ADD_TODO_COUNTER", payload: 1})
        }
        else if(taskType === "inProgress"){
            dispatch({type: "ADD_INPROGRESS_COUNTER", payload: 1})
        }
        else if(taskType === "complete"){
            dispatch({type: "ADD_COMPLETE_COUNTER", payload: 1})
        }                
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
    var self = this;
    Dragula([toDo, inProgress, complete])
        .on("drop", function(el, container) {
        var taskData = {
            taskid: el.id,
            taskstatus: container.id
        }
        axios.post('api/v1/taskstatus', taskData)
        .then((response) => {
            self.props.dispatch(addCounter(taskData.taskstatus));
        });
        });
  }


    addTask() {
        const taskData = {
            task: ReactDOM.findDOMNode(this.refs.taskInput).value,
        };
        axios.post('api/v1/newtask', taskData)
        .then((response) => {
            this.props.dispatch(fetchTasks());
        });
    }

    render() {

    function toDoStatus(value) {
        return value.taskstatus === "toDo";
    }

    var toDoTasks = this.props.taskList.tasks.filter(toDoStatus);
    var loopToDo = toDoTasks.map((tasksEntered) => {
        return (
            <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });

    function inProgressStatus(value) {
        return value.taskstatus === "inProgress";
    }

    var inProgressTasks = this.props.taskList.tasks.filter(inProgressStatus);
    var loopInProgress = inProgressTasks.map((tasksEntered) => {
        return (
            <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });

    function completeStatus(value) {
        return value.taskstatus === "complete";
    }

    var completeTasks = this.props.taskList.tasks.filter(completeStatus);
    var loopComplete = completeTasks.map((tasksEntered) => {
        return (
            <div id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });


    	return(
			<div className="headerBox">
                <div className="headerTitle">Nothing</div>
                <form>
                    <input ref="taskInput" className="inputTask" type="text" />
                    <button onClick={this.addTask.bind(this)} ref="taskSubmit" className="inputButton">Submit</button>
                </form>
                <div className="columnContainer">
                    <div className="scrumColumn">
                        <div className="columnHeader">To Do: {this.props.taskList.toDoLength}</div>
                        <div ref="toDo" id="toDo" className="container toDo">{loopToDo}</div>
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">In Progress: {this.props.taskList.inProgressLength}</div>
                        <div ref="inProgress" id="inProgress" className="container inProgress">{loopInProgress}</div>
                    </div>
                    <div className="scrumColumn">
                        <div className="columnHeader">Complete: {this.props.taskList.completeLength}</div>
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