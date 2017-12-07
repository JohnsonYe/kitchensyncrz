/**
 * File: previewCard.js
 * Author: Matthew Taylor
 *
 * Serves as the basic preview card, either for the saved recipes or for the personal recipes
 */

import React, {Component} from 'react';
import {Modal, FormGroup, FormControl, ControlLabel, InputGroup, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import IngredientForm from './IngredientForm';
import RecipeHelper from '../classes/RecipeHelper';
/**
 * TODO: Andrew's add-to-planner button
 * TODO: Review stars/forks
 * TODO: Recipe editing modal
 *              *
 * TODO: Image framework - for hardcoding presentation purposes
 */
class PreviewCard extends Component{


    constructor(props) {
        super(props);


        this.removeThis = this.removeThis.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.deletionOpen = this.deletionOpen.bind(this);
        this.deletionClose = this.deletionClose.bind(this);
        this.editOpen = this.editOpen.bind(this);
        this.editClose = this.editClose.bind(this);
        this.editorSaveChanges = this.editorSaveChanges.bind(this);
        this.handleChangeInsertIngredient = this.handleChangeInsertIngredient.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.handleChangeDirections = this.handleChangeDirections.bind(this);
        this.handleChangeDuration = this.handleChangeDuration.bind(this);
        this.handleChangeDifficulty = this.handleChangeDifficulty.bind(this);
        this.noImg = require("./no-photo.png");
        let initialIngredientList = [];
        this.ingredientFormRefs = [];
        for (let original_ingredient of props.src.Ingredients) {
            initialIngredientList.push(<IngredientForm removeFunc={this.removeIngredient}
                                                       ingredient={original_ingredient} ref={(newIngredientForm) => {
                if (newIngredientForm !== null) {
                    this.ingredientFormRefs.push(newIngredientForm);
                }
            }}/>);
        }

        let initial_directions = "";
        for (let direction_line of props.src.Directions) {
            initial_directions += direction_line + '\n';
        }

        this.state={
            deletionModal: false,
            editModal: false,
            ingredientList: initialIngredientList.slice(),
            workingIngredientList: initialIngredientList,
            ingredientToAdd: '',
            directions: initial_directions,
            workingDirections: initial_directions,
            difficulty: props.src.Difficulty,
            workingDifficulty: props.src.Difficulty,
            duration: props.src.TimeCost,
            workingDuration: props.src.TimeCost,
        };

        this.recipeHelper = new RecipeHelper();
    }

    componentWillReceiveProps(newProps) {
        let initialIngredientList = [];
        this.ingredientFormRefs = [];
        for (let original_ingredient of newProps.src.Ingredients) {
            initialIngredientList.push(<IngredientForm removeFunc={this.removeIngredient}
                                                       ingredient={original_ingredient} ref={(newIngredientForm) => {
                if (newIngredientForm !== null) {
                    this.ingredientFormRefs.push(newIngredientForm);
                }
            }}/>);
        }

        let initial_directions = "";
        for (let direction_line of newProps.src.Directions) {
            initial_directions += direction_line + '\n';
        }
        this.setState({
            //deletionModal: false,
            //editModal: false,
            ingredientList: initialIngredientList.slice(),
            workingIngredientList: initialIngredientList,
            ingredientToAdd: '',
            directions: initial_directions,
            workingDirections: initial_directions,
            difficulty: newProps.src.Difficulty,
            workingDifficulty: newProps.src.Difficulty,
            duration: newProps.src.TimeCost,
            workingDuration: newProps.src.TimeCost,
        })
    }

    deletionOpen(e) {
        // e.stopPropagation();
        console.log('in open');
        this.setState({
            deletionModal: true,
        });

    }

    deletionClose(e) {
        // e.stopPropagation();
        console.log('in close');
        this.setState({
            deletionModal: false,
        });

    }

    editOpen(e) {
        // e.stopPropagation();
        this.ingredientFormRefs = [];
        this.setState({
            editModal: true,
            workingDirections: this.state.directions,
            workingIngredientList: this.state.ingredientList.slice(),
            workingDifficulty: this.state.difficulty,
            workingDuration: this.state.duration,
        });
    }

    editClose(e) {
        this.setState({
            editModal: false,
            workingIngredientList: this.state.ingredientList.slice(),
            workingDirections: this.state.directions,
            workingDuration: this.state.duration,
            workingDifficulty: this.state.difficulty,
        });
        this.ingredientFormRefs = [];
    }

    removeThis(){
        this.deletionClose();
        this.props.removeFunc(this.props.src.Name);
    }

    removeIngredient(ingredientToRemove) {


        let updatedWorkingIngredientList = [];
        for (let i in this.ingredientFormRefs) {
            if (this.ingredientFormRefs[i] === ingredientToRemove) {
                this.ingredientFormRefs.splice(parseInt(i), 1);
            }
        }
        for (let ingredientFormRef of this.ingredientFormRefs) {
            updatedWorkingIngredientList.push(<IngredientForm removeFunc={this.removeIngredient}
                                                              ingredient={ingredientFormRef.getFullString()}
                                                              ref={(updatedIngredientFormRef) => {
                                                                  if (updatedIngredientFormRef !== null) {
                                                                      this.ingredientFormRefs.push(updatedIngredientFormRef);
                                                                  }
                                                              }
                                                              }/>);
        }
        this.ingredientFormRefs = [];
        this.setState({
            workingIngredientList: updatedWorkingIngredientList.slice(),
        });

    }


    editorSaveChanges() {

        let updatedIngredientList = [];
        let stringIngredientList = [];
        for (let ingredientFormRef of this.ingredientFormRefs) {
            updatedIngredientList.push(<IngredientForm removeFunc={this.removeIngredient}
                                                       ingredient={ingredientFormRef.getFullString()}
                                                       ref={(updatedIngredientFormRef) => {
                                                           if (updatedIngredientFormRef !== null) {
                                                               this.ingredientFormRefs.push(updatedIngredientFormRef)
                                                           }
                                                       }
                                                       }/>);
            stringIngredientList.push(ingredientFormRef.getFullString());
        }

        let updatedDirections = this.state.workingDirections.split('\n');
        console.log(updatedDirections);
        let index = 0;
        while (index < updatedDirections.length) {
            if (updatedDirections[index] == "") {
                updatedDirections.splice(index, 1);
            } else {
                index = index + 1;
            }
        }

        let updatedDirectionsString = "";
        for (let direction_line of updatedDirections) {
            updatedDirectionsString += direction_line + '\n';
        }
        this.setState({
            ingredientList: updatedIngredientList.slice(),
            workingIngredientList: updatedIngredientList.slice(),
            directions: updatedDirectionsString,
            difficulty: this.state.workingDifficulty,
            duration: this.state.workingDuration,

        });
        this.props.updateFunc(this.recipeHelper.createRecipe(this.props.src.Name, stringIngredientList, updatedDirections,this.state.workingDuration,this.state.workingDifficulty,this.props.src.Image));
        this.editClose();
    }

    handleChangeInsertIngredient(e) {
        this.setState({
            ingredientToAdd: e.target.value,
        });
    }

    addIngredient() {

        let updatedWorkingIngredientList = this.state.workingIngredientList.slice();

        updatedWorkingIngredientList.push(<IngredientForm removeFunc={this.removeIngredient}
                                                          ingredient={"\u180e" + this.state.ingredientToAdd + "\u180e"}
                                                          ref={(updatedIngredientFormRef) => {
                                                              if (updatedIngredientFormRef !== null) {
                                                                  this.ingredientFormRefs.push(updatedIngredientFormRef);
                                                              }
                                                          }
                                                          }/>);


        this.setState({
            workingIngredientList: updatedWorkingIngredientList.slice(),
            ingredientToAdd: '',
        })
    }

    handleChangeDirections(e) {
        this.setState({
            workingDirections: e.target.value,
        });
    }

    handleChangeDuration(e) {
        this.setState({
            workingDuration: e.target.value,
        })
    }

    handleChangeDifficulty(e) {
        this.setState({
            workingDifficulty: e.target.value,
        })
    }

    render() {

        let personalAddendum;
        if(this.props.personal) {
            personalAddendum =
                <p>
                    Once you delete a personal recipe, it cannot be undone.
                </p>;
        }
        let editButton;
        if(this.props.personal){
            editButton =
                <div className="btn btn-primary" onClick={this.editOpen}>
                    Edit
                </div>
        }


        let insertionForm =
            <div>
                <div>
                    <ControlLabel>Add Ingredients</ControlLabel>
                </div>
                <div className={"row"}>

                    <div className={"col-md-10"}>
                        <form onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                this.addIngredient();
                            }
                        }}>
                            <FormGroup
                                controlId="formBasicText"
                                validationState={this.state.validation}
                            >
                                <FormControl
                                    type={"text"}
                                    value={this.state.ingredientToAdd}
                                    placeholder="Enter an ingredient, without units of measurement or additional information"
                                    onChange={this.handleChangeInsertIngredient}
                                />
                                <FormControl.Feedback/>
                            </FormGroup>
                        </form>
                    </div>
                    <div className={"col-md-2"}>
                        <div className={"btn btn-success"} onClick={this.addIngredient}>
                            Add
                        </div>
                    </div>
                </div>
            </div>
        ;

        let directionForm =

            <div className={"row"}>
                <div className={"col"}>
                    <form
                    >
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Directions</ControlLabel>
                            <FormControl
                                componentClass={"textarea"}
                                style={{height: '300px'}}
                                value={this.state.workingDirections}
                                placeholder="Enter directions, each on a new line"
                                onChange={this.handleChangeDirections}
                            />
                            <FormControl.Feedback/>
                        </FormGroup>
                    </form>
                </div>
            </div>
        ;

        let durationAndDifficulty =

            <div className={"row"}>
                <div className={"col-md-6"}>
                    <form
                    >
                        <FormGroup
                            controlId="formBasicText"
                        >

                            <ControlLabel>
                                Duration
                            </ControlLabel>
                            <InputGroup>
                                <FormControl
                                    type={"text"}
                                    value={this.state.workingDuration}

                                    onChange={this.handleChangeDuration}
                                />
                                <FormControl.Feedback/>
                                <InputGroup.Addon>## h ## m</InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                    </form>
                </div>
                <div className={"col-md-6"}>
                    <form
                    >
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>
                                Difficulty
                            </ControlLabel>
                            <InputGroup>
                                <FormControl
                                    type={"text"}
                                    value={this.state.workingDifficulty}
                                    placeholder=""
                                    onChange={this.handleChangeDifficulty}
                                />
                                <FormControl.Feedback/>
                                <InputGroup.Addon>
                                    out of 5
                                </InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                    </form>
                </div>
            </div>
        ;
        let image;
        if (this.props.src.Image) {
            image = Array.from(this.props.src.Image)[0];

        } else {
            image = require("./no-photo.png");
        }
        return (
            <div className={"col-md-3 mb-3"}>
                <div className="card recipes">
                    <Link to={this.props.personal ? '/Recipes/'+this.props.src.Author+'/'+this.props.src.Name : '/Recipes/'+this.props.src.Name}>

                        <div style={{backgroundColor: '#FFFFFF'}}>
                            <Image style={{height: '200px', width: 'auto', margin: 'auto',}} responsive
                                   className="card-img-top" src={image}/>
                        </div>
                    </Link>

                    <div className="card-body">
                        <h6 className="card-title">
                            {this.props.src.Name}
                        </h6>
                        <p className="card-text">
                            Authored by {(this.props.src.Author) ? this.props.src.Author : 'magic'}
                        </p>
                        {/*TODO: Reviews display*/}
                        <p>
                        </p>
                        {editButton}
                        <div className={"btn btn-danger"} onClick={this.deletionOpen}>
                            {this.props.personal ? 'Delete' : 'Remove'}
                        </div>

                    </div>

                </div>

                <Modal /*backdrop={'static'}*/ show={this.state.deletionModal} onHide={this.deletionClose}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.src.Name}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Are you sure you want to {this.props.personal ? 'delete' : 'remove'} this { this.props.personal ? 'personal' : 'saved' } recipe?
                        </p>
                        {personalAddendum}
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <div className={"btn btn-danger"} onClick={this.removeThis}>
                                {this.props.personal ? 'Delete' : 'Remove'}
                            </div>
                            <div className={"btn btn-light"} onClick={this.deletionClose}>
                                Cancel
                            </div>
                        </div>
                    </Modal.Footer>

                </Modal>
                <Modal bsSize={"large"} /*backdrop={'static'}*/ show={this.state.editModal} onHide={this.editClose}>
                    <Modal.Header>
                        <Modal.Title>
                            Editing recipe: "{this.props.src.Name}"
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {insertionForm}
                        </div>
                        {this.state.workingIngredientList}
                        <div>
                            {directionForm}
                        </div>
                        <div>
                            {durationAndDifficulty}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <div className={"btn btn-success"} onClick={this.editorSaveChanges}>
                                Save Changes
                            </div>
                            <div className={"btn btn-danger"} onClick={this.editClose}>
                                Discard Changes
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>


        );
    }
}


export default PreviewCard;