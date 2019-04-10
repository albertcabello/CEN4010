import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Header from '../Header/header.js';
import styles from './accountInfo.module.css';

export default class AccountInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: undefined,
		};
	}

	componentDidMount() {
		fetch('http://localhost:3001/isLoggedIn', {credentials: "include"}).then((res) => { return res.json();
		}).then((json) => {
			if (json.hasOwnProperty("user")) {
				let tmpState = this.state;
				tmpState.loggedIn = true;
				this.setState(tmpState);
			}
			else {
				let tmpState = this.state;
				tmpState.loggedIn = true;
				this.setState(tmpState);
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		if (this.state.loggedIn === undefined) { //This is just so the redirect doesn't immediately trigger and cause an unmount
			return (
				<div>
				</div>
			);
		}
		else if (!this.state.loggedIn) { //This will trigger in the componentDidMount setState or the else will
			alert("You are not logged in, you will be redirected to the login page");
			return (
				<div>
					<Redirect to="/login" />
				</div>
			);
		}
		else {
			return (
				<div>
					<Header />
					<div className={styles['cardContainer']}> 
						Your Account
						<div className={styles['cardRow']}>
							<div className={styles['cardCell']}>
								<Link to='/accountInfo/addresses'>
									<div className={styles['card']}>
										<div className={styles['cardInner']}>
											<div className={styles['row']}>
												<div className={styles['column']+' '+styles['span3']}>
													<i className={"fas fa-map-marker-alt fa-2x "+styles['mapIcon']}></i>
												</div>
												<div>
													<span>Address Information</span>
												</div>
												<div className={styles['cardText']}>
													<span>Edit addresses for orders</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</div>
							<div className={styles['cardCell']}>
								<Link to="/accountInfo/editProfile">
									<div className={styles['card']}>
										<div className={styles['cardInner']}>
											<div className={styles['row']}>
												<div className={styles['column']+' '+styles['span3']}>
													<i className={"far fa-user-circle fa-2x "+styles['userIcon']}></i>
												</div>
												<div>
													<span>Edit Profile</span>
												</div>
												<div className={styles['cardText']}>
													<span>Edit your user account information</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</div>
							<div className={styles['cardCell']}>
								<Link to="/accountInfo/cards">
									<div className={styles['card']}>
										<div className={styles['cardInner']}>
											<div className={styles['row']}>
												<div className={styles['column']+' '+styles['span3']}>
													<i className={"far fa-credit-card fa-2x "+styles['creditIcon']}></i>
												</div>
												<div>
													<span>Payment Information</span>
												</div>
												<div className={styles['cardText']}>
													<span>Edit credit card information</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}
