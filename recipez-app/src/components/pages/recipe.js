/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
 * Date Created: 11/11/2017
 * Description: This file will load and display a recipe
 */
import React,{ Component } from 'react';
import RecipeHelper from '../classes/RecipeHelper';
import '../../css/recipes.css';
import User from '../classes/User'
import '../../css/review.css';


class Recipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            loaded:false,
            data:'Loading . . . ',
            value:'write a comment'
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe(this.props.match.params.recipe,this.setRecipeData,this.props.match.params.user)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        event.preventDefault();
    }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        /*var ingredients = this.state.data.Ingredients.map((ingredient) => <li class="list-group-item"><span color={this.state.mousedOver === ingredient ? 'red' : 'black'}>{ingredient}</span></li>)*/
        var ingredients = this.state.data.Ingredients.map((ingredient) => <li class="list-group-item"><span>
            <button type="button" class="btn btn btn-circle" id="shoppoing_cart"><i class="glyphicon glyphicon-shopping-cart"/></button>
            {ingredient}</span></li>)
        var directions = this.state.data.Directions.map((step) => <li class="list-group-item">{step}</li>)
        var timecost
        var difficulty
        // alert(JSON.stringify(this.state.data))
        var reviews = Object.entries(this.state.data.Reviews?this.state.data.Reviews:{}).map((review) =>
            <li>
                <div>
                    <h5 style={{float:'left'}}>{review[1].username}</h5><img src={'/star.jpg'} height='21' width='21'/>
                </div>
                <p>{review[1].Comment}</p>
            </li>)
        var dummyReviewObject = {username:'user001',Comment:'new hello world',Rating:'5',timestamp:'-1'}
        var updateComment = {username:'Johnson',Comment:this.state.value,Rating:'0',timestamp:'-1'}
        return (
            <div>
                <div className="jumbotron">
                    <h1>{this.state.data.Name}</h1>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6">
                           {/* <div id="myCarousel" class="carousel slide" date-ride="carousel">
                                <ol class="carousel-indicators">
                                    <li data-target="#myCarousel" data-slide-to="0" class="active"/>
                                    <li data-target="#myCarousel" data-slide-to="1"/>
                                    <li data-target="#myCarousel" data-slide-to="2"/>
                                </ol>

                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img class="d-block img-fluid" src="https://images-gmi-pmc.edge-generalmills.com/f48f767c-5e82-4826-a5ca-85e9cfb15920.jpg" alt="First slide"/>
                                    </div>

                                    <div class="carousel-item">
                                        <img class="d-block img-fluid" src="http://images.media-allrecipes.com/userphotos/600x600/4228736.jpg" alt="Second slide"/>
                                    </div>

                                    <div class="carousel-item">
                                        <img class="d-block img-fluid" src="http://images.media-allrecipes.com/userphotos/600x600/2126904.jpg" alt="Third slide"/>
                                    </div>
                                </div>

                                <a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"/>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"/>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>*/}

                            <img src="https://images-gmi-pmc.edge-generalmills.com/f48f767c-5e82-4826-a5ca-85e9cfb15920.jpg" class="img-fluid " alt=""></img>

                            <div class="btn=group btn-group-sm">
                                <button onClick={(e)=>this.client.updateReview(this.state.data.Name,dummyReviewObject,this.updateReviews)} type={"button"} class="btn btn-outline-primary">  UPDATE  </button>
                                <button onClick={(e)=>User.getUser('user001').getUserData('cookbook').then((data)=>alert(JSON.stringify(data)))} type={"button"} class="btn btn-outline-primary">  check  </button>
                                <button onClick={(e)=>User.getUser('user001').saveExternalRecipe(this.state.data.Name)} type={"button"} class="btn btn-outline-primary">  add to cookbook  </button>
                                <button onClick={(e)=>User.getUser('user001').deleteRecipe(this.state.data.Name)} type={"button"} class="btn btn-outline-primary">  remove from cookbook  </button>
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

                <div class="container">
                    <div class="row">
                        <ul>{reviews}</ul>
                    </div>

                    <div class="row">
                        <form onSubmit={this.handleSubmit}>
                            <label>Leave your comment:</label>
                            <textarea class="form-control" name="comment" rows="8" id="comment" value={this.state.value} onChange={this.handleChange}/>

                            {/*<div class="form-group">
                                <div class="col-sm-offset-10 col-sm-10">*/}
                                    <button onClick={(e)=>this.client.updateReview(this.state.data.Name,updateComment,this.updateReviews)}
                                            class="btn btn-success btn-circle text-uppercase" type="submit" id="submitComment">
                                        <span class="glyphicon glyphicon-send"/> Summit comment</button>
                                {/*</div>
                            </div>*/}
                        </form>
                    </div>
                </div>


            </div>


            )
    }

}

export default Recipe;
