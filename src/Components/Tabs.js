import React from "react";

class Tabs extends React.Component {

  readMore() {
 	var moreText = document.getElementById("more");
  	var btnText = document.getElementById("myBtn");

    	moreText.style.display = "inline";
  }

  render() {
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
	<p>ISBN: 9788817150446</p>
	<p>Price: $9.00</p>
	<p>Publisher: Penguin Publisher</p>
	<p>Genre: <a href="#">Tragedy</a></p>
  	</section>

  	<section id="content2">
	<h3 class= "section-title">Author bio
	<div class= "underline"></div>
	</h3>
	<p>
     	William Shakespeare (1564–1616) was a poet, playwright, and actor who is widely regarded as one of the most influential 		writers in the history of the English language. Often referred to as the Bard of Avon, Shakespeare’s vast body of work includes comedic, tragic, and historical plays; poems; and 154 sonnets. His dramatic works have been translated into every major language and are performed more often than those of any other playwright.
    	</p>
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
	<button onclick="readMore()" id="more-comments">2 comments<i class="fas fa-angle-down expand"></i></button>
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
	<button onclick="readMore()" id="more-comments">0 comments<i class="fas fa-angle-down expand"></i></button>
	<span id="more">
		<a href="#">Nagham</a><p>Oh my god, same.</p><button onclick="reply()" class="reply">Reply</button>
		<a href="#">Jose</a><p>I agree because were ever you go you all ways going to here about the famous Shakespear and about romeo and Juliet. In Mostly every high school movie you will see that they are doing the play and then you read the actual book and its a fascinating experience of finally reading it after hearing about it.</p><button onclick="reply()" class="reply">Reply</button>
	</span>
	</div>
  	</section>
      </div>
    );
  }
};

export default Tabs;
