import React from "react";
import Titles from "./Titles";
import BookSmall from "./BookInfoSmall";

class Author extends React.Component {
  render() {
  var bookObjects = [];
  const booksByAuthor = [{"isbn":"9788817150446", "title":"Romeo & Juliet", "price":"9.00", "cover": "https://images.penguinrandomhouse.com/cover/9780143128571"},
			 {"isbn":"9780143128540", "title":"Hamlet", "price":"10.00", "cover": "https://images.penguinrandomhouse.com/cover/9780143128540"},];
   
   for (var i=0; i<2; i++) {	
    bookObjects.push(<BookSmall isbn = {booksByAuthor[i].isbn} title = {booksByAuthor[i].title} price = {booksByAuthor[i].price} cover = {booksByAuthor[i].cover}/>);
   }

    return (
      <div>
	<Titles />
	<div class= "author-page-header">
	<h2 class="book-name">More books by {this.props.name}
	<div class= "underline"></div>
	</h2></div>
	<div class= "author-sidebar-wrapper">
	<div class= "content"><p>
     	<div class ="author-name">William Shakespeare (1564–1616)</div> was a poet, playwright, and 		actor who is widely regarded as one of the most influential 		writers in the history of the English language. Often 		referred to as the Bard of Avon, Shakespeare’s vast body of 		work includes comedic, tragic, and historical plays; poems; 		and 154 sonnets. His dramatic works have been translated into 		every major language and are performed more often than those 		of any other playwright.
    	</p>
	</div>
	<div class= "browse-wrapper">
	<button class="sort-btn">Sort by latest<i class="fas fa-angle-down expand"></i></button>
	<div class = "books">{bookObjects}</div>
	<a class = "pagination">1 out of 2</a>
	</div>
	</div>
	</div>

    );
  }
};

export default Author;
