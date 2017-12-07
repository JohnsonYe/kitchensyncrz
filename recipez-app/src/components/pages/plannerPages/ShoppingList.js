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
        if(e.propertyName === 'margin-left'){
            if(this.state.buying === name){
                this.buyShoppingListItem(name);
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
        if(name == '---'){
            return;
        }
        return (
            <div className='input-group input-group-sm spaced' key={name} style={this.getListItemStyle(name)} onTransitionEnd={this.getHandleTransition(name)}>
                <span className='input-group-btn'>
                        <button type='button' className='btn btn-success btn-group-end' onClick={(e)=>this.setState({buying:name})} >{this.getGlyph('ok')}</button>
                </span>
                <div className='form-control'>{name}</div>
                <span className='input-group-btn'>
                        <button type='button' className='btn btn-danger' onClick={(e)=>this.setState({removing:name})}>{this.getGlyph('remove')}</button>
                </span>
            </div>
        )
    }

    getListItemStyle(name){
        return {
            marginLeft:(name===this.state.removing?'150%':(name===this.state.buying?'-150%':0)),
            // 'margin-left': (name===this.state.buying?'-150%':0),
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