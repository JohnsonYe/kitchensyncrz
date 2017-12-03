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

        this.state = {
            shoppingList:[],
        }

        this.updateList();


    }

    updateList(){
        User.getUser().getShoppingList((list)=>this.setState({shoppingList:Array.from(list)}))
    }

    removeShoppingListItem(name,callback){
        User.getUser().removeFromShoppingList(name,callback);
    }

    buyShoppingListItem(name){
        this.removeShoppingListItem(name,()=>{
            User.getUser().addToPantry(name,'from shopping list',0);
            this.updateList();
        })
    }

    getGlyph(type){
        return (<span className={'glyphicon glyphicon-'+type}/>);
    }

    getListItem(name){
        return (
            <div className='input-group input-group-sm spaced' key={name}>
                <span className='input-group-btn'>
                        <button type='button' className='btn btn-success btn-group-end' onClick={(e)=>this.buyShoppingListItem(name)} >{this.getGlyph('ok')}</button>
                </span>
                <div className='form-control'>{name}</div>
                <span className='input-group-btn'>
                        <button type='button' className='btn btn-danger' onClick={(e)=>this.removeShoppingListItem(name,this.updateList)}>{this.getGlyph('remove')}</button>
                </span>
            </div>
        )
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