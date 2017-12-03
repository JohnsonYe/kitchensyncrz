import React, {Component} from 'react';
import {FormGroup, FormControl} from 'react-bootstrap';

class IngredientForm extends Component {

    constructor(props) {
        super(props);

        let split = props.ingredient.split('\u180e');

        this.state = {
            quantity_unit: split[0],
            ingredient: split[1],
            additional: split[2],
        };

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleAdditionalChange = this.handleAdditionalChange.bind(this);
        this.removeThis = this.removeThis.bind(this);
        this.getFullString = this.getFullString.bind(this);

    }

    getFullString() {
        return this.state.quantity_unit + "\u180e " + this.state.ingredient + " \u180e" + this.state.additional;
    }

    handleQuantityChange(e) {
        this.setState({
            quantity_unit: e.target.value,
        });
    }

    handleAdditionalChange(e) {
        this.setState({
            additional: e.target.value,
        });
    }

    removeThis() {
        this.props.removeFunc(this);
    }

    componentWillReceiveProps(nextProps) {
        let newSections = nextProps.ingredient.split("\u180e");
        this.setState({
            quantity_unit: newSections[0],
            ingredient: newSections[1],
            additional: newSections[2],
        });
    }

    render() {
        return (

            <div>
                <div className={"row"}>
                    <div className={"form-group col-md-3"}>
                        <FormControl type={"text"}
                                     value={this.state.quantity_unit}
                                     placeholder={"Quantity"}
                                     onChange={this.handleQuantityChange}>
                        </FormControl>
                    </div>
                    <div className={"col-md-3"} style={{'marginTop': '10px'}}>
                        {this.state.ingredient}
                    </div>
                    <div className={"form-group col-md-3"}>
                        <FormControl type={"text"}
                                     value={this.state.additional}
                                     placeHolder={"chopped, diced, etc."}
                                     onChange={this.handleAdditionalChange}
                        >

                        </FormControl>
                    </div>
                    <div className={"col-md-3"}>
                        <div className={"btn btn-danger pb-3"} onClick={this.removeThis}>
                            X
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default IngredientForm;