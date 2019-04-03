import React from "react";

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
      	<input id="tab1" type="radio" name="tabs" checked/>
      	<label for="tab1">Description</label>

      	<input id="tab2" type="radio" name="tabs"/>
      	<label for="tab2">About author</label>

      	<input id="tab3" type="radio" name="tabs"/>
      	<label for="tab3">Reviews(2)</label>

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
	<h3 class= "section-title">Customer reviews
	<div class= "underline"></div>
	</h3>
        <div class= "user-review">
	<a href="#">Ariel</a>'s review
	<div class= "rating">
       	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	</div>
	<p>It is always so satisfying to read a book you've heard so much about throughout your life. You should have seen how excited I 		got when Juliet started saying "Romeo, o Romeo"!</p>
	<button onClick={() => this.readMore()} className= {comment_class}>2 comments<i class="fas fa-angle-down expand"></i></button>
	<span id="more">
		<a href="#">Nagham</a><p>Oh my god, same.</p><button onclick="reply()" class="reply">Reply</button>
		<p><a href="#">Jose</a><p>I agree because were ever you go you all ways going to here about the famous Shakespear and about romeo and Juliet. In Mostly every high school movie you will see that they are doing the play and then you read the actual book and its a fascinating experience of finally reading it after hearing about it.</p><button onclick="reply()" class="reply">Reply</button></p>
	</span>
	</div>
  <div class= "user-review">
	<a href="#">Aishu Reh</a>'s review
	<div class= "rating">
       	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star checked"></span>
	<span class="fas fa-star"></span>
	<span class="fas fa-star"></span>
	</div>
	<p>Being one of the most famous plays through all time, Romeo and Juliet still captivates readers and audiences around the world. This is a fine example of the fact that time doesn't really have to change us. We can still understand and identify with great stories from a long time ago. Romeo and Juliet is a play that centers around forbiddem love between two young, rebellious people. But the play is much more than that.</p>
	<button onclick={this.readMore} className={comment_class}>0 comments<i class="fas fa-angle-down expand"></i></button>
	</div>
  	</section>
      </div>
    );
  }
};

export default Tabs;
