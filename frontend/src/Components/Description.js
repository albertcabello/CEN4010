import React from "react";
import {BrowserRouter, Route, Link} from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001/review/";


class Description extends React.Component {

  constructor(props) {
        super();
        this.state = {
            display: 'none'
        };
		}
		
	set_flag=false;
	star=0;
	componentWillMount(){

		var opts={
			isbn: this.props.isbn,
			first:this.props.first, 
			last: this.props.last };
			
		var apiCall = fetch(API + "get",{method: 'post', credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify(opts)});

    apiCall.then(response => {
			
      return response.text();
      }).then(result => {
        
				const obj=JSON.parse(result);	
				if(obj[0])	
					this.star=obj[0].star;			 			
				this.setState({
          display: 'none'
				})
       });

		
	};
  handleImgClick(){
 		this.setState({
            display: 'block'
        });
	}
	starImgClick(e){ 

		var id_string="";
		id_string=e.target.id;

		var id_prefix=id_string.slice(0,4);

		var id_suffix="";
		id_suffix=id_string.slice(4,5);

		var starElement_f,starElement_p;

		var starElement=document.getElementById(id_string);

		var num=parseInt(id_suffix);;
	 
		if(num > 0)
		{
				var pre=num-1;
				starElement_p=document.getElementById(id_prefix+pre); 
		}  

		if(num < 4)
		{
				var nex=num+1;
				starElement_f=document.getElementById(id_prefix+nex);
		}  

		if(starElement.className === "fas fa-star checked")
		 {
				if(starElement_f)
				{
						if(starElement_f.className==="fas fa-star checked")
							return;

				}           
				 starElement.className="fas fa-star";
		 } 
		else
		{
				if(starElement_p)
				{
						if(starElement_p.className==="fas fa-star")
							return;

				}   
				starElement.className = "fas fa-star checked"
		}

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
	handleWishlistDelete(event) {
			var url = window.location.pathname;
			var file = url.substring(url.lastIndexOf('/')+1);
			alert(file);
			let body = {
				isbn: file
			};

			fetch('http://localhost:3001/userWishlist', {method: "Delete", credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}).then((response) => {	
				return response.json();
			})
	
	};
	reviewShow(){  
        
		this.set_flag=!this.set_flag;
		var commentText = document.getElementById("review");

		if(this.set_flag)
		{
				commentText.style.display = "block";   
				document.getElementById("addReview").innerHTML="Comment Set";
		}
		else
		{
				commentText.style.display = "none";   
				document.getElementById("addReview").innerHTML="Add Comment";

				var starCount=0;
				var Comments=document.getElementById("commentsId").value;
				for(let i=0; i < 5 ; i++)
				{
						var starElement=document.getElementById("star"+i);
						if(starElement.className==="fas fa-star checked")
								starCount++;
				}
				axios.post(API +"put", {
					isbn: this.props.isbn,
					first:this.props.first, 
					last: this.props.last ,
					starcount: starCount,
					comments : Comments
				});
				
		}
			
	}
  render() {
		const items = [];
		for(let i=0; i < 5 ; i++)
		{
				items.push(<span id={"star"+i} className={"fas fa-star"+ (i < this.star ? " checked" : "")}  onClick={(e) => this.starImgClick(e)}></span>);   
		}
    return (
      <div className= "description">
				<img className= "cover" alt="" onClick={() => this.handleImgClick()} src= {this.props.cover}/>
				<div id="myModal" className="modal" style={{display : this.state.display}}>
  				<span className="close" onClick={() => this.closeEnlargedImg()}>&times;</span>
  				<img className="modal-content" alt="" id="img01" src={this.props.cover}/>
				</div>
				<div className= "spec">
					<h2 className="book-name">{this.props.title} by &nbsp; 
						<Link to={{ pathname: '/author/' + this.props.first + '/' +  this.props.last }}>
								{this.props.first} {this.props.last}
						</Link>
						<div className= "underline"></div>
					</h2>
					<p  className="price-wrapper">${this.props.price}
						<div className= "rating">
							{items}
						</div>
					</p>
					<p>{this.props.description}</p>	
					<button type="submit" name="add-to-cart" value="892" className="add-to-cart-button">Add to cart</button>
					<button className="wishlist" onClick={this.handleWishlist}>
						<i className="fas fa-heart heart"></i>
						<span>Add to wishlist </span>
						<script> window.location.pathname;</script>
					</button>
					<button type="submit" name="delete-from-wishlist" value="892" className="add-to-cart-button" onClick={this.handleWishlistDelete}>Delete From Wishlist</button>
					<button id="addReview" type="button" name="add-to-review" value="892" className="add-to-review-button" onClick={() => this.reviewShow()}>Add  Comment</button>    
					<div id="review" style={{display:"none"}}>
							<textarea  id="commentsId" className="review comment" type="text" style={{ width: "695px",height:"30px", display:"block",position:"relative",top:"10px"}}  placeholder="insert your comments" />
					</div>
				</div>
      </div>
    );
  }
};

export default Description;
