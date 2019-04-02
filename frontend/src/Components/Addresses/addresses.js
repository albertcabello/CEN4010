import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../Header/header.js';

import styles from './addresses.module.css';

export default class Addresses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loggedIn: undefined, addresses: [], defaultAddressId: -1};
	}
	
	componentDidMount() {
		fetch('http://localhost:3001/address', {credentials: "include"}).then((res) => {
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

	render() {
		console.log(this.state.defaultAddressId);
		let groups = this.state.addresses.map( (e, i) => {
			return i % 3 === 0 ? this.state.addresses.slice(i, i+3) : null;
		}).filter((e) => { return e; });
		
		let me = this;
		let rows = groups.map((row, rowIndex) => {
			let entries = row.map((element, elementIndex) => {
				if (rowIndex === 0 && elementIndex === 0) {
					return (
						<div>
						<div className={styles['column']}>
							<div className={styles['firstAddress']}>
								<div style={{color: '#767676'}}>
									<i className="fas fa-plus"></i>
								</div>
								<div style={{fontSize: '17px', fontWeight: '700', color: '#767676'}}>
									Add Address
								</div>
							</div>
						</div>
						<div className={styles['column']}>
							<div className={styles['address']}>
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>Alberto Cabello</span>
									<br/>Address Line 1<br/>Address line 2<br/>City, State<br/>Zip<br/><br />Instr<br/> {element.addressId}
								</div>
								<div className={styles['editing']}> 
									<span> Edit | Delete </span>
								</div>
							</div>
						</div>
						</div>
					);
				}
				else if (element.addressId === me.state.defaultAddressId) {
					console.log(element.addressId);
					return (
						<div className={styles['column']}>
							<div className={styles['address']}>
								<div className={styles['defaultSection']}>
									<span>Default Shipping Address</span>
								</div>
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>Alberto Cabello</span>
									<br/>Address Line 1<br/>Address line 2<br/>City, State<br/>Zip<br/><br />Instr<br/> {element.addressId}
								</div>
								<div className={styles['editing']}> 
									<span> Edit | Delete </span>
								</div>
							</div>
						</div>
					);
				}
				else {
					return (
						<div className={styles['column']}>
							<div className={styles['address']}>
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>Alberto Cabello</span>
									<br/>Address Line 1<br/>Address line 2<br/>City, State<br/>Zip<br/><br />Instr<br/> {element.addressId}
								</div>
								<div className={styles['editing']}> 
									<span> Edit | Delete </span>
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
							Your Addresses
						</div>
						{rows}
					</div>
				</div>
			);
		}
		/*
		return (
			<div>
				<Header />
				<div className={styles['container']}>
					<div className={styles['spacingMedium']}>
						Your Addresses
					</div>
					<div className={styles['row']}>
						<div className={styles['column']}>
							<div className={styles['firstAddress']}>
								<div style={{color: '#767676'}}>
									<i className="fas fa-plus"></i>
								</div>
								<div style={{fontSize: '17px', fontWeight: '700', color: '#767676'}}>
									Add Address
								</div>
							</div>
						</div>
						<div className={styles['column']}> 
							<div className={styles['address']}>
								<div className={styles['defaultSection']}> 
									<span>Default Shipping Address</span>
								</div>
								<div className={styles['addressInformation']}>
									<span style={{fontSize: '17px' ,fontWeight: 'bold' }}>Alberto Cabello</span>
									<br/>Address Line 1<br/>Address line 2<br/>City, State<br/>Zip<br/><br />Instr<br/> code
								</div>
								<div className={styles['editing']}> 
									<span> Edit | Delete </span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
		*/
	}
}
