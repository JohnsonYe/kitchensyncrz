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
            <div className='input-group form-list-spacer'>
                <input       className='form-control'
                             type={"text"}
                             value={this.state.quantity_unit}
                             placeholder={"Quantity"}
                             onChange={this.handleQuantityChange}>
                </input>
                <div className='input-group-addon'>{this.state.ingredient}</div>
                <input       className='form-control'
                             type={"text"}
                             value={this.state.additional}
                             placeholder={"chopped, diced, etc."}
                             onChange={this.handleAdditionalChange}
                >

                </input>
                <div className='input-group-btn'>
                    <div className={"btn btn-danger"} onClick={this.removeThis}>
                        <span className='glyphicon glyphicon-remove'/>
                    </div>
                </div>
            </div>
        );
    }

}

export default IngredientForm;