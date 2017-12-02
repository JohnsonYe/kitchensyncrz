/**
 * File: previewCard.js
 * Author: Matthew Taylor
 *
 * Serves as the basic preview card, either for the saved recipes or for the personal recipes
 */

import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {Link} from 'react-router-dom';

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
        this.noImg = require("./no-photo.png");
        this.state={
            modal: false,

        };

        this.removeThis = this.removeThis.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

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

    removeThis(){
        this.close();
        this.props.removeFunc(this.props.src.Name);
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
                <div className="btn btn-primary">
                    Edit
                </div>
        }
        return (
            <div className={"col-md-3"}>
                <div className="card recipes">
                    <Link to={this.props.personal ? '/Recipes/'+this.props.src.Author+'/'+this.props.src.Name : '/Recipes/'+this.props.src.Name}>

                        <img className="card-img-top" src={this.noImg} alt="Food"/>
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
                        <div className={"btn btn-danger"} onClick={this.open}>
                            {this.props.personal ? 'Delete' : 'Remove'}
                        </div>
                    </div>

                </div>

                <Modal show={this.state.modal} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.Name}
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

export default PreviewCard;