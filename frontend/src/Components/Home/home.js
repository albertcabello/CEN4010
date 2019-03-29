import React from 'react';
import Header from "../Header/header.js";

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false
		}
	}

	componentDidMount() {
		let me = this;
		fetch('http://localhost:3001/isLoggedIn', (response) => {
			return response.json();
		}).then((json) => {
			me.setState({isLoggedIn: json.status});
		});
	}

	render() {
		if (this.state.isLoggedIn) {
			return (<div> TRUE </div>);
		}
		else {
			return (<div> FALSE </div>);
		}
	}
}
