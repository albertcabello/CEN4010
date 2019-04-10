import React from "react";
import Reviews from "./Reviews";

class Tabs extends React.Component {
	constructor(props) {
		super();
		this.state = {
				expanded: false
		};
		this.readMore = this.readMore.bind(this);
	}

	readMore() {
		this.setState(state => ({
			expanded: !state.expanded
		}));
	}
  render() {
		let comment_class = this.state.expanded ? "commentClicked" : "commentInactive";
    return (
      	<div class= "tabs">
      		<input id="tab1" type="radio" name="tabs" />
      		<label for="tab1">Description</label>

      		<input id="tab2" type="radio" name="tabs"/>
      		<label for="tab2">About author</label>

      		<input id="tab3" type="radio" name="tabs"/>
      		<label for="tab3">Reviews</label>

  				<section id="content1">
    				<h3 class= "section-title">Product Description
 							<div class= "underline"></div>
						</h3>
						<p>ISBN: {this.props.isbn}</p>
						<p>Price: ${this.props.price}</p>
						<p>Publisher: {this.props.publisher}</p>
						<p>Genre: <a href="#">{this.props.genre}</a></p>
  				</section>

  				<section id="content2">
						<h3 class= "section-title">Author bio
							<div class= "underline"></div>
						</h3>
						<p>{this.props.biography}</p>
  				</section>
					<section id="content3">
						<Reviews isbn = {this.props.isbn} first = {this.props.first} last = {this.props.last}/>
					</section>
      	</div>
    );
  }
};

export default Tabs;
