import React from "react";

class Menu extends React.Component {

  render() {
    return (
      <div>
	<div class="main-header right">
            <div id="sidr-navigation-container" class="clearfix">
            <nav id="nav-wrap" class="primary_menu_container">
	    <ul id="primary_menu" class="primary_menu nav">
		<li id="menu-item-1"><a href="#">Featured</a>
		<ul class="sub-menu">
			<li id="menu-item-1-2">Best Sellers</li>
			<li id="menu-item-1-3">New Arrivals</li>
			<li id="menu-item-1-3">Staff Picks</li>
		</ul>
		</li>
		<li id="menu-item-2"><a href="#">Classics</a>
		<ul class="sub-menu">
			<li id="menu-item-2-1">English classics</li>
			<li id="menu-item-2-2">American classics</li>
			<li id="menu-item-2-3">French classics</li>
			<li id="menu-item-2-4">Spanish classics</li>
			<li id="menu-item-2-5">German classics</li>
		</ul>
		</li>
		<li id="menu-item-3"><a href="http://themecanon.com/booker/blog/">Fiction</a>
		<ul class="sub-menu">
			<li id="menu-item-3-1"><a href="#">Dystopian</a></li>
			<li id="menu-item-3-2"><a href="#">Fantasy</a></li>
			<li id="menu-item-3-3"><a href="#">Science Fiction</a></li>
			<li id="menu-item-3-4"><a href="#">Horror</a></li>
			<li id="menu-item-3-5"><a href="#">Thriller</a></li>
			<li id="menu-item-3-6"><a href="#">Graphic Novel</a></li>
		</ul>		
		</li>
		<li id="menu-item-4"><a href="http://themecanon.com/booker/blog/">Young Adult</a>
		</li>
		<li id="menu-item-5"><a href="http://themecanon.com/booker/blog/">Biography & Memoir</a>
		</li>
		<li id="menu-item-6"><a href="http://themecanon.com/booker/blog/">Non-fiction</a>
		<ul class="sub-menu">
			<li id="menu-item-6-1"><a href="#">Computer Science</a></li>
			<li id="menu-item-6-2"><a href="#">Self Help</a></li>
			<li id="menu-item-6-3"><a href="#">True Crime</a></li>
		</ul>
		</li>
		<li id="menu-item-7"><a href="http://themecanon.com/booker/shop/">Store</a>
		<ul class="sub-menu">
			<li id="menu-item-7-1"><a href="http://themecanon.com/booker/cart/">Cart</a></li>
			<li id="menu-item-7-2"><a href="http://themecanon.com/booker/checkout/">Checkout</a></li>
			<li id="menu-item-7-3"><a href="http://themecanon.com/booker/my-account/">My Account</a></li>
		</ul>
		</li>
		<li class="menu-item menu-item-type-canon toolbar-search-btn"><a href="#"><i class="fa fa-search"></i></a></li><li 		class="wpmenucartli wpmenucart-display-standard menu-item" id="wpmenucartli"><a class="wpmenucart-contents empty-wpmenucart-visible" href="http://themecanon.com/booker/shop/" title="Start shopping"><i class="wpmenucart-icon-shopping-cart-0"></i><span class="cartcontents">0 items</span></a></li></ul></nav></div>

                                </div>
	</div>
    );
  }
};

export default Menu;
