import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Author from "./Components/Author";
import BookInfo from "./Components/BookInfo";
import Header from "./Components/Header/header.js";
import Login from "./Components/Login/login.js";
import Home from "./Components/Home/home.js";

class App extends React.Component {
  render() {
    return (
      <div>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossOrigin="anonymous"/>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=PT+Serif+Caption" />
  	<BrowserRouter>
          <div>
	    <Route path="/home" component = {Home} />
	    <Route path="/login" component = {Login} />
	    <Route path="/book/:isbn" component = {BookInfo} />
            <Route path="/author/:authorFirst/:authorLast" component = {Author}/> 
          </div>
	</BrowserRouter>
      </div>
    );
  }
};

export default App;
