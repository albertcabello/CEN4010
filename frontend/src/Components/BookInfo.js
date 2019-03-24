import React from "react";

import Titles from "./Titles";
import Description from "./Description";
import Tabs from "./Tabs";
const API = '/book/';

class BookInfo extends React.Component {
  state = {
    isbn: this.props.match.params.isbn,
    // response: {title: 'defa',
    //             authorFirst: '',
    //             authorLast: '',
    //             cover: '',
    //             genre: '',
    //             publisher: '',
    //             avgRating: '',
    //             description: '',
    //             biography: ''},
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
	<Titles />
  {this.state.response.map(d => <Description  title = {(d.title)} description = {(d.description)}
  price = {(d.price)} cover = {(d.cover)} first = {(d.authorFirst)} last = {(d.authorLast)}/>)}
  <Tabs />
      </div>
    );
  }
};

export default BookInfo;
