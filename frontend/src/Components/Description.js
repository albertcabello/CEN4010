import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";

class Description extends React.Component {

 constructor(props) {
        super();
        this.state = {
            display: 'none'
        };
    }

  handleImgClick(){
 	this.setState({
            display: 'block'
        });
  }

  closeEnlargedImg(){
 	this.setState({
	    display: 'none'
        });
  }

  render() {
    return (
      <div class= "description">
	<img class= "cover" onClick={() => this.handleImgClick()} src= {this.props.cover}/>
	<div id="myModal" class="modal" style={{display : this.state.display}}>
  		<span class="close" onClick={() => this.closeEnlargedImg()}>&times;</span>
  		<img class="modal-content" id="img01" src={this.props.cover}/>
	</div>
	<div class= "spec">
	<h2 class="book-name">{this.props.title} by 
	<Link to={{ pathname: '/author/' + this.props.first + '/' +  this.props.last }}>
		{this.props.first} {this.props.last}
	</Link>
	<div class= "underline"></div>
	</h2>
	<p  class="price-wrapper">${this.props.price}
	<div class= "rating">
       	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star"></span>
	</div>
        </p>
	<p>{this.props.description}</p>	
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
