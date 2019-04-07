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
      <div class= "header">
        <a href = "/"><img class= "logo" src="https://i.ibb.co/MSFL07F/logo-2x.png"/></a>
			<div class="main-header right">
          <nav id="nav-wrap" class="primary_menu_container">
	    		<ul id="primary_menu" class="primary_menu nav">
						<li class= "search-item">
						<div class= "search-container">
							<input type="search" placeholder=" What are you looking for?" />
						</div>
					</li>
					<li class= "menu-item">
					<a href= "#"><i class="fa fa-search"></i></a>
					</li>
					<li class= "menu-item"><Link to={this.state.loggedIn ? "/accountInfo" : "/login"}>My Account<i class="fas fa-angle-down expand"></i></Link>
					<ul class="dropdown">
						<li class="dropdown-item"><a href="">Cart</a></li>
						<li class="dropdown-item">
						<Link to={this.state.loggedIn ? "/Wishlist" : "/login"}>Wishlist</Link>
						</li>		  
						<li class="dropdown-item"><a href="">Checkout</a></li>
						<li class="dropdown-item"><a href="#" onClick={this.handleLogout}>Logout</a></li>
					</ul>
					</li>
		

					<li class = "menu-item"><a href="#"><i class="fas fa-shopping-cart"></i>0 items</a></li>
					<li class="menu-item">
		</li>
		</ul>
	</nav>

         </div>
      </div>
    );
  }
};

export default Header;
