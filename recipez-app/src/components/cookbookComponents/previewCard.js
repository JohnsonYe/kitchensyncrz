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

class PreviewCard extends Component{


    constructor(props) {
        super(props);
        this.state = {
            removeFunc: props.removeFunc,
            card_key: props.card_key,
            description: props.description,
        };

        this.removeThis = this.removeThis.bind(this);

    }

    removeThis(){
            this.state.removeFunc(this.state.card_key);
    }

    render() {
        return (
            <div className={"col-md-2"}>
                <div className="card recipes">
                    <img className="card-img-top" src={this.props.src} alt="Food"/>

                    <div className="card-body">
                        <h6 className="card-title">

                        </h6>
                        <p className="card-text">
                            Description {this.state.description}
                        </p>
                        <div className="btn btn-primary">
                            Edit
                        </div>
                        <div className={"btn btn-warning"} onClick={this.removeThis}>
                            Delete {this.state.card_key}
                        </div>
                    </div>

                </div>
            </div>


        );
    }
}

export default PreviewCard;