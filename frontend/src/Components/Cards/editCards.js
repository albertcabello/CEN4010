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
					        cardNumber: '',
						expireMonth: '1',
						expireYear: '2019'
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
						expireMonth: '1',
						expireYear: '2019'
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
			cardNumber: this.state.card.cardNumber,
			expireMonth: this.state.card.expireMonth,
			expireYear: this.state.card.expireYear
		}
		console.log(body);
		fetch('http://localhost:3001/card', {method: this.state.editing ? "PUT" : "POST" , credentials: "include", headers: {"Content-Type": "application/json"},  body: JSON.stringify(body)}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.hasOwnProperty("error") && json.error === "Credit card number is not valid") {
				alert("That is not a valid credit card number, please reinput it");
				let tmpState = this.state;
				tmpState.finsihed = true;
				this.setState(tmpState);
			}
			else if (json.hasOwnProperty("error") && json.error !== "Credit card number is not valid") {
				alert("Something is wrong with the server, please try again later " + json.error);
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
		let months =[];
		let years = [];
		for (let i = 1; i < 50; i++) {
			if (i <= 12) {
				months.push(i);
				years.push(i + 2018);
			}
			else {
				years.push(i + 2018);
			}
		}
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
								<div className={styles['textLabel']}>Expiration Month</div>
								<select name="expireMonth" value={this.state.card.expireMonth} onChange={this.handleInputChange}> {
									months.map((m) => <option value={m}>{m}</option>)
								}</select>
								<div className={styles['textLabel']}>Expiration Year</div>
								<select name="expireYear" value={this.state.card.expireYear} onChange={this.handleInputChange}> {
									years.map((y) => <option value={y}>{y}</option>)
								}</select>
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
