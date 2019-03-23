import React from "react";

class Description extends React.Component {

  render() {
    return (
      <div class= "description">
	<img class= "cover" src="https://images.penguinrandomhouse.com/cover/9780143128571"/>
	<div class= "spec">
	<h2 class="book-name">Romeo & Juliet by <a href= "/author">William Shakespeare</a>
	<div class= "underline"></div>
	</h2>
	<p  class="price-wrapper">$9.00
	<div class= "rating">
       	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star"></span>
	</div>
        </p>
	<p>Romeo and Juliet is about two young star-crossed lovers whose deaths ultimately reconcile their feuding families. It was among Shakespeare's most popular plays during his lifetime and along with Hamlet, is one of his most frequently performed plays. </p>	
        <button type="submit" name="add-to-cart" value="892" class="add-to-cart-button">Add to cart</button>
	<button class="wishlist">
  		<i class="fas fa-heart heart"></i>
  		<span>Add to wishlist</span>
	</button>
	</div>
      </div>
    );
  }
};

export default Description;
