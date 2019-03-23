import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import BookInfo from "./BookInfo";
const API = '/book/';

class BookInfoSmall extends React.Component {
	    state = {
			isbn: this.props.isbn,
			response: '',
			post: '',
			responseToPost: '',
			};

  handleClick = async e => {
    e.preventDefault();
    const response = await fetch(API + this.state.isbn, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
	
  render() {
    return (
	<div>
	<div class= "book-wrapper">	
	<a  onClick={this.handleClick}>
	<Link to={{ pathname: '/book-description/' + this.state.isbn}}>
    	<img class= "cover-small" src= {this.props.cover}/>
	<p class= "title">{this.props.title}</p>
	</Link>
	</a>
	<p class= "price">${this.props.price}</p></div>
	<div class= "buttons">
	<button type="submit" name="add-to-cart" value="892" class="add-to-cart-button">Add to cart</button>
	<button class="wishlist">
  		<i class="fas fa-heart heart"></i>
	</button>	
	<p>{this.state.responseToPost}</p>
	</div>
	</div>
  );
  }
};

export default BookInfoSmall;
