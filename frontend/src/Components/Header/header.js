import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loggedIn: false};
	}

	componentDidMount() {
		let me = this;
		/*
		fetch('localhost:8001/isLoggedIn', {mode: 'no-cors'}, (res) => {
			me.setState({loggedIn: res.status});
		});
		*/
	}

	render() {
		return (
			<div> 
				<Link to={this.state.loggedIn ? "/accountInfo" : "/login"}>
					<i className="fas fa-user"></i>
				</Link>
			</div>
		);
	}
}

