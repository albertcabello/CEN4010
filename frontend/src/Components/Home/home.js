import React from 'react';
import Header from "../Header/header.js";
import styles from './home.module.css';
import Slider from "react-slick";


export default class Home extends React.Component {
	render() {
		var settings = {
			dots: true,
			infinite: true,
			centerMode: true,
			centerPadding: '170px',
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		  };
		return (
			<div>
				<link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" /> 
				<Header /> 
				
				<div className= {styles['home-sidebar-wrapper']}>
				<div className= {styles['home-sidebar-content']}>
      	<div className= {styles['carousel']}>
		<div className= {styles['book-name']}>Young Adult Books</div>
		<div className= {styles['underline']}></div>
		  	<Slider {...settings}>
        <div>
          <img className= {styles['carousel-item']} src = "https://images.gr-assets.com/books/1394798630l/99561.jpg" />
        </div>
        <div>
          <img className= {styles['carousel-item']} src = "https://images-na.ssl-images-amazon.com/images/I/81a4kCNuH%2BL.jpg" />
        </div>
        <div>
          <img className= {styles['carousel-item']} src = "https://images.gr-assets.com/books/1474154022l/3.jpg" />
        </div>
		<div>
          <img className= {styles['carousel-item']} src = "https://images.gr-assets.com/books/1474169725l/15881.jpg" />
        </div>
      </Slider>
	  </div>
				</div>
				</div>
			</div>);
	}
}
