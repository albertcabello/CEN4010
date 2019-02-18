import React from "react";

class Reviews extends React.Component {

  render() {
    return (
      <div class= "reviews">
	<h4>COMMUNITY REVIEWS</h4>
	<p>2 reviews</p>
        <div class= "user-review">
	<a href="#">Ariel</a> rated it 5
	<p>It is always so satisfying to read a book you've heard so much about throughout your life. You should have seen how excited I 		got when Juliet started saying "Romeo, o Romeo"!</p>
	<p>2 comments<i class="fas fa-angle-down"></i></p>
	</div>
        <div class= "user-review">
	<a href="#">Aishu Reh</a> rated it 3
	<p>Being one of the most famous plays through all time, Romeo and Juliet still captivates readers and audiences around the world. This is a fine example of the fact that time doesn't really have to change us. We can still understand and identify with great stories from a long time ago. Romeo and Juliet is a play that centers around forbiddem love between two young, rebellious people. But the play is much more than that.</p>
	<p>0 comments<i class="fas fa-angle-down"></i></p>
	</div>
      </div>
    );
  }
};

export default Reviews;
