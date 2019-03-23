import React from "react";

class BookInfoSmall extends React.Component {

  render() {
    return (
	<div class= "book-wrapper">
	<img class= "cover-small" src="https://images.penguinrandomhouse.com/cover/9780143128571"/>
	<a href = "/description">	
	<p class= "title">Romeo & Juliet</p>
	<p class= "price">$9.00</p></a>
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
