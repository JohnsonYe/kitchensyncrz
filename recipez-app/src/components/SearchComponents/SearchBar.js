/**
 * Title: SearchBar.js
 * Author: Alexander Haggart
 * Date Created: 11/18/2017
 * Description: modular searchbar component that provides autocomplete in a dropdown menu
 */
import React, {Component} from 'react';
import Autocomplete from '../classes/Autocomplete'

class SearchBar extends Component{
    constructor(props){
        super(props)

        this.state = {
            query:'',
            completions:[],
            listOpen:false,
            value:'',
            selection:-1,
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
        this.selectCompletion = this.selectCompletion.bind(this);

        this.getSearchHighlight = this.getSearchHighlight.bind(this);

        this.getCounter = this.getCounter.bind(this);
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
        // this.props.callback(this.state.completions[0])
        this.setState({completions:[],query:''})
    }

    selectCompletion(completion){
        this.setState({
            value:completion,
            selection:-1,
        // },e=>this.props.form.submit())
        })
    }

    handleChange(e){
        // alert(e.target.value)
        // this.props.callback(e.target.value)
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
                if(this.state.selection >= 0)
                    e.stopPropagation();
                    this.selectCompletion(this.state.completions[this.state.selection])
                break;
            case 40/*DOWN*/:
                this.setState({selection:this.state.selection+1})
                break;
            case 38/*UP*/:
                this.setState({selection:Math.max(this.state.selection-1,-1)})
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

    reset(){
        this.setState({value:'',completions:[],shiftDown:false})
    }

    /**
     * [return a classname which reflects the current status of the searchbar]
     * @return {String} [validation states: success->user will add ingredient to search
     *                                      error  ->user will exclude ingredient from search]
     */
    getSearchHighlight(){
        return (this.state.value&&this.state.value.length?(this.state.shiftDown?'has-error':'has-success'):'')
    }

    getValue(){
        return this.state.value
    }

    getStatus(){
        return this.state.shiftDown?0:1;
    }

    getCounter(){
        var i = 0;
        return (function(){
            return i++;
        })
    }

    render(){

        var options = {selectHintOnEnter:true,minLength:1,submitFormOnEnter:true,highlightOnlyResult:true}
        var counter = this.getCounter();
        // <Typeahead {...options} placeholder='Enter ingredients or recipes' options={this.state.completions} emptyLabel=''/>
        // <Autosuggest datalist={['egg','bacon','crossaint']} placeholder='Enter ingredients . . . '/>        
        return(
            <div className={this.getSearchHighlight()+" positioned-searchbar-container "+(this.state.completions.length?'open':'closed')}>
                {/*<input className="form-control" style={{'z-index':-10000,'position':'absolute','pointer-events':'none'}} value='dddddddddddddddddddddddddddddddddddddd'/>*/}
                <input 
                    name="search"
                    id="ingredient" 
                    type="text" 
                    data-toggle="dropdown" 
                    className="form-control search-adjust search-form-overlay" 
                    placeholder="Enter ingredients or recipes . . ." 
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    autoComplete="off"
                    autoFocus="on"
                    value={(this.state.selection>=0?this.state.completions[this.state.selection]:this.state.value)}
                    // style={{'z-index':1,'position':'relative'}}
                    />
                <div className="dropdown-menu">
                    {this.state.completions.map((key)=>(
                        <div className={'dropdown-item'+(counter()==this.state.selection?' active':'')} onClick={(e)=>{}}>
                            {key}
                        </div>))}
                </div>
            </div>
            );
    }

}

SearchBar.InternalClient = class{
    constructor(keyList){
        this.autocomplete = new Autocomplete().loadList(keyList);
    }

    autocomplete(base,callback){
        callback(this.autocomplete.getCompletion(base));
    }
}

export default SearchBar;