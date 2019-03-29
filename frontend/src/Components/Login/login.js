import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import styles from './login.module.css';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			registering: false,
			email: '',
			firstName: '',
			lastName: '',
			nickname: '',
			redirectHome: false
		}
		
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleNicknameChange = this.handleNicknameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleRegisterSwitch = this.handleRegisterSwitch.bind(this);
	}

	handleUsernameChange(event) {
		let tmpState = this.state;
		tmpState.username = event.target.value;
		this.setState(tmpState);
	}

	handlePasswordChange(event) {
		let tmpState = this.state;
		tmpState.password = event.target.value;
		this.setState(tmpState);
	}

	handleEmailChange(event) {
		let tmpState = this.state;
		tmpState.email = event.target.value;
		this.setState(tmpState);
	}

	handleFirstNameChange(event) {
		let tmpState = this.state;
		tmpState.firstName = event.target.value;
		this.setState(tmpState);
	}

	handleLastNameChange(event) {
		let tmpState = this.state;
		tmpState.lastName = event.target.value;
		this.setState(tmpState);
	}
	
	handleNicknameChange(event) {
		let tmpState = this.state;
		tmpState.nickname = event.target.value;
		this.setState(tmpState);
	}

	handleRegister(event) {
		let body = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			nickname: this.state.nickname
		};

		fetch('http://localhost:3001/login', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {
			return response.json();
		}).then((json) => {
			if (json.success) {
				let tmpState = this.state;
				tmpState.redirectHome = true;
				this.setState(tmpState);
			}
			else {
				alert(json.error);
			}
		});
	}

	handleRegisterSwitch(event) {
		let tmpState = this.state;
		tmpState.registering = true;
		this.setState(tmpState);
	}

	handleSubmit(event) {
		let body = {
			username: this.state.username,
			password: this.state.password
		};
		fetch('http://localhost:3001/login', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {
			return response.json();
		}).then((json) => {
			if (json.success) {
				let tmpState = this.state;
				tmpState.redirectHome = true;
				this.setState(tmpState);
			}
			else {
				alert(json.error);
			}
		});
		event.preventDefault();

	}

	render() {
		if (this.state.redirectHome) {
			return <Redirect to="/home"/>
		}
		if (this.state.registering) {
			return (
				<div>
					<div>
						Logo Here
					</div>
					<div className={styles['loginForm']}>
						<form onSubmit={this.handleRegister}>
							<h4 className={styles['signIn']}>First Name</h4>
							<input type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
							<h4 className={styles['signIn']}>Last Name</h4>
							<input type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
							<h4 className={styles['signIn']}>Email</h4>
							<input type="text" value={this.state.email} onChange={this.handleEmailChange} />
							<h4 className={styles['signIn']}>Username</h4>
							<input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
							<h4 className={styles['signIn']}>Password</h4>
							<input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
							<h4 className={styles['signIn']}>Nickname (for reviews)</h4>
							<input type="text" value={this.state.nickname} onChange={this.handleNicknameChange} />
							<input type="submit" value="Register!" />
						</form>
					</div>
				</div>

			);
		}
		else {
			return (
				<div>
					<div>
						Logo Here
					</div>
					<div className={styles['loginForm']}>
						<form onSubmit={this.handleSubmit}>
							<h4 className={styles['signIn']}>Username</h4>
							<input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
							<h4 className={styles['signIn']}>Password</h4>
							<input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
							<input type="submit" value="Submit" />
						</form>
						<button type="button" onClick={this.handleRegisterSwitch}>Register New User</button>
					</div>
				</div>
			);
		}
	}
}
