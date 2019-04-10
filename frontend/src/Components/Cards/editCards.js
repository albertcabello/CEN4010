import React from 'react';
import Header from '../Header/header.js';
import { Redirect } from 'react-router-dom';

import styles from './editCards.module.css';


export default class EditCards extends React.Component {
	constructor(props) {
		super(props);
		const s = this.props.location.state;
		if (s !== undefined) {
			if (s.editing) {
				this.state = {loggedIn: undefined, finished: false, editing: s.editing, card: s.card, };
			}
			else {
				this.state = {loggedIn: undefined,
					      finished: false,
					      card: {
					        cardNumber: ''
					      },
					      editing: false
					    };
			}
		}
		else {
			if (s.editing) {
				this.state = {loggedIn: undefined, finished: true, editing: s.editing};
			}
			else {
				this.state = {loggedIn: undefined,
					      finished: false,
					      card: {
					      	cardNumber: '',
					      },
					      editing: false
					    };
			}
				
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
				tmpState.loggedIn = true;
				this.setState(tmpState);
			}
		});
	}

	handleInputChange(event) {
		let tmpState = this.state;
		tmpState.card[event.target.name] = event.target.value;
		this.setState(tmpState);
	}

	handleSubmit(event) {
		let body = {
			cardId: this.state.card.id,
			cardNumber: this.state.card.cardNumber
		}
		fetch('http://localhost:3001/card', {method: this.state.editing ? "PUT" : "POST" , credentials: "include", headers: {"Content-Type": "application/json"},  body: JSON.stringify(body)}).then((res) => {
			console.log("HERE 2");
			return res.json();
		}).then((json) => {
			console.log("HERE");
			if (json.hasOwnProperty("error") && json.error === "Credit card number is not valid") {
				alert("That is not a valid credit card number, please reinput it");
				let tmpState = this.state;
				tmpState.finsihed = true;
				this.setState(tmpState);
			}
			else if (json.hasOwnProperty("error") && json.error !== "Credit card number is not valid") {
				alert("Something is wrong with the server, please try again later");
				let tmpState = this.state;
				tmpState.finished = true;
				this.setState(tmpState);
			}
			else {
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
					<Redirect to="/accountInfo/cards" />
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
								{this.state.editing ? "Edit your credit card" : "Add a new credit card"}
							</div>
							<form onSubmit={this.handleSubmit}>
								<div className={styles['textLabel']}>Card Number</div>
								<input className={styles['textbox']} type="text" name="cardNumber" value={this.state.card.cardNumber} onChange={this.handleInputChange} />
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
