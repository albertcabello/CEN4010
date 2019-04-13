import React from 'react';
import {BrowserRouter, Route, Link} from "react-router-dom";
import Header from "../Header/header.js";
import styles from './home.module.css';
import Slider from "react-slick";
const API = 'http://localhost:3001/genre/';

export default class Home extends React.Component {
	state = {
		responseYA: [],
		responseClassics: [],
		responseNonFic: []
  };
  
  componentWillMount(){
	var apiYoungAdult = fetch(API + "Young Adult");
	var apiClassics = fetch(API + "Classic");

    apiYoungAdult.then(responseYA => {
      return responseYA.json();
      }).then(result => {
         this.setState({
			responseYA: result
        })
	   });

	apiClassics.then(responseClassics => {
      return responseClassics.json();
      }).then(result => {
         this.setState({
			responseClassics: result
        })
	   });
	};

	render() {
		var settings = {
			dots: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2600,
			};
			
		  var youngAdultBooks = [];
		  var classics = [];

		  {this.state.responseYA.map(d => 
			youngAdultBooks.push(<Link to={{ pathname: '/book/' + (d.isbn)}}>
			<img className= {styles['carousel-item']} src = {(d.cover)} /></Link>)
			  )
		  };

		  {this.state.responseClassics.map(d => 
			classics.push(<Link to={{ pathname: '/book/' + (d.isbn)}}>
			<img className= {styles['carousel-item']} src = {(d.cover)} /></Link>)
			  )
		  };

		return (
			<div>
				<link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" /> 
				
				<Header /> 
				
				<div className={styles['center']}>
					<img className= {styles['banner']} src= "http://oi64.tinypic.com/a4cg2.jpg"/>
				</div>
				<div className={styles['center']}>
					<div className= {styles['carousel']}>
						<div className= {styles['book-name']}>Classic Books</div>
						<div className= {styles['underline']}></div>
						<Slider {...settings}>
							{classics.map(e => <div>{e}</div>)}
						</Slider>
					</div>
					<div className= {styles['carousel']} styles={{float: 'right'}}>
						<div className= {styles['book-name']}>Young Adult Books</div>
						<div className= {styles['underline']}></div>
						<Slider {...settings}>
							  {youngAdultBooks.map(e => <div>{e}</div>)}
						</Slider>
					</div>
				</div>
			</div>);
	}
}
