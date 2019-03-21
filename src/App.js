import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Author from "./Components/Author";
import BookInfo from "./Components/BookInfo";

class App extends React.Component {
  render() {
    return (
      <div>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous"/>
<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=PT+Serif+Caption" />

  	<BrowserRouter>
        <div>
 	          <Route path="/book-description/:isbn" component = {BookInfo} />
            <Route path="/author" render={(props) => <Author {...props} name = "William Shakespeare" />} /> 
        </div>
	  </BrowserRouter>

      </div>
    );
  }
};

export default App;
