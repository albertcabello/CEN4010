import React from "react";

import Titles from "./Titles";
import Description from "./Description";
import Tabs from "./Tabs";
const API = '/book/';

class BookInfo extends React.Component {
  state = {
    title: '',
    response: '',
    post: '',
    responseToPost: '',
  };
  componentWillMount= async () => {
    const response = await fetch(API + this.props.match.params.isbn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.json().then(function(data) {
      console.log("hiya")
    });
  };
  render() {
    return (
      <div>
	<Titles />
	<Description  title = {this.state.title} description = "hula" price = "9.00" cover = "https://images.penguinrandomhouse.com/cover/9780143128571" author = "William Shakespeare"/>
	<Tabs />
      </div>
    );
  }
};

export default BookInfo;
