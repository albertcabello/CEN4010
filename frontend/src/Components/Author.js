import React from "react";
import Titles from "./Titles";
import BookSmall from "./BookInfoSmall";
const API = '/author/';

class Author extends React.Component {
	state = {
		authorFirst: this.props.match.params.authorFirst,
		authorLast: this.props.match.params.authorLast,
		response: [],
		biography: ''
  };
  
  componentWillMount(){
    var apiCall = fetch(API + this.state.authorFirst + "/" + this.state.authorLast);

    apiCall.then(response => {
      return response.json();
      }).then(result => {
         this.setState({
          response: result
        })
       });
		};
	
  render() {
	var bookObjects = [];
	{this.state.response.map(d => 
		bookObjects.push(<BookSmall isbn = {(d.isbn)} title = {(d.title)} price = {(d.price)} cover = {(d.cover)}/>)
		)
	};

    return (
      <div>
	<Titles />
	<div class= "author-page-header">
	<h2 class="book-name">More books by {this.state.authorFirst} {this.state.authorLast}
	<div class= "underline"></div>
	</h2></div>
	<div class= "author-sidebar-wrapper">
	<div class= "content">{this.state.response.map(d => 
	<p key= {1}>{d.biography}</p>)}
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
