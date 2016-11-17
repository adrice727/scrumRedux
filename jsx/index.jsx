import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';


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


class SubmitEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
    	return(
			<div className="headerBox">
                <div className="headerTitle">Something</div>
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

class FrontPage extends React.Component {
    render() {
    	return(
    		<Lander />
    	)
    }
}


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={Lander}>
			<IndexRoute component={SubmitEmail}></IndexRoute>
			<Route path='settings' component={Settings}></Route>
		</Route>
	</Router>,
document.getElementById('content'));