/**
 * Title: SearchBar.js
 * Author: Alexander Haggart
 * Date Created: 11/18/2017
 * Description: modular searchbar component that provides autocomplete in a dropdown menu
 */
import React, {Component} from 'react';
import {Typeahead} from 'react-typeahead';
import Autosuggest from 'react-bootstrap-autosuggest';

class SearchBar extends Component{
    constructor(props){
        super(props)

        this.state = {
            query:'',
            completions:[],
            listOpen:false,
        }

        this.shouldClear = this.props.clear;

        this.autocomplete = this.autocomplete.bind(this);
        this.textEntry = this.textEntry.bind(this);
        this.focusHiddenForm = this.focusHiddenForm.bind(this);
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.reset = this.reset.bind(this);

        this.getSearchHighlight = this.getSearchHighlight.bind(this);
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
    // alert(JSON.stringify(completions))
       this.setState({completions:completions})
    }

    addItem(e){
        e.preventDefault()
        this.props.callback(this.state.completions[0])
        this.setState({completions:[],query:''})
    }

    handleChange(e){
        // alert(e.target.value)
        this.props.callback(e.target.value)
        this.setState({value:e.target.value})
        if(e.target.value.length>0){
            this.props.client.autocomplete(e.target.value,this.autocomplete)
        } else {
            this.setState({completions:[]})
        }  
    }

    handleKeyDown(e){
        switch(e.keyCode){
            case 16/*SHIFT*/:
                this.setState({shiftDown:true})
                break;
            case 13/*ENTER*/:
                break;
            case 40/*DOWN*/:
                break;
            case 38/*UP*/:
                break;

        }
    }

    handleKeyUp(e){
        switch(e.keyCode){
            case 16/*SHIFT*/:
                this.setState({shiftDown:false})
                break;
        }
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

    reset(){
        this.setState({value:'',completions:[]})
    }

    /**
     * [return a classname which reflects the current status of the searchbar]
     * @return {String} [validation states: success->user will add ingredient to search
     *                                      error  ->user will exclude ingredient from search]
     */
    getSearchHighlight(){
        return (this.state.value&&this.state.value.length?(this.state.shiftDown?'has-error':'has-success'):'')
    }

    render(){

        var options = {selectHintOnEnter:true,minLength:1,submitFormOnEnter:true,highlightOnlyResult:true}
        // <Typeahead {...options} placeholder='Enter ingredients or recipes' options={this.state.completions} emptyLabel=''/>
        // <Autosuggest datalist={['egg','bacon','crossaint']} placeholder='Enter ingredients . . . '/>        
        return(
            <div className={this.getSearchHighlight()+" "+(this.state.completions.length?'open':'closed')}>
                <input 
                    id="ingredient" 
                    type="text" 
                    data-toggle="dropdown" 
                    className="form-control search-adjust" 
                    placeholder="Enter ingredients or recipes . . ." 
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    autocomplete="off"
                    autofocus="on"
                    value={this.state.value}
                    />
                <div class="dropdown-menu">
                    {this.state.completions.map((key)=>(<div className='dropdown-item'>{key}</div>))}
                </div>
            </div>
            );
    }

}

export default SearchBar;