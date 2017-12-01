/**
 * File: savedRecipes.js
 * Author: Matthew Taylor
 *
 * The component that displays all of the user's saved recipes
 */

import React, {Component} from 'react';
import PreviewCard from '../cookbookComponents/previewCard';
import AndrewPreviewCard from '../cookbookComponents/andrew_previewCard'
import {FormGroup,FormControl,HelpBlock,ControlLabel,Modal} from 'react-bootstrap';
import RecipeHelper from '../classes/RecipeHelper.js'
// TODO: Some sort of function to automatically add and display preview cards
class PersonalRecipes extends Component{

    constructor(props){
        super(props);

        this.getRecipeNamesAndObjects = this.getRecipeNamesAndObjects.bind(this);
        this.createNewBlankRecipe = this.createNewBlankRecipe.bind(this);
        this.removeRecipe = this.removeRecipe.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.getValidationState = this.getValidationState.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            recipeList: [],
            modal: false,
            value: '',
        };

        this.userInstance = props.userInstance;
        this.recipeHelper = new RecipeHelper();
        this.getRecipeNamesAndObjects();
    }

    getRecipeNamesAndObjects(){
        this.userInstance.getCookbook((cookbook_contents) => {
            this.state.recipeList = [];
            this.cookbook = cookbook_contents;
            for (let source of Object.values(this.cookbook)) {
                if (source !== "none") {
                    this.state.recipeList.push(JSON.parse(source));
                }
            }

            console.log('This is the recipeName list after getting them all:');
            console.log(this.cookbook);
            console.log('This is the recipe list after attempting to add objects by JSON.parse');
            console.log(this.state.recipeList);
            this.setState({
                recipeList: this.state.recipeList,
            });

        });
    }

    createNewBlankRecipe(recipeName){

        let newRecipe = this.recipeHelper.createRecipe(recipeName,["cabbage"],["Icky sticky cabbage bubbleboi"]);
        console.log(this.userInstance.saveCustomRecipe(newRecipe));
        this.getRecipeNamesAndObjects();
        this.close();

    }

    // Had to change to arrow func to get it to bind properly... should work?
    removeRecipe = (recipeName) => {

        this.userInstance.deleteRecipe(recipeName);
        this.getRecipeNamesAndObjects();

    };

    open(){
        this.setState({
            modal: true,
        });
    }

    close(){
        this.setState({
           modal: false,
        });
    }
    getValidationState() {
        const recipeName = this.state.value;

        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render(){

        let recipeCards = [];
        this.state.recipeList.sort(function(a,b){
            if(a.Name < b.Name) return -1;
            if(a.Name > b.Name) return 1;
            return 0;
        });
        for( let recipe of this.state.recipeList){
            recipeCards.push(<PreviewCard src={recipe} removeFunc={this.removeRecipe} personal={1}/>);
        }


        return(
            <div>

                <div className={"btn btn-success"} onClick={this.open}>
                    Create Recipe
                </div>
                <div className={"container-fluid"}>
                <div className={"row"}>
                    {recipeCards}
                </div>
                </div>

                <Modal show={this.state.modal} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>
                            Please enter a unique title:
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form>
                            <FormGroup
                                controlId="formBasicText"
                                validationState={this.getValidationState()}
                            >
                                <FormControl
                                    type="text"
                                    value={this.state.value}
                                    placeholder="Title"
                                    onChange={this.handleChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <div className={"btn btn-success"} onClick={() => {this.createNewBlankRecipe(this.state.value)}}>
                                Create
                            </div>
                            <div className={"btn btn-light"} onClick={this.close}>
                                Cancel
                            </div>
                        </div>
                    </Modal.Footer>

                </Modal>
            </div>
        );
    }

}

export default PersonalRecipes;
