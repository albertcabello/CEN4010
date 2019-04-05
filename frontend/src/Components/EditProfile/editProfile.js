import React from 'react';
import Header from '../Header/header.js';
import { Redirect } from 'react-router-dom';

import styles from './editProfile.module.css';


export default class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				firstName: '',
				lastName: '',
				email: '',
				nickname: '',
				username: '',
				password: ''
			},
			loggedIn: undefined
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	componentDidMount() {
		fetch('http://localhost:3001/isLoggedIn', {credentials: "include"}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.hasOwnProperty('error')) {
				let tmpState = this.state;
				tmpState.loggedIn = false;
				this.setState(tmpState);
			}
			else {
				let tmpState = this.state;
				tmpState.user.username = json.user.username;
				tmpState.user.firstName = json.user.firstName;
				tmpState.user.lastName = json.user.lastName;
				tmpState.user.email = json.user.email;
				tmpState.user.nickname = json.user.nickname;
				tmpState.loggedIn = true;
				this.setState(tmpState);
			}
		});
	}

	handleInputChange(event) {
		let tmpState = this.state;
		tmpState.user[event.target.name] = event.target.value;
		this.setState(tmpState);
	}

	handleSubmit(event) {
		let body = {
			username: this.state.user.username,
			email: this.state.user.email,
			firstName: this.state.user.firstName,
			lastName: this.state.user.lastName,
			nickname: this.state.user.nickname
		}
		if (this.state.user.password !== '') {
			body.password = this.state.user.password;
		}
		fetch('http://localhost:3001/update', {method: "PUT" , credentials: "include", headers: {"Content-Type": "application/json"},  body: JSON.stringify(body)}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.hasOwnProperty("error")) {
				alert("There was an error on the server, please try again later " + json.error);
				let tmpState = this.state;
				tmpState.finsihed = true;
				this.setState(tmpState);
			}
			else {
				alert("Done! You will now be redirected back to the account page");
				let tmpState = this.state;
				tmpState.finished = true;
				this.setState(tmpState);
			}
		});
		event.preventDefault();
	}

	render() {
		if (this.state.finished) {
			return (
				<div>
					<Redirect to="/accountInfo" />
				</div>
			);
		}
		if (this.state.loggedIn) {
			return (
				<div>
					<Header />
					<div className={styles['center']}>
						<div className={styles['editForm']}>
							<div className={styles['labeling']} >
								Edit your account information
							</div>
							<form onSubmit={this.handleSubmit}>
								<div className={styles['textLabel']}>First Name</div>
								<input className={styles['textbox']} type="text" name="firstName" value={this.state.user.firstName} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Last Name</div>
								<input className={styles['textbox']} type="text" name="lastName" value={this.state.user.lastName} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Username</div>
								<input className={styles['textbox']} type="text" name="username" value={this.state.user.username} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Password</div>
								<input className={styles['textbox']} type="password" name="password" value={this.state.user.password} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Email</div>
								<input className={styles['textbox']} type="text" name="email" value={this.state.user.email} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Nickname</div>
								<input className={styles['textbox']} type="text" name="nickname" value={this.state.user.nickname} onChange={this.handleInputChange} />
								<input type="submit" className={styles['subBtn']} value="Save" />
							</form>
						</div>
					</div>
				</div>
			);
		}
		else if (this.state.loggedIn === undefined) {
			return (<div>Waiting</div>);
		}
		else {
			alert("You are not logged in, you will be redirected to the login screen");
			return (
				<div>
					<Redirect to="/login" />
				</div>
			);
		}
	}
}
