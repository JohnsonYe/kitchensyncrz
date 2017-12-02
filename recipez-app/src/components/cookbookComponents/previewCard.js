/**
 * File: previewCard.js
 * Author: Matthew Taylor
 *
 * Serves as the basic preview card, either for the saved recipes or for the personal recipes
 */

/**
 * TODO: Need to make it so you can pass a prop for the type (personal/saved) and dynamically determine which it will be
 */
import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {Link} from 'react-router-dom';
let noImg = require("./no-photo.png");

class PreviewCard extends Component{


    constructor(props) {
        super(props);
        this.noImg = require("./no-photo.png");
        this.state={
            modal: false,
            name: props.src.Name,
            reviews: props.src.Reviews,
            author: props.src.Author,
            difficulty: props.src.Difficulty,
            time: props.src.TimeCost,

        }
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
    }

    render() {
        return (
            <div className={"col-md-2"}>
                <div className="card recipes">
                    <Link to={'/Recipes/'+this.state.name}>

                        <img className="card-img-top" src={this.noImg} alt="Food"/>
                    </Link>

                    <div className="card-body">
                        <h6 className="card-title">
                            {this.state.name}
                        </h6>
                        <p className="card-text">
                            Authored by {(this.state.author) ? this.state.author : 'magic'}
                        </p>
                        {/*TODO: Reviews display*/}
                        <p>
                        </p>
                        <div className="btn btn-primary">
                            Edit
                        </div>
                        <div className={"btn btn-warning"} onClick={this.open}>
                            Delete
                        </div>
                    </div>

                </div>

                <Modal show={this.state.modal} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.state.name}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.body>
                        <p>
                            Are you sure you want to delete this personal recipe?
                        </p>
                        <p>
                            Once you delete a personal recipe, it cannot be undone.
                        </p>
                    </Modal.body>
                    <Modal.Footer>
                        <div className={"btn btn-danger"} onClick={this.close}>
                            Delete
                        </div>
                        <div className={"btn"} onClick={this.close}>
                            Cancel
                        </div>
                    </Modal.Footer>

                </Modal>
            </div>


        );
    }
}

export default PreviewCard;