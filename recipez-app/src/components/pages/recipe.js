/**
 * Title: Recipe.js
 * Authors: Alexander Haggart
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
        super(props);
        this.state = {
            loaded:false,
            data:'Loading . . . ',
            value: '',
            active: false
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe(this.props.match.params.recipe,this.setRecipeData,this.props.match.params.user)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.reload = this.reload.bind(this);
        this.user = User.getUser();
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
        this.client.loadRecipe(this.props.match.params.recipe, this.setRecipeData, this.props.match.params.user)
        // this.setState({data:this.state.data})
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A comment was submitted: ' + this.state.value);
        // this.forceUpdate();
        event.preventDefault();
    }

    // reload() {
    //     window.location.reload();
    // }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        var ingredients = this.state.data.Ingredients.map((ingredient) =>(
            <li class="list-group-item col-sm-5">
                <span>
                    <button onClick={(e) => this.user.addToShoppingList(ingredient)} className="shopping button"
                            type="button" class="btn btn-circle" id="shoppoing_cart">
                        <i class="glyphicon glyphicon-shopping-cart"/>
                    </button>
                    &nbsp;&nbsp;
                    {ingredient}
                </span>
            </li>
        ));

        var directions = this.state.data.Directions.map((step) =>(
            <li class="list-group-item">
                <i class="glyphicon glyphicon-cutlery" id="forksize"/>{step}
            </li>
        ));

        // alert(JSON.stringify(this.state.data))
        var reviews = Object.entries(this.state.data.Reviews?this.state.data.Reviews:{}).map((review) =>
            <li>
                <div class="panel panel-default">
                    <div class="panel-heading"><i
                        class="glyphicon glyphicon-user"/>&nbsp;&nbsp;{review[1].username}&nbsp;<img src={'/star.jpg'}
                                                                                                     height='21'
                                                                                                     width='21'/></div>
                    <div class="panel-body"><p>{review[1].Comment}</p></div>
                </div>
            </li>)

        var updateComment = {
            username: this.user.client.getUsername(),
            Comment: this.state.value,
            Rating: '5',
            timestamp: '-1'
        }
        var defaultImage1 = "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ieqr7Lr2x6Ug/v0/800x-1.jpg"
        var defaultImage2 = "https://s3-ap-northeast-1.amazonaws.com/sharingkyoto2017/articles/KVxqUS8KsRCmG7LTCyM2Tx4xNAdk6s09IKEa5yTU.jpeg"
        var defaultImage3 = "http://cdn-api.skim.gs/images/view/54be909e3847cf000069016b"
        const carouselInstance = (
            <Carousel>
                <Carousel.Item className="CarouselSize">
                    <img src={this.state.data.Image ? Array.from(this.state.data.Image)[0] : defaultImage1}
                         class="img-fluid"/>
                </Carousel.Item>

                <Carousel.Item className="CarouselSize">
                    <img src={this.state.data.Image ? Array.from(this.state.data.Image)[1] : defaultImage2}
                         class="img-fluid "/>
                </Carousel.Item>

                <Carousel.Item className="CarouselSize">
                    <img src={this.state.data.Image ? Array.from(this.state.data.Image)[2] : defaultImage3}
                         class="img-fluid "/>
                </Carousel.Item>
            </Carousel>
        );

        return (
            <div>
                <div className="jumbotron">
                    <h1 className="text-white">Kitchen Sync</h1>
                </div>
                <h1 className="PageHeader">{this.state.data.Name}</h1>
                <br/>

                <div class="container">
                    <div class="row">
                        <div class="col-8">
                            {/*show picture*/}
                            <div>
                                {carouselInstance}
                            </div>
                        </div>
                            {/*====button group====*/}
                            <div className='col-sm-3'>
                                <div className='row padding-down'>
                                    <h2>
                                        <i class="glyphicon glyphicon-time"/>&nbsp;&nbsp;{this.state.data.TimeCost}&nbsp;&nbsp;&nbsp;
                                    </h2>
                                    <h2>    
                                        <i class="glyphicon glyphicon-wrench"/>&nbsp;{this.state.data.Difficulty}
                                    </h2>
                                </div>
                                <div className='row'>
                                    <div class="btn=group btn-group-lg">
                                        {/*<button onClick={(e)=>this.client.updateReview(this.state.data.Name,dummyReviewObject,this.updateReviews)} type={"button"} class="btn btn-outline-primary">  UPDATE  </button>*/}
                                        <button
                                            onClick={(e) => this.user.saveExternalRecipe(this.state.data.Name)}
                                            type={"button"} class="btn btn-outline-primary">
                                            <i class="glyphicon glyphicon-book"/> add to cookbook
                                        </button>
                                        <button
                                            onClick={(e) => this.user.deleteRecipe(this.state.data.Name)}
                                            type={"button"} class="btn btn-outline-primary">
                                            <i class="glyphicon glyphicon-trash"/> remove from cookbook
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/*====button group====*/}
                    </div>
                    <div class="col-sm-6" className="Ingredient" float='left'>
                        <h2>Ingredients:</h2>
                        <ul>{ingredients}</ul>
                    </div>
                    <h2 className="Direction">Directions:</h2>
                    <ol>{directions}</ol>
                </div>

                <div class="container">
                    <div>
                        {/* Nav bar content here */}
                        <div className="container">
                            <Tabs defaultActiveKey={1}>
                                <Tab eventKey={1} title={"User Comment"}>
                                    <ul>{reviews}</ul>
                                </Tab>
                                <Tab eventKey={2} title={"Leave a Comment"}>
                                    <form onSubmit={this.handleSubmit}>
                                        {/*<label>Leave your comment:</label>*/}
                                        <i class="glyphicon glyphicon-pencil"/>
                                        <textarea class="form-control" placeholder="Write a comment" name="comment"
                                                  rows="8" id="comment" value={this.state.value}
                                                  onChange={this.handleChange}/>

                                        <div class="form-group">
                                            <div class="col-12">
                                                <span className="pull-right">
                                                    <br/>
                                                    <button onClick={(e) => {
                                                        this.client.updateReview(this.state.data.Name, updateComment, this.updateReviews);
                                                        /*this.reload()*/
                                                    }}
                                                            class="btn btn-success btn-circle text-uppercase"
                                                            type="submit" id="submitComment">
                                                        <span class="glyphicon glyphicon-send"/> Summit comment</button>
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
