import React from 'react';
import Header from '../Header/header.js';
import { Redirect } from 'react-router-dom';

import styles from './editAddresses.module.css';


export default class EditAddresses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loggedIn: undefined};
	}
	
	componentDidMount() {
		fetch('http://localhost:3001/isLoggedIn', {credentials: "include"}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.hasOwnProperty('error')) {
				this.setState({loggedIn: false});
			}
			else {
				this.setState({loggedIn: true});
			}
		});
	}

	render() {
		if (this.state.loggedIn) {
			return (
				<div>
					<Header />
					<div className={styles['center']}>
						<div className={styles['editForm']}>
							<div className={styles['labeling']} >
								{this.props.location.state.editing ? "Edit your address" : "Add a new address"}
							</div>
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
