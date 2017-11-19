/**
 * Title: SearchBar.js
 * Author: Alexander Haggart
 * Date Created: 11/18/2017
 * Description: modular searchbar component that provides autocomplete in a dropdown menu
 */
import React, { Component } from 'react';

class SearchBar extends Component{
    constructor(props){
        super(props)

        this.state = {
            query:'',
            completions:[]
        }

        this.autocomplete = this.autocomplete.bind(this);
        this.textEntry = this.textEntry.bind(this);
        this.focusHiddenForm = this.focusHiddenForm.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    focusHiddenForm(e){
        this.hiddenForm.focus()
    }

    textEntry(value){
        this.setState({query:value})
        if(value.length>0){
            this.props.client.autocomplete(value,this.autocomplete)
        } else {
            this.setState({completions:[]})
        }        
    }

    autocomplete(completions){
       this.setState({completions:completions})
    }

    addItem(e){
        e.preventDefault()
        this.props.callback(this.state.completions[0])
        this.setState({completions:[],query:''})
    }

    render(){
        return(
            <div className='searchbar-base'>
                <div className='searchbar-container'>
                    <form onSubmit={this.addItem}>
                        <input className='search-input' type='text' onChange={(e)=>this.textEntry(e.target.value)} ref={(input)=>this.hiddenForm=input} value={this.state.query}/>
                    </form>
                    <div className='search-overlay' onClick={this.focusHiddenForm}>
                        <span>{this.state.query}</span><span style={{color:'green'}}>{this.state.completions[0]?this.state.completions[0].substring(this.state.query.length):''}</span>
                    </div>
                    <div className='autocomplete-result-container'>
                        {this.state.completions.map((c)=><div className='autocomplete-result'>{c}</div>)}
                    </div>
                </div>
            </div>
            );
    }

}

export default SearchBar;