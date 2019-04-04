import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import { link } from "fs";



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
	//handleWishlist(event) {
	//	let body = {
	//	};
	//}
  closeEnlargedImg(){
 	this.setState({
	    display: 'none'
        });
	}
	handleWishlist(event) {
		var url = window.location.pathname;
		var file = url.substring(url.lastIndexOf('/')+1);
		alert(file);
		let body = {
			isbn: file
		};
		


		fetch('http://localhost:3001/userWishlist', {method: "POST", credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {	
		return response.json();
		})

		};
	

  render() {
    return (
      <div class= "description">
	<img class= "cover" onClick={() => this.handleImgClick()} src= {this.props.cover}/>
	<div id="myModal" class="modal" style={{display : this.state.display}}>
  		<span class="close" onClick={() => this.closeEnlargedImg()}>&times;</span>
  		<img class="modal-content" id="img01" src={this.props.cover}/>
	</div>
	<div class= "spec">
	<h2 class="book-name">{this.props.title} by <Link to={{ pathname: '/author/' + this.props.first + '/' +  this.props.last }}>
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
	<button class="wishlist" onClick={this.handleWishlist}>
  		<i class="fas fa-heart heart"></i>
  		<span>Add to wishlist </span>
			<script>
			window.location.pathname;
						</script>

	</button>
	</div>
      </div>
    );
  }
};

export default Description;
