import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import Dragula from 'react-dragula';

import {fetchTasks, addCounter} from "../public/js/redux/actions.js";
import store from "../public/js/redux/store.js"


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



@connect((store) => {
    return {
        taskList: store.tasks
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
        .on("drop", function(el, container, source) {
        var taskData = {
            tasksource: source.id,
            taskid: el.getAttribute("data-id"),
            taskstatus: container.id
        }
        axios.post('api/v1/taskstatus', taskData)
        .then((response) => {
            self.props.dispatch(addCounter(taskData.taskstatus, taskData.tasksource)); 
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
            <div data-id={tasksEntered.idtasks} id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });

    function inProgressStatus(value) {
        return value.taskstatus === "inProgress";
    }

    var inProgressTasks = this.props.taskList.tasks.filter(inProgressStatus);
    var loopInProgress = inProgressTasks.map((tasksEntered) => {
        return (
            <div data-id={tasksEntered.idtasks} id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });

    function completeStatus(value) {
        return value.taskstatus === "complete";
    }

    var completeTasks = this.props.taskList.tasks.filter(completeStatus);
    var loopComplete = completeTasks.map((tasksEntered) => {
        return (
            <div data-id={tasksEntered.idtasks} id={tasksEntered.idtasks} className="taskBox">{tasksEntered.task}</div>
        );
    });


        return(
            <div className="headerBox">
                <div className="headerTitle">Something</div>
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



ReactDOM.render(<Provider store={store}>
                <Layout />
                </Provider>, document.getElementById('content'));