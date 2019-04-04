import React from 'react';
import Header from '../Header/header.js';
import { Redirect } from 'react-router-dom';

import styles from './editAddresses.module.css';


export default class EditAddresses extends React.Component {
	constructor(props) {
		super(props);
		const s = this.props.location.state;
		if (s !== undefined) {
			if (s.editing) {
				this.state = {loggedIn: undefined, finished: false, user: s.user};
			}
			else {
				this.state = {loggedIn: undefined,
					      finished: false,
					      user: {
					      	fullName: '',
						firstLine: '',
						secondLine: '',
						city: '',
						state: '',
						zip: '',
						instr: '',
						code: '',
					     }
					    };
			}
		}
		else {
			if (s.editing) {
				this.state = {loggedIn: undefined, finished: true};
			}
			else {
				this.state = {loggedIn: undefined,
					      finished: false,
					      user: {
					      	fullName: '',
						firstLine: '',
						secondLine: '',
						city: '',
						state: '',
						zip: '',
						instr: '',
						code: '',
					     }
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
		tmpState.user[event.target.name] = event.target.value;
		this.setState(tmpState);
	}

	handleSubmit(event) {
		let body = {
			fullName: this.state.user.fullName,
			firstLine:  this.state.user.firstLine,
			secondLine: this.state.user.secondLine,
			city: this.state.user.city,
			state: this.state.user.state,
			zip: this.state.user.zip,
			instr: this.state.user.instr,
			code: this.state.user.code,
			addressId: this.state.user.addressId
		}
		fetch('http://localhost:3001/address', {method: this.state.editing ? "PUT" : "POST" , credentials: "include", headers: {"Content-Type": "application/json"},  body: JSON.stringify(body)}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.hasOwnProperty("error")) {
				alert("There was an error on the server, please try again later");
				let tmpState = this.state;
				tmpState.finsihed = true;
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
		let states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
		if (this.state.finished) {
			return (
				<div>
					<Redirect to="/accountInfo/addresses" />
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
								{this.state.editing ? "Edit your address" : "Add a new address"}
							</div>
							<form onSubmit={this.handleSubmit}>
								<div className={styles['textLabel']}>Full Name</div>
								<input className={styles['textbox']} type="text" name="fullName" value={this.state.user.fullName} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Street Address</div>
								<input className={styles['textbox']} type="text" name="firstLine" value={this.state.user.firstLine} onChange={this.handleInputChange} />
								<input className={styles['textbox']} type="text" name="secondLine" value={this.state.user.secondLine} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>City</div>
								<input className={styles['textbox']} type="text" name="city" value={this.state.user.city} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>State</div>
								<select name="state" value={this.state.user.state} onChange={this.handleInputChange}>{
									states.map((state) => <option value={state}>{state}</option>)
								}</select>
								<div className={styles['textLabel']}>Zip Code</div>
								<input className={styles['textbox']} type="text" name="zip" value={this.state.user.zip} onChange={this.handleInputChange} />
								<br/>
								<div style={{fontSize: '17px'}} className={styles['labeling']}>Add extra delivery instructions</div>
								<div className={styles['textLabel']}>Do we need any extra instructions to find this address?</div>
								<textarea style={{height: '100px'}} className={styles['textbox']} name="instr" placeholder="Provide any details such as nearby locations, navigation instructions, etc." 
								maxlength="100" value={this.state.user.instr} onChange={this.handleInputChange} />
								<div className={styles['textLabel']}>Do we need a code or number to get to this address?</div>
								<input className={styles['textbox']} type="number" name="code" value={this.state.user.code} onChange={this.handleInputChange} />
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
