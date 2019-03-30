import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import BookInfo from "./BookInfo";
const API = 'http://localhost:3001/book/';

class BookInfoSmall extends React.Component {
	    state = {
			isbn: this.props.isbn,
			response: '',
			post: '',
			responseToPost: '',
			};
	
  render() {
    return (
	<div>
	<div class= "book-wrapper">	
	<Link to={{ pathname: '/book/' + this.state.isbn}}>
    	<img class= "cover-small" src= {this.props.cover}/>
	<p class= "title">{this.props.title}</p>
	</Link>
	<p class= "price">${this.props.price}</p></div>
	<div class= "buttons">
	<button type="submit" name="add-to-cart" value="892" class="add-to-cart-button">Add to cart</button>
	<button class="wishlist">
  		<i class="fas fa-heart heart"></i>
	</button>	
	</div>
	</div>
  );
  }
};

export default BookInfoSmall;
