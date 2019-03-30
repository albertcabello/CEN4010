import React from "react";

import Header from "./Header/header.js";
import Description from "./Description";
import Tabs from "./Tabs";
const API = 'http://localhost:3001/book/';

class BookInfo extends React.Component {
  state = {
    isbn: this.props.match.params.isbn,
    response: [],
    responseToPost: '',
  };
  
  componentWillMount(){
    var apiCall = fetch(API + this.state.isbn);

    apiCall.then(response => {
      return response.json();
      }).then(result => {
         this.setState({
          response: result
        })
       });
    };

  render() {
    return (
      <div>
	<Header />
  {this.state.response.map(d => <Description  title = {(d.title)} description = {(d.description)}
  price = {(d.price)} cover = {(d.cover)} first = {(d.authorFirst)} last = {(d.authorLast)} biography = {(d.biography)}/>)}
  {this.state.response.map(d => <Tabs  isbn = {this.state.isbn} biography = {(d.biography)}
  price = {(d.price)} publisher = {(d.publisher)} genre = {(d.genre)}/>)}
      </div>
    );
  }
};

export default BookInfo;
