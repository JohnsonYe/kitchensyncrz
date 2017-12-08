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
            active: false,
            numHighlighted:0,
        }
        this.setRecipeData = this.setRecipeData.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
        this.client = new RecipeHelper();
        this.client.loadRecipe(this.props.match.params.recipe,this.setRecipeData,this.props.match.params.user)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.getRatingComponent = this.getRatingComponent.bind(this);
        this.getRatingSymbols = this.getRatingSymbols.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
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
        if(recipeObject.Reviews){
            let review = recipeObject.Reviews[this.user.client.getUsername()]
            if(review){
                this.setState({value:review.Comment,userRating:review.Rating})
            }
        }
        this.setState({data:recipeObject,loaded:true})
    }

    updateReviews(response){
        console.log('review update: '+JSON.stringify(response));
        this.client.loadRecipe(this.props.match.params.recipe, this.setRecipeData, this.props.match.params.user)
        this.setState({key:1})
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        // alert('A comment was submitted: ' + this.state.value);
        // this.forceUpdate();
        event.preventDefault();
    }

    handleSelect(key){
        console.log('handling select');
        this.setState({key});
    }

    getRatingComponent(){
        let counter = (()=>{
            let value = 0;
            return (()=>value++);
        })();
        let starSet = [];
        let numToHighlight = (this.state.userRating>0&&this.state.numHighlighted===0)?this.state.userRating:this.state.numHighlighted;
        for(let i=0;i<5;i++){
            let base = (<span 
                            className='glyphicon glyphicon-star' 
                            key={i+''} 
                            onMouseOver={(e)=>this.setState({numHighlighted:i+1})}
                            onClick={(e)=>{this.setState({userRating:i+1})}}/>);
            if(i < numToHighlight){
                base = (<span className='good-rating'>{base}</span>);
            }
            starSet.push(base)
        }
        return (<div className='rating-component' onMouseLeave={(e)=>this.setState({numHighlighted:0})}>{starSet}</div>);
    }

    getRatingSymbols(numStars){
        let starSet = [];
        for(let i=0;i<5;i++){
            let base = (<span 
                            className='glyphicon glyphicon-star' 
                            key={i+''} 
                            onMouseOver={(e)=>this.setState({numHighlighted:i+1})}
                            onClick={(e)=>{this.setState({userRating:i+1})}}/>);
            if(i < numStars){
                base = (<span className='good-rating'>{base}</span>);
            }
            starSet.push(base)
        }

        return (<span className='rating-component pull-right'>{starSet}</span>);
    }

    // reload() {
    //     window.location.reload();
    // }

    render() {
        if(!this.state.loaded) {
            return <div><h1>{this.state.data}</h1></div>
        }
        var ingredients = this.state.data.Ingredients.map((ingredient) =>(
            <li className="list-group-item col-sm-5">
                <span>
                    <button onClick={(e) => this.user.addToShoppingList(ingredient)} className="shopping button"
                            type="button" className="btn btn-circle" id="shoppoing_cart">
                        <i className="glyphicon glyphicon-shopping-cart"/>
                    </button>
                    &nbsp;&nbsp;
                    {ingredient}
                </span>
            </li>
        ));

        var directions = this.state.data.Directions.map((step) =>(
            <li className="list-group-item">
                <i className="glyphicon glyphicon-cutlery" id="forksize"/>{step}
            </li>
        ));

        var editButton = ((user)=>(
                <span className='btn btn-default btn-sm' title='edit' onClick={(e)=>this.setState({key:2})}>
                    <span className='glyphicon glyphicon-pencil'/> {user}
                </span>
        ));

        var otherUser = ((user)=>(
            <span className='btn btn-default btn-sm disabled'>
                <i className="glyphicon glyphicon-user"/> {user}
            </span>
        ));

        // alert(JSON.stringify(this.state.data))
        var reviews = Object.entries(this.state.data.Reviews?this.state.data.Reviews:{}).map((review) =>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span>
                            {(this.user.client.getUsername()===review[1].username)?editButton(review[1].username):otherUser(review[1].username)}
                            {this.getRatingSymbols(review[1].Rating)}
                        </span>
                    </div>
                    <div className="panel-body">
                        <p>{review[1].Comment}</p>
                    </div>
                </div>
            );

        var updateComment = {
            username: this.user.client.getUsername(),
            Comment: this.state.value,
            Rating: this.state.userRating,
            timestamp: '-1',
        }
        var defaultImage = ["https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ieqr7Lr2x6Ug/v0/800x-1.jpg",
                            "https://s3-ap-northeast-1.amazonaws.com/sharingkyoto2017/articles/KVxqUS8KsRCmG7LTCyM2Tx4xNAdk6s09IKEa5yTU.jpeg",
                            "http://cdn-api.skim.gs/images/view/54be909e3847cf000069016b"];
        const carouselInstance = (
            <Carousel>
                {[0,1,2].map((key)=>(
                    <Carousel.Item className="CarouselSize">
                        <img src={this.state.data.Image ? Array.from(this.state.data.Image)[key] : defaultImage[key]}
                             className="img-fluid"/>
                    </Carousel.Item>
                ))}
            </Carousel>
        );

        return (
            <div>
                <div className="jumbotron">
                    <h1 className="text-white">Kitchen Sync</h1>
                </div>
                <h1 className="PageHeader">{this.state.data.Name}</h1>
                <br/>

                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            {/*show picture*/}
                            <div>
                                {carouselInstance}
                            </div>
                        </div>
                            {/*====button group====*/}
                            <div className='col-sm-3'>
                                <div className='row padding-down'>
                                    <h2>
                                        <i className="glyphicon glyphicon-time"/>&nbsp;&nbsp;{this.state.data.TimeCost}&nbsp;&nbsp;&nbsp;
                                    </h2>
                                    <h2>    
                                        <i className="glyphicon glyphicon-wrench"/>&nbsp;{this.state.data.Difficulty}
                                    </h2>
                                </div>
                                <div className='row'>
                                    {this.props.match.params.user?null:
                                    <div className="btn=group btn-group-lg">
                                        <button
                                            onClick={(e) => this.user.saveExternalRecipe(this.state.data.Name)}
                                            type={"button"} className="btn btn-outline-primary">
                                            <i className="glyphicon glyphicon-book"/> add to cookbook
                                        </button>
                                        <button
                                            onClick={(e) => this.user.deleteRecipe(this.state.data.Name)}
                                            type={"button"} className="btn btn-outline-primary">
                                            <i className="glyphicon glyphicon-trash"/> remove from cookbook
                                        </button>
                                    </div>}
                                </div>
                            </div>
                            {/*====button group====*/}
                    </div>
                    <div className="row">
                        <div className="Ingredient col-12" float='left'>
                            <h2>Ingredients:</h2>
                            <ul>{ingredients}</ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="Direction col-12" float='left'>
                            <h2 className="Directions">Directions:</h2>
                            <ol>{directions}</ol>
                        </div>  
                    </div>
                </div>

                {this.props.match.params.user?null:
                <div className="container">
                    <div>
                        {/* Nav bar content here */}
                        <div className="container">
                            <Tabs activeKey={this.state.key} defaultActiveKey={1} onSelect={this.handleSelect}>
                                <Tab eventKey={1} title={"Comments"}>
                                    {reviews}
                                </Tab>
                                <Tab eventKey={2} title={"Rate and Comment"}>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <textarea className="form-control" placeholder="Write a comment" name="comment"
                                                      rows="8" id="comment" value={this.state.value}
                                                      onChange={this.handleChange}/>
                                                <span className="pull-left">
                                                    {this.getRatingComponent()}
                                                </span>
                                                <span className="pull-right">
                                                    <button onClick={(e) => {
                                                        if(this.state.userRating){
                                                            this.client.updateReview(this.state.data.Name, updateComment, this.updateReviews);
                                                        } else {
                                                            alert('Please leave a rating with your review!');
                                                        }
                                                    }}
                                                            className="btn btn-success comment-button"
                                                            type="submit">
                                                        <span className="glyphicon glyphicon-send"/> Submit comment</button>
                                                </span>
                                        </div>
                                    </form>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>}

            </div>
        )
    }

}

export default Recipe;
