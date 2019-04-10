import React from "react";
const API = "http://localhost:3001/review/";

class Reviews extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			star:0,
			first:"",
			last: "",
			comment: ""
			
		}
		
	}
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
			var star=0;
			var first="";
			var last="";
			var comment="";
			
			if(obj[0])
			{

				star=obj[0].star;
				first=obj[0].first;
				last=obj[0].last;
			  comment=obj[0].comment;
			}	
		
								
			this.setState({
						star: star,first: first,last: last,comment: comment
					})
		});
	}
  render() {
			
			const items=[];
				
			for(let j=0; j < 5 ; j++)
				items.push(<span className={"fas fa-star"+ (j < this.state.star ? " checked" : "")} ></span>); 
		
    return (
      <div class= "tabs">
				<h4>COMMUNITY REVIEWS</h4>
				<a className="p-5" href="#">&nbsp; {this.state.first} {this.state.last}'s review</a>
				<div className= "rating" >
					{items}
				</div>
				<p className="comment">{this.state.comment}</p>	
      </div>
    );
  }
};

export default Reviews;
