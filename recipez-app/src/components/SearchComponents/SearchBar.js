/**
 * Title: SearchBar.js
 * Author: Alexander Haggart
 * Date Created: 11/18/2017
 * Description: modular searchbar component that provides autocomplete in a dropdown menu
 */
import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import Autosuggest from 'react-bootstrap-autosuggest';

class SearchBar extends Component{
    constructor(props){
        super(props)

        this.state = {
            query:'',
            completions:[],
            listOpen:false
        }

        this.autocomplete = this.autocomplete.bind(this);
        this.textEntry = this.textEntry.bind(this);
        this.focusHiddenForm = this.focusHiddenForm.bind(this);
        this.addItem = this.addItem.bind(this);

        this.textEntry('')

    }

    focusHiddenForm(e){
        this.hiddenForm.focus()
    }
    textEntry(value){
        this.setState({query:value})
        if(value.length>-1){
            this.props.client.autocomplete(value,this.autocomplete)
        } else {
            this.setState({completions:[]})
        }        
    }

    autocomplete(completions){
    // alert(JSON.stringify(completions))
       this.setState({completions:completions})
    }

    addItem(e){
        e.preventDefault()
        this.props.callback(this.state.completions[0])
        this.setState({completions:[],query:''})
    }

    getOldSearchBar(){
        var promptContent = this.state.query.length?
                (<div className='search-text-entry'>
                    <span>{this.state.query}</span><span style={{color:'green'}}>{this.state.completions[0]?this.state.completions[0].substring(this.state.query.length):''}</span>
                </div>)
                :
                (<div className='search-text-entry'>
                    <div style={{'font-style':'italic',color:'lightgray'}}>Enter ingredients</div>
                </div>)
        return
        <div className='searchbar-base'>
            <div className='searchbar-container'>
                <form onSubmit={this.addItem}>
                    <input className='search-input' type='text' onChange={(e)=>this.textEntry(e.target.value)} ref={(input)=>this.hiddenForm=input} value={this.state.query}/>
                </form>
                <div className='search-overlay' onClick={this.focusHiddenForm}>
                    <div className='searchbar-contents-expand' open={this.state.listOpen} onClick={(e)=>this.setState({listOpen:true})}></div>
                    {promptContent}
                </div>
                <div className='autocomplete-result-container' open={this.state.completions.length > 0}>
                    {this.state.completions.map((c)=><div className='autocomplete-result'>{c}</div>)}
                </div>
            </div>
        </div>
    }

    render(){

        var options = {selectHintOnEnter:true,minLength:1,submitFormOnEnter:true,highlightOnlyResult:true}
        // <Typeahead {...options} placeholder='Enter ingredients or recipes' options={this.state.completions} emptyLabel=''/>
        // <Autosuggest datalist={['egg','bacon','crossaint']} placeholder='Enter ingredients . . . '/>        
        return(
            <Typeahead {...options} placeholder='Enter ingredients or recipes' options={this.state.completions} emptyLabel=''/>
            );
    }

}

export default SearchBar;