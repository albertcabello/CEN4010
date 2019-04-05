import React from 'react';
import styles from '../wishlist/wishlist.css';

import Header from '../Header/header.js';
import { Redirect, Link } from 'react-router-dom';



export default class Addresses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loggedIn: undefined, addresses: [], defaultAddressId: -1};

		this.handleDelete = this.handleDelete.bind(this);
		this.handleDefault = this.handleDefault.bind(this);
	}
	
	componentDidMount() {
		fetch('http://localhost:3001/userwishlist', {credentials: "include"}).then((res) => {
			return res.json();
		}).then((json) => {
			let tmpState = this.state;
			if (json.hasOwnProperty("authError")) {
				console.log("Not logged in");
				tmpState.loggedIn = false;
				this.setState(tmpState);
			}
			else {
				tmpState.addresses = json;
				fetch('http://localhost:3001/isLoggedIn', {credentials: "include"}).then((res2) => {
					return res2.json();
				}).then((json2) => {
					console.log(json2);
					if (json2.hasOwnProperty("error")) {
						console.log("HERE");
						tmpState.loggedIn = false;
						this.setState(tmpState);
					}
					else {
						tmpState.defaultAddressId = json2.user.defaultShipping;
						tmpState.loggedIn = true;
						this.setState(tmpState);
					}
				});
				
			}
		});
				
	}

	handleDelete(event) {
		fetch('http://localhost:3001/address/?id=' + event.target.getAttribute('name'), {method: "DELETE", credentials: "include"}).then((res) => {
			return res.json();
		}).then((json) => {
			let tmpState = this.state;
			if (json.hasOwnProperty("authError")) {
				tmpState.loggedIn = false;
				this.setState(tmpState);
			}
			else if (json.hasOwnProperty("success")) {
				window.location.reload();
			}
			else {
				alert("Unsuccessful delete, please try again later");
			}
		});
	}

	handleDefault(event) {
		let def = event.target.getAttribute('name');
		fetch('http://localhost:3001/setDefaultAddress/'+def, {credentials: "include"}).then((res) => {
			return res.json();
		}).then((json) => {
			let tmpState = this.state;
			if (json.hasOwnProperty("authError")) {
				tmpState.loggedIn = false;
				this.setState(tmpState);
			}
			else if (json.hasOwnProperty("success")) {
				tmpState.defaultAddressId = parseInt(def);
				this.setState(tmpState);
			}
			else {
				alert("Unsuccessful update, please try again later");
			}
		});
	}
		

	render() {
		console.log(this.state);
		let groups = this.state.addresses.map( (e, i) => {
			return i % 3 === 0 ? this.state.addresses.slice(i, i+3) : null;
		}).filter((e) => { return e; });
		
		let me = this;
		if (groups.length === 0) {
			return (
				<div>
					<Header />
					<div className={styles['container']}>
						<div className={styles['spacingMedium']}>
						</div>
						<div className={styles['column']}>
				
						</div>
					</div>
				</div>
			);
		}
		let rows = groups.map((row, rowIndex) => {
			let entries = row.map((element, elementIndex) => {
				if (rowIndex === 0 && elementIndex === 0) {
					return (
						<div>
						<div className={styles['column']}>
						</div>
						<div className={styles['column']}>
							<div className={styles['address']}>
								{me.state.defaultAddressId === element.isbn ? <div className={styles['defaultSection']}><span>Default Shipping Address</span></div> : null }
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>{element.fullName}</span>
									<br/>Title: {element.title}<br/>ISBN: {element.isbn}<br/>
								</div>
								<div className={styles['editing']}> 
									<span> 
									<Link to={{pathname:'/book/'+element.isbn, state: {editing: true, user: element}}}> <span className={styles['link']}>Go To</span></Link> 
									|<span name={element.isbn} className={styles['link']} onClick={this.handleDelete}>Delete</span>|
									</span>
								</div>
							</div>
						</div>
						</div>
					);
				}
				else {
					return (
						<div className={styles['column']}>
							<div className={styles['address']}>
							{me.state.defaultAddressId === element.isbn ? <div className={styles['defaultSection']}><span>Default Shipping Address</span></div> : null }
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>{element.fullName}</span>
									<br/>Title: {element.title}<br/>ISBN: {element.isbn}<br/>
								</div>
								<div className={styles['editing']}> 
									<span> 
									<Link to={{pathname:'/book/'+element.isbn, state: {editing: true, user: element}}}> <span className={styles['link']}>Go To</span></Link> 
									|<span name={element.isbn} className={styles['link']} onClick={this.handleDelete}>Delete</span>|
									</span>
								</div>
							</div>
						</div>
					);
				}
			});
			return (
				<div className={styles['row']}>{entries}</div>
			);
		});
						
					
					

		if (this.state.loggedIn === undefined) {
			return (
				<div> Waiting </div>
			);
		}
		else if (this.state.loggedIn === false) {
			alert("You are not logged in, you will be redirected to the login screen");
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
					<div className={styles['container']}>
						<div className={styles['spacingMedium']}>
						</div>
						{rows}
					</div>
				</div>
			);
		}
	}
}
