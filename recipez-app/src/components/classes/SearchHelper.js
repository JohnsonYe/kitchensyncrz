/**
 * Title: SearchHelper.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will handle search functionality through the DBClient
 */
import DBClient from "./AWSDatabaseClient"
import Autocomplete from '../classes/Autocomplete';
import JSZip from 'jszip'


 class SearchHelper {
    constructor(){
        this.client = DBClient.getClient()

        this.updateResultList = this.updateResultList.bind(this);
        this.updateIngredient = this.updateIngredient.bind(this);
        this.sortRecipeMap = this.sortRecipeMap.bind(this);
        // this.getCompletions = this.getCompletions.bind(this);

        this.shouldReset = false
        this.recipeMap = new Map()

        this.ingredientMap = Promise.resolve(new Map());

        let zip = new JSZip();
        //I lOvE aSyNc ChAiNiNg CoMpOsItIoN
        this.asyncCompletions = this.client.getDBItemPromise('Miscellaneous','Name',['IngredientTree']) //async
            .then((payload)=>payload[0].Data.B)
            .then((binary)=>zip.loadAsync(binary,{base64:true})) //more async
            .then((file)=>zip.file('Ingredient.tst').async('string')) //MORE ASYNC
            .then((json)=>new Autocomplete().loadJSON(json))
            // .catch((err)=>err)
    }

    batchLoadIngredients(ingredients){
        //use DBClient batch request
        this.ingredientMap = this.ingredientMap.then((map)=>{
        return this.client.getDBItemPromise('Ingredients','Name',ingredients)
                    .then((payload)=>{
                        payload.forEach((ingredient)=>{
                            map.set(ingredient.Name.S,[5,ingredient,3]);
                            // alert(JSON.stringify(map));
                        });
                        return map
                    })
                    .catch((err)=>{alert(err);return map})//keep the map chain alive even if we error
        })
    }

    /**
     * [update ingredients one at a time, use the batch loader for mass loading]
     * @param {[type]}   ingredient [description]
     * @param {[type]}   search     [description]
     * @param {Function} callback   [description]
     */
    updateIngredient(ingredient,search,callback,escape,nosort){
        this.ingredientMap = //push another link to the chain to update the status of the ingredient map
            this.ingredientMap.then((map)=>{ //load the new ingredient if necessary
                if(!map.has(ingredient)){ //update the map if the ingredient isnt in it or we are removing it
                    return (this.client.getDBItemPromise('Ingredients','Name',[ingredient])
                        //info format: [query type,object,status]
                        //status codes: 0 -- excluded
                        //              1 -- added
                        //              3 -- unused
                        .then((payload)=>map.set(ingredient,[search,payload[0],3]))//put the retrieved info in the map
                        .then((map2)=>this.updateResultList(map2,ingredient,callback,nosort))
                        .catch((err)=>map)//invalid DB key? ignore it (for now?)
                    )
                } else {
                    return this.updateResultList(map.set(ingredient,[search,map.get(ingredient)[1],map.get(ingredient)[2]]),ingredient,callback,nosort) 
                }                   
                //since this ingredient is already in the map, dont modify the map or fire the callback
                //callers should not rely on this method to use the callback for any given set of arguments
                return map
            })

    }

    /**
     * RECIPE ENTRY FORMAT:
     * [rejection score,raw score,scaled score]
     */

    updateResultList(map,ingredient,callback,nosort){
        let updateType = map.get(ingredient)[0];
        let status = map.get(ingredient)[2];
        if(updateType==1||updateType==-1){ //use ingredient in search
            if((updateType==1&&status!=3)||(updateType==-1&&status!=1)){ //query doesn't fit the current status, reject it and do nothing
                return map;
            }
            map.get(ingredient)[2] = updateType==1?1:3;
            let recipeTracker = new Set()
            map.get(ingredient)[1].recipes.L.forEach((recipe)=>{
                let recipeName = recipe.M.Name.S
                if(!recipeTracker.has(recipeName)){
                    recipeTracker.add(recipeName)
                    let prevEntry = this.recipeMap.has(recipeName)?this.recipeMap.get(recipeName):[0,0,0]; //set base values to 0 if no entry exists
                    this.recipeMap.set(recipeName,[
                        prevEntry[0],
                        prevEntry[1]+updateType,
                        prevEntry[2]+updateType*(+recipe.M.Importance.N)
                        ])
                }
            })
            //this should only get called from a Promise chain
            //branch the chain into the supplied callback
            if(!nosort){
                this.sortRecipeMap(callback)
            } else {
                callback(ingredient)
            }
        } else if(updateType==0||updateType==2){ //reject or un-reject ingredient from search
            if((updateType==0&&status!=3)||(updateType==2&&status!=0)){ //query doesn't fit the current status, reject it and do nothing
                return map;
            }
            map.get(ingredient)[2] = updateType==2?3:0;
            let adjustment = (updateType==0)?1:-1;
            map.get(ingredient)[1].recipes.L.forEach((recipe)=>{
                let prevEntry = this.recipeMap.has(recipe.M.Name.S)?this.recipeMap.get(recipe.M.Name.S):[0,0,0]; //set base values to 0 if no entry exists
                //increment the rejection score by one
                this.recipeMap.set(recipe.M.Name.S,[prevEntry[0]+adjustment,prevEntry[1],prevEntry[2]])
            })
            //this should only get called from a Promise chain
            //branch the chain into the supplied callback
            if(!nosort){
                this.sortRecipeMap(callback)
            } else {
                callback(ingredient)
            }
        } else {
            //well this is awkward
        }
        return map //keep the chain alive
    }

    sortRecipeMap(callback){
        callback(this.sorted = Array.from(this.recipeMap.entries())
            .sort((a,b)=>(b[1][2]-a[1][2])) //sort by scaled score first, may be changeable to raw score sort
            .filter((entry)=>(entry[1][0]==0)&&(entry[1][1]!=0)) //remove rejected items (items with positive rejection score)
        )
    }

    autocomplete(base,callback){
        this.asyncCompletions.then((auto)=>callback(auto.getCompletion(base))).catch((err)=>'Error when loading autocomplete')
    }
 }

 export default SearchHelper;