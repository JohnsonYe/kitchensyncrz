/**
 * Title: homePage.js
 * Author: Hyeunjun Sang
 * Date Created: 11/20/2017
 * Description: This file will serve as the Homepage and splash screen Content
 */
import React, {Component} from 'react';
import {Grid, Row, Col,Carousel, Jumbotron, Image, Popover, OverlayTrigger, ButtonToolbar, Button} from 'react-bootstrap'
import 'react-bootstrap/dist/react-bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.css';
import browseIcon from '../../Image/SplashScreen/Browse-3.jpeg';
import burgerImage from '../../Image/SplashScreen/burger.jpeg';
import kitchenImage from '../../Image/SplashScreen/kitchen.jpg';
import chickenImage from '../../Image/SplashScreen/chicken.jpg';
import steakImage from '../../Image/SplashScreen/steak.jpg';
import breadImage from '../../Image/SplashScreen/bread.jpg';
import appleImage from '../../Image/SplashScreen/apple.jpg';
import limeImage from '../../Image/SplashScreen/lime.jpg';
import lemonImage from '../../Image/SplashScreen/lemon.jpg';
import peachImage from '../../Image/SplashScreen/peach.jpg';
import tacoImage from '../../Image/SplashScreen/taco.jpg';
import cookbookIcon from '../../Image/SplashScreen/cookbookFinal.jpg.jpeg';
import kitchenIcon from '../../Image/SplashScreen/kitchen2.jpg';
import calendarIcon from '../../Image/SplashScreen/calendarFinal.jpg';
import plannerIcon from '../../Image/SplashScreen/black.png';

const popoverBottom = (
    <Popover id="popover-positioned-bottom" title="About Browse">
        <strong>Browse</strong> Browse allows you be able to use filter by required
        ingredients and cookware and/or appliances necessary for particular recipes,
        as well as time needed, difficulty level and cost to make.
    </Popover>

);
const popoverBottom1 = (
    <Popover id="popover-positioned-bottom1" title="About Cookbook">
        <strong>Cookbook</strong> Cookbook You can resume and edit your recipes whenever you want
        in <strong>My cookbook page</strong>.

    </Popover>

);
const popoverBottom2 = (
    <Popover id="popover-positioned-bottom2" title="About Kitchen">
        <strong>Kitchen</strong> Kitchen You will able to add items to an exclusion list, according to
        your dietary preferences in <strong>My Kitchen page</strong>. My Kitchen will also be a list of your
        own cookware/tools/appliances that you do have access to. Personalizing Kitchen will allow Kitchen Sync
        to customize each user’s experience according to their situation.
    </Popover>

);

const popoverBottom3 = (
    <Popover id="popover-positioned-bottom3" title="About Planner">
        <strong>Planner</strong> Planner You will able to...."NEED TO ADD Sth HERE"..."EDITING"..
    </Popover>

);

class Homepage extends Component {

    render() {
        return (

            <div>
                <Jumbotron>
                    <div>
                        <h1>Kitchen Sync</h1>
                        {/*<p className="banner-style"><Image src={bannerImage} responsive /></p>*/}
                    </div>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col sm={5} >
                            <h1 className="about-style">About Kitchen Sync</h1>
                            <p className="intro-style">
                                Kitchen Sync is the Web application that aims to be a personalized assistant to help people, who are
                                traditionally not inclined to cook for themselves or people with little to no experience,
                                approach this healthy and cost effective practice without any of the usual stress or
                                problems associated with cooking. And how does it manage to do this? Because, Kitchen
                                Sync is the cooking app that adapts to the user instead of forcing the user to adapt to it.</p>
                            <p><a className="btn btn-lg btn-primary" href="/Search" role="button">Sign up today</a>
                            </p>
                        </Col>
                        <Col sm={7}>
                            <Carousel>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={burgerImage}/>
                                    <Carousel.Caption>
                                        <h3>First Pic</h3>
                                        <p>FoodPorn1</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={steakImage}/>
                                    <Carousel.Caption>
                                        <h3>Second Pic</h3>
                                        <p>FoodPorn2</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={chickenImage}/>
                                    <Carousel.Caption>
                                        <h3>Third Pic</h3>
                                        <p>FoodPorn3</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row>
                        <Col sm={3}>
                            <Image src={browseIcon} circle responsive />
                            <h2 className="feature-style">Browse</h2>
                            <p> Browse will enable the user to browse through our extensive database of recipes
                                to find something that they wish to attempt. Users will also have an option to
                                use Kitchen Sync ’s powerful filtering tool to find recipes that specifically
                                suit their current situation. </p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                                    <button className="btn btn-lg btn-primary"><strong>Detail >></strong></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={cookbookIcon} circle responsive />
                            <h2 className="feature-style">Cookbook</h2>
                            <p> Cookbook is where you can save your favorite recipes for easy access. It will
                                also serve as the home for any recipes the user themselves uploaded to Kitchen Sync’s
                                ever increasing database of wonderful, easy to cook, recipes.</p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom1}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={kitchenIcon} circle responsive />
                            <h2 className="feature-style">Kitchen</h2>
                            <p> Kitchen is where users can personalize the app and set their preferences. They
                                can add and remove items in their Pantry, which will tell <strong>Kitchen Sync </strong>
                                what ingredients you currently have. </p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom2}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={calendarIcon} circle responsive />
                            <h2 className="feature-style">Planner</h2>
                            <p> Meal Planner will help users to plan ahead and be ready for meals they plan to
                                cook beforehand. Users will be able to plan a recipe for a certain date, and Kitchen
                                Sync will remind the user to prepare for their cooking expedition. </p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom3}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>
                    </Row>

                    <hr class="featurette-divider"/>
                    <Row className="featurette">
                        <Col sm={7}>
                            <h2 className="featurette-heading">Check out our amazing features. <span
                                class="text-muted">Kitchen Sync will blow your mind.</span>
                            </h2>
                            <p className="lead"> Browse any recipes from our broad recipe database, make your own meal
                            with your own tools and ingredients! Don't waste your time to find other cooking app, we have
                            everything you need! </p>
                        </Col>
                        <Col sm={5}>
                            <Image className="featurette-image img-fluid mx-auto" src={lemonImage} responsive />
                        </Col>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row className="featurette">
                        <div className="col-md-7 order-md-2">
                            <h2 className="featurette-heading">Oh yeah, it's time to make your meal. <span
                                className="text-muted">See for yourself.</span>
                            </h2>
                            <p className="lead">Worry about the cost for cooking? Don't worry! Add your own pantries
                                and ingredients to your My kitchen page and use our amazing filter by cost! Our database
                                will show you recipes depend on your Kitchen and cost filter!
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1">
                            <Image className="featurette-image img-fluid mx-auto" src={appleImage} responsive />
                        </div>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row className="featurette">
                        <div className="col-md-7">
                            <h2 className="featurette-heading">And lastly, this one. <span
                                className="text-muted">Checkmate.</span></h2>
                            <p className="lead">Are you so busy to cook? Don't worry! Use our amazing browse filters!
                                Filter by time shows you best suitable recipes for you in a second! Best recipe
                                application for student!</p>
                        </div>
                        <div className="col-md-5">
                            <Image className="featurette-image img-fluid mx-auto" src={limeImage} responsive />
                        </div>
                    </Row>

                </Grid>
            </div>
        );
    }

}

export default Homepage;
