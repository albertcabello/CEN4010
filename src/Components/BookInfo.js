import React from "react";

import Titles from "./Titles";
import Description from "./Description";
import Tabs from "./Tabs";

class BookInfo extends React.Component {

  render() {
    return (
      <div>
	<Titles />
	<Description />
	<Tabs />
      </div>
    );
  }
};

export default BookInfo;
