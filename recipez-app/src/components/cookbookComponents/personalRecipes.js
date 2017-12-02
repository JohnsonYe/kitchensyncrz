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

        this.getRecipeObjects = this.getRecipeObjects.bind(this);
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
            validation:'',
        };

        this.userInstance = props.userInstance;
        this.recipeHelper = new RecipeHelper();
        this.getRecipeObjects();
    }

    getRecipeObjects(){
        this.userInstance.getCookbook((cookbook_contents) => {
            this.state.recipeList = [];
            this.cookbook = cookbook_contents;
            for (let source of Object.values(this.cookbook)) {
                if (source !== "none") {
                    this.state.recipeList.push(JSON.parse(source));
                }
            }

            this.setState({
                recipeList: this.state.recipeList,
            });

        });
    }

    createNewBlankRecipe(recipeName){

        let newRecipe = this.recipeHelper.createRecipe(recipeName,["cabbage"],["Icky sticky cabbage bubbleboi"]);
        this.userInstance.saveCustomRecipe(newRecipe,this.getRecipeObjects);
        this.close();

    }

    // Had to change to arrow func to get it to bind properly... should work?
    removeRecipe = (recipeName) => {

        this.userInstance.deleteRecipe(recipeName,this.getRecipeObjects);

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

        if (!/^[a-zA-Z0-9\s]+$/.test(recipeName)) {
            this.setState({
                validation: 'error',
            });
            return;
        }

        this.recipeHelper.loadRecipe(recipeName,(recipe)=>{
            if (!recipe) {
                this.createNewBlankRecipe(this.state.value);
                this.setState({
                    validation: '',
                    value: '',
                });

            } else {
                this.setState({
                    validation: 'error',
                });
            }
        });


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

        let form =
            <form>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.state.validation}
                >
                    <FormControl
                        type={"text"}
                        value={this.state.value}
                        placeholder="Title"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback/>
                </FormGroup>
            </form>
        ;

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
                        {form}
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <div className={"btn btn-success"} onClick={() => {
                                this.getValidationState()
                            }}>
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
