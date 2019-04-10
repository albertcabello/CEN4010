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
		fetch('http://localhost:3001/register', {method: "POST", credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {
			return response.json();
		}).then((json) => {
			console.log(json);
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
		fetch('http://localhost:3001/login', {method: "POST", credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {
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
			return <Redirect to="/accountInfo"/>
		}
		if (this.state.registering) {
			return (
				<div className={styles['center']}>
					<div className={styles['center']}>
						<img className={styles['logo']} src="https://i.ibb.co/MSFL07F/logo-2x.png" />
					</div>
					<div className={styles['loginForm']+' '+styles['center']}>
						<form onSubmit={this.handleRegister}>
							<h4 className={styles['signIn']}>First Name</h4>
							<input className={styles['textbox']} type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
							<h4 className={styles['signIn']}>Last Name</h4>
							<input className={styles['textbox']} type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
							<h4 className={styles['signIn']}>Email</h4>
							<input className={styles['textbox']} type="text" value={this.state.email} onChange={this.handleEmailChange} />
							<h4 className={styles['signIn']}>Username</h4>
							<input className={styles['textbox']} type="text" value={this.state.username} onChange={this.handleUsernameChange} />
							<h4 className={styles['signIn']}>Password</h4>
							<input className={styles['textbox']} type="password" value={this.state.password} onChange={this.handlePasswordChange} />
							<h4 className={styles['signIn']}>Nickname (for reviews)</h4>
							<input className={styles['textbox']} type="text" value={this.state.nickname} onChange={this.handleNicknameChange} />
							<input className={styles['submit']} style={{margin: '20px 0', backgroundColor: '#8abbff'}} type="submit" value="Register!" />
						</form>
					</div>
				</div>

			);
		}
		else {
			return (
				<div className={styles['center']}>
					<div className={styles['center']}>
						<img className={styles['logo']} src="https://i.ibb.co/MSFL07F/logo-2x.png" />
					</div>
					<div className={styles['loginForm']+' '+styles['center']}>
						<div> 
							<h1 className={styles['signIn']}>Sign In</h1>
						</div>
						<form onSubmit={this.handleSubmit}>
							<h4 className={styles['signIn']}>Username</h4>
							<input className={styles['textbox']} type="text" value={this.state.username} onChange={this.handleUsernameChange} />
							<h4 className={styles['signIn']}>Password</h4>
							<input className={styles['textbox']} type="password" value={this.state.password} onChange={this.handlePasswordChange} />
							<input className={styles['submit']} style={{backgroundColor: '#8abbff'}} type="submit" value="Submit" />
						</form>
						<div style={{width: '100%', height: '4px', borderBottom: '1px solid #ddd', textAlign: 'center', padding: '10px 0'}}>
							<span style={{fontSize: '9px', backgroundColor: '#FFFFFF', padding: '0 5px', color: '#777'}}>
								New to Booker?
							</span>
						</div>
						<button className={styles['submit']} style={{margin: '20px 0'}} type="button" onClick={this.handleRegisterSwitch}>Register New User</button>
					</div>
				</div>
			);
		}
	}
}
