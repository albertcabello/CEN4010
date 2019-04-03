import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../Header/header.js';



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
		else  {
            
			return (
                
            <div>
                <Header />
                <table border="1">
            <tr>
                <th>wishlistId</th>
                <th>Book ISBN</th>
            </tr>
            <tr>
                <td>123456789</td>
                <td>12345</td>
            </tr>
            </table>
            </div>
			);
		}
	}
}


