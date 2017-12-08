/**
 * Title: Util.js
 * Authors: Alexander Haggart
 * Date Created: 12/1/2017
 * Description: This file will provide utility functions for other classes
 */
import JSZip from 'jszip';

import DBClient from './AWSDatabaseClient'
import Autocomplete from './Autocomplete'

class Util{

}

Util.loadCompiledAutocompleteTree = function(treeName,id){
    let zip = new JSZip();
    //I lOvE aSyNc ChAiNiNg CoMpOsItIoN
    return DBClient.getClient().getDBItemPromise('Miscellaneous','Name',[treeName+'Tree']) //async
        .then((payload)=>payload[0].Data.B)
        .then((binary)=>zip.loadAsync(binary,{base64:true})) //more async
        .then((file)=>zip.file(treeName+'.tst').async('string')) //MORE ASYNC
        .then((json)=>new Autocomplete().loadJSON(json))
        .then((autocomplete)=>{console.log('Finished loading autocomplete in '+id);return autocomplete})
        .catch(console.error)
}

Util.parseQueryString = function(search){
    return search.substring(1)
        .split('&')
        .map((param)=>(param.split('=')))
        .map((splitParam)=>({[splitParam[0]]:splitParam[1]?splitParam[1].split(',').map((val)=>decodeURIComponent(val)):undefined}))
        .reduce((prev,item)=>Object.assign(item,prev),{})
}

Util.updateURI = function(history,base,fields){ //update the uri to encode some basic object
    history.replace('/'+base+'?'+Object.entries(fields).map((kvp)=>kvp[0]+'='+Array.from(kvp[1]).join(',')).join('&'));
}

Util.NonVegetarian = [
    "beef", "chicken","pork","fish",
];

export default Util;