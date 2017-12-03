/**
 * Title: Recipe.js
 * Authors: Alexander Haggart & Johnson Ye
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';
import RecipeHelper from '../classes/RecipeHelper';
import {Tabs, Tab} from 'react-bootstrap';
import '../../css/recipes.css';
import User from '../classes/User'
import '../../css/review.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-carousel/dist/react-bootstrap-carousel.css';
import {Carousel} from 'react-bootstrap';


class Recipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            loaded:false,
            data:'Loading . . . ',
            value:''
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe(this.props.match.params.recipe,this.setRecipeData,this.props.match.params.user)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.User = new User();
    }

    setRecipeData(recipeObject,err){
        if(!recipeObject){
            // alert(JSON.stringify(this))
            const notFound = this.props.match.params.recipe.toString()+' not found :('
            this.setState({data:err,loaded:false})
            // alert(notFound)
            return
        }
        this.setState({data:recipeObject,loaded:true})
    }

    updateReviews(response){
        this.setState({data:this.state.data})
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A comment was submitted: ' + this.state.value);
        this.forceUpdate();
        event.preventDefault();
    }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }

        /*var ingredients = this.state.data.Ingredients.map((ingredient) => <li class="list-group-item"><span color={this.state.mousedOver === ingredient ? 'red' : 'black'}>{ingredient}</span></li>)*/
        var ingredients = this.state.data.Ingredients.map((ingredient) =>
            <li class="list-group-item">
                <span>
                    <button onClick={(e)=>this.User.addToShoppingList(ingredient)} type="button" class="btn btn-circle" id="shoppoing_cart">
                        <i class="glyphicon glyphicon-shopping-cart"/>
                    </button>
                    {ingredient}
                </span>
            </li>)

        var directions = this.state.data.Directions.map((step) =>
            <li class="list-group-item"><i class="fa fa-cutlery" id="forksize"/>{step}</li>)

        // alert(JSON.stringify(this.state.data))
        var reviews = Object.entries(this.state.data.Reviews?this.state.data.Reviews:{}).map((review) =>
            <li>
                <h4><i class="glyphicon glyphicon-user"/>&nbsp;&nbsp;{review[1].username}
                <img src={'/star.jpg'} height='21' width='21'/></h4>
                <p>{review[1].Comment}</p>
            </li>)

        var updateComment = {username:'USERTESTING',Comment:this.state.value,Rating:'5',timestamp:'-1'}

        const carouselInstance = (
            <Carousel id="Carousel" className="carousel">
                <Carousel.Item className="carousel-item">
                    <img src="https://andyloweorg.files.wordpress.com/2017/10/file_5890583196d69functional-foods_1-1024x682.jpg?w=1024&h=576&crop=1" class="img-fluid " alt=""/>
                </Carousel.Item>
                <Carousel.Item className="carousel-item">
                    <img src="http://foodandtravel.mx/home/wp-content/uploads/2017/07/1qTcIHK.jpg" class="img-fluid " alt=""/>
                </Carousel.Item>

                <Carousel.Item className="carousel-item">
                    <img src="http://cdn.shopify.com/s/files/1/0164/3912/files/tagliatelle_with_mushrooms_3_1024x1024.jpg?12754498851335701329" class="img-fluid " alt="1024x682"/>
                </Carousel.Item>
            </Carousel>
        );

        return (
            <div>
                <div className="jumbotron">
                    <h1>{this.state.data.Name}</h1>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6">

                            {/*<img src={'/Basic Baked Spaghetti.jpg'} class="img-fluid " alt=""/>*/}
                            <div>
                                {carouselInstance}
                            </div>

                            <div class="btn-group btn-group-sm">
                                {/*<button onClick={(e)=>this.client.updateReview(this.state.data.Name,dummyReviewObject,this.updateReviews)} type={"button"} class="btn btn-outline-primary">  UPDATE  </button>*/}
                                <button onClick={(e)=>User.getUser('user001').getUserData('cookbook').then((data)=>alert(JSON.stringify(data)))} type={"button"} class="btn btn-outline-primary">
                                    <i class="glyphicon glyphicon-check"/>  check  </button>
                                <button onClick={(e)=>User.getUser('user001').saveExternalRecipe(this.state.data.Name)} type={"button"} class="btn btn-outline-primary">
                                    <i class="glyphicon glyphicon-book"/>  add to cookbook  </button>
                                <button onClick={(e)=>User.getUser('user001').deleteRecipe(this.state.data.Name)} type={"button"} class="btn btn-outline-primary">
                                    <i class="glyphicon glyphicon-trash"/>  remove from cookbook  </button>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            {/*<h1>{this.state.data.Name}</h1>*/}
                            <h2>Ingredients:</h2>
                            <ul>{ingredients}</ul>
                        </div>
                    </div>
                    <h2>Directions:</h2>
                    <ol>{directions}</ol>
                    {/*<h2>Reviews:</h2>*/}
                    {/*<ul>{reviews}</ul>*/}
                    {/*<h2>JSON:</h2>
                            <p>{JSON.stringify(this.state.data)}</p>*/}
                </div>

                <div class="container" id="reviewContainer">
                    <div>
                        {/* Nav bar content here */}
                        <div className="container">
                            <Tabs defaultActiveKey={1}>
                                <Tab eventKey={1} title={"User Comment"}>
                                    <div>
                                        <div class="row">
                                            User Comment
                                        </div>
                                        <div class="row">
                                            <ul>{reviews}</ul>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey={2} title={"Leave a Comment"}>
                                    <form onSubmit={this.handleSubmit}>
                                        <label>Leave your comment:</label>
                                        <textarea class="form-control" name="comment" rows="8" id="comment" placeholder="Write a comment here" value={this.state.value} onChange={this.handleChange}/>

                                        <div class="form-group">
                                            <div class="col-12">
                                                <span className="pull-right">
                                                    <br/>
                                                    <button onClick={(e)=>this.client.updateReview(this.state.data.Name,updateComment,this.updateReviews)}
                                                        class="btn btn-success btn-circle text-uppercase" type="submit" id="submitComment">
                                                        <span class="glyphicon glyphicon-send"/> Submit comment
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>

            </div>


            )
    }

}

export default Recipe;