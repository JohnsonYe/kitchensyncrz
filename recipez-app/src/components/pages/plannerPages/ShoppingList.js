/**
 * Title: ShoppingList.js
 * Author: Alexander Haggart
 * Date Created: 12/2/2017
 * Description: Shopping List element
 */
import React,{Component} from 'react';
import User from '../../classes/User';

class ShoppingList extends Component{
    constructor(props){
        super(props);

        this.getGlyph = this.getGlyph.bind(this);
        this.getListItem = this.getListItem.bind(this);
        this.updateList = this.updateList.bind(this);
        this.removeShoppingListItem = this.removeShoppingListItem.bind(this);
        this.buyShoppingListItem = this.buyShoppingListItem.bind(this);
        this.handleTransition = this.handleTransition.bind(this);
        this.getHandleTransition = this.getHandleTransition.bind(this);

        this.state = {
            shoppingList:[],
        }

        this.updateList();


    }

    handleTransition(e,name){
        // console.log(e.propertyName)
        if(e.propertyName === 'opacity'){
            if(this.state.buying === name){
                this.buyShoppingListItem(name,this.state.category);
            }
            else if(this.state.removing === name){
                this.removeShoppingListItem(name,this.updateList);
            }
        }
    }

    getHandleTransition(name){
        return (e)=>this.handleTransition(e,name);
    }

    updateList(){
        User.getUser().getShoppingList((list)=>this.setState({shoppingList:Array.from(list),removing:undefined,buying:undefined}))
    }

    removeShoppingListItem(name,callback){ //remove an item from the shopping list
        User.getUser().removeFromShoppingList(name,callback);
    }

    buyShoppingListItem(name,category){ //remove an item from the shopping list, then add it to the pantry
        this.removeShoppingListItem(name,()=>{
            User.getUser().addToPantry(name,category,0);
            this.updateList();
        })
    }

    getGlyph(type){ //bootstrap glyphicon convenience function
        return (<span className={'glyphicon glyphicon-'+type}/>);
    }

    getListItem(name){ //generate an entry in the shopping list given a list item name
        if(name === '---'){
            return; //ignore the default object
        }
        let dropdownToggle = ((e)=>{ //dropdown toggler
            this.setState({active:(this.state.active===name?undefined:name)})
        })
        let categories = ['Protein','Dairy','Vegetable','Grain','Fruit','Other'];
        let getCategoryOption = ((cat)=>{ //generate a dropdown item that sets the appropriate state by category
            return (
                <div className='dropdown-item' onClick={(e)=>this.setState({buying:name,category:cat})}>
                    {cat}
                </div>
            );
        })
        return (
            <div className='input-group input-group-sm spaced' key={name} style={this.getListItemStyle(name)} onTransitionEnd={this.getHandleTransition(name)}>
                <div className={'input-group-btn'+(this.state.active===name&&!this.state.buying&&!this.state.removing?' open':'')}>
                    <div className='btn btn-success btn-group-end dropdown-toggle' onClick={dropdownToggle}>{this.getGlyph('ok')}</div>
                    <div className='dropdown-menu'>
                        {categories.map((category)=>getCategoryOption(category))}
                    </div>
                </div>
                <div className='form-control'>{name}</div>
                <div className='input-group-btn'>
                        <button type='button' className='btn btn-danger' onClick={(e)=>this.setState({removing:name})}>{this.getGlyph('remove')}</button>
                </div>
            </div>
        )
    }

    getListItemStyle(name){ //style a list item if its name matches the name in one of the transition states
        return {
            opacity:(name===this.state.removing||name===this.state.buying?0:1),
        };
    }

    render(){
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>{this.getGlyph('shopping-cart')} Shopping List</div>
                <div className='panel-body'>
                    {this.state.shoppingList.map((item)=>this.getListItem(item))}
                </div>
            </div>
        )
    }
}

export default ShoppingList;