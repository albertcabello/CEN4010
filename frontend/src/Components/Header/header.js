import React from "react";

import { Link } from 'react-router-dom';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loggedIn: false};
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:3001/isLoggedIn', {credentials: "include"}).then((res) => { return res.json();
    }).then((json) => {
      if (json.hasOwnProperty("user")) {
        let tmpState = this.state;
        tmpState.loggedIn = true;
	      this.setState(tmpState);
      }
    });
  }

  handleLogout(event) {
    fetch('http://localhost:3001/logout', {credentials: "include"}).then((res) => {
      return res.json();
    }).then((json) => {
      let tmpState = this.state;
      tmpState.loggedIn = false;
      this.setState(tmpState);
      alert("Successfully logged out");
    });
  }

  render() {
    return (
      <div className= "header">
        <a href = "/"><img className= "logo" src="https://i.ibb.co/MSFL07F/logo-2x.png"/></a>
			  <div className="main-header right">
          <nav id="nav-wrap" className="primary_menu_container">
	    		  <ul id="primary_menu" className="primary_menu nav">
						  <li className= "search-item">
						    <div className= "search-container">
							    <input type="search" placeholder=" What are you looking for?" />
						    </div>
					    </li>
					    <li className= "menu-item">
					      <a href= "#"><i className="fa fa-search"></i></a>
					    </li>
					    <li className= "menu-item"><Link to={this.state.loggedIn ? "/accountInfo" : "/login"}>My Account<i className="fas fa-angle-down expand"></i></Link>
					      <ul className="dropdown">
						      <li className="dropdown-item"><a href="">Cart</a></li>
						      <li className="dropdown-item">
						        <Link to={this.state.loggedIn ? "/Wishlist" : "/login"}>Wishlist</Link>
						      </li>		  
						      <li className="dropdown-item"><a href="">Checkout</a></li>
						      <li className="dropdown-item"><a href="#" onClick={this.handleLogout}>Logout</a></li>
					      </ul>
					    </li>
					    <li className = "menu-item"><a href="#"><i className="fas fa-shopping-cart"></i>0 items</a></li>
					    <li className="menu-item"></li>
		        </ul>
	          </nav>
        </div>
      </div>
    );
  }
};

export default Header;
