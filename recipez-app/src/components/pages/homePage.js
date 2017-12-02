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

const popoverBottom = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
        <strong>Holy guacamole!</strong> Check this info.
    </Popover>
);

class Homepage extends Component {

    render() {
        return (

            <div>
                <Jumbotron>
                    <div>
                        <h1>Kitchen Sync</h1>
                    </div>
                </Jumbotron>
                <Grid>
                    <Row>
                        <Col sm={5} >
                            <h1>About Kitchen Sync</h1>
                            <p className="intro-style">
                                Kitchen Sync is the Web application that aims to be a personalized assistant to help people, who are
                                traditionally not inclined to cook for themselves or people with little to no experience,
                                approach this healthy and cost effective practice without any of the usual stress or
                                problems associated with cooking. And how does it manage to do this? Because, Kitchen
                                Sync is the cooking app that adapts to the user instead of forcing the user to adapt to it.</p>
                            <p><a className="btn btn-lg btn-primary" href="#" role="button">Sign up today</a>
                            </p>
                        </Col>
                        <Col sm={7}>
                            <Carousel>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={burgerImage}/>
                                    <Carousel.Caption>
                                        <h3>First Pic</h3>
                                        <p>FoodPorn1.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={burgerImage}/>
                                    <Carousel.Caption>
                                        <h3>Second Pic</h3>
                                        <p>FoodPorn2.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img className="carousel-image" width={500} height={400} alt="900x500"
                                         src={burgerImage}/>
                                    <Carousel.Caption>
                                        <h3>Third Pic</h3>
                                        <p>FoodPorn3.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row>
                        <Col sm={3}>
                            <Image src={browseIcon} circle responsive />
                            <h2>Browse</h2>
                            <p> Browse will enable the user to browse through our extensive database of recipes
                                to find something that they wish to attempt. Users will also have an option to
                                use Kitchen Sync ’s powerful filtering tool to find recipes that specifically
                                suit their current situation. They will be able to filter by required
                                ingredients and cookware and/or appliances necessary for particular recipes,
                                as well as time needed, difficulty level and cost to make.</p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={browseIcon} circle responsive />
                            <h2>Cookbook</h2>
                            <p> Cookbook is where users can save their favorite recipes for easy access. It will
                                also serve
                                as the home for any recipes the user themselves uploaded to Kitchen Sync’ s
                                ever increasing database of wonderful, easy to cook, recipes..</p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={browseIcon} circle responsive />
                            <h2>Kitchen</h2>
                            <p> Kitchen is where users can personalize the app and set their preferences. They
                                can add and remove items in their Pantry , which will tell Kitchen Sync what
                                ingredients they currently have. Users will also be able to add items to an
                                exclusion
                                list, according to their dietary preferences. There will also be a list of
                                cookware/tools/appliances that they do have access to. Personalizing Kitchen will
                                allow Kitchen Sync to customize each user’s experience according to their
                                situation.</p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                                    <button className="btn btn-lg btn-primary">Detail >></button>
                                </OverlayTrigger>
                            </ButtonToolbar>

                        </Col>

                        <Col sm={3}>
                            <Image src={browseIcon} circle responsive />
                            <h2>Planner</h2>
                            <p> Meal Planner will help users to plan ahead and be ready for meals they plan to
                                cook beforehand. Users will be able to plan a recipe for a certain date, and Kitchen
                                Sync
                                will remind the user to prepare for their cooking expedition. Using information from</p>

                            <ButtonToolbar>
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
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
                            <p className="lead"> Browse recipes from our broad database, Add your own pantries and
                                ingredients to your Kitchen, Planner reminds you Browse recipes from our broad database, Add your own pantries and
                                ingredients to your Kitchen, Planner reminds you. Browse recipes from our broad database, Add your own pantries and
                                ingredients to your Kitchen, Planner reminds you. Browse recipes from our broad database, Add your own pantries and
                                ingredients to your Kitchen, Planner reminds you..</p>
                        </Col>
                        <Col sm={5}>
                            <Image className="featurette-image img-fluid mx-auto" src={kitchenImage} responsive />
                        </Col>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row className="featurette">
                        <div className="col-md-7 order-md-2">
                            <h2 className="featurette-heading">Oh yeah, it's that good. <span
                                className="text-muted">See for yourself.</span>
                            </h2>
                            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id
                                ligula
                                porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur.
                                Fusce dapibus, tellus ac cursus commodo.</p>
                        </div>
                        <div className="col-md-5 order-md-1">
                            <img class="featurette-image img-fluid mx-auto"
                                 src="https://www.thelocal.it/userdata/images/article/69523836b0191608c41d640feead8da2be5462038d3409e1e3900fad039c7fc8.jpg"
                                 alt="Generic placeholder image"/>
                        </div>
                    </Row>
                    <hr class="featurette-divider"/>
                    <Row className="featurette">
                        <div className="col-md-7">
                            <h2 className="featurette-heading">And lastly, this one. <span
                                className="text-muted">Checkmate.</span></h2>
                            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id
                                ligula
                                porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur.
                                Fusce dapibus, tellus ac cursus commodo.</p>
                        </div>
                        <div className="col-md-5">
                            <img class="featurette-image img-fluid mx-auto"
                                 src="https://www.thelocal.it/userdata/images/article/69523836b0191608c41d640feead8da2be5462038d3409e1e3900fad039c7fc8.jpg"
                                 alt="Generic placeholder image"/>
                        </div>
                    </Row>

                </Grid>
            </div>
        );
    }

}

export default Homepage;
