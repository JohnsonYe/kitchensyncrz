/**
 * Title: SearchHelper.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will handle search functionality through the DBClient
 */
import DBClient from "./AWSDatabaseClient"
import RecipeHelper from "./RecipeHelper"
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
            .then((autocomplete)=>{console.log('Finished loading autocomplete in searchbar: ');return autocomplete})
            // .catch((err)=>err)
    }

    batchLoadIngredients(ingredients){
        //use DBClient batch request
        console.log('Loading ingredient batch: '+JSON.stringify(ingredients))
        this.ingredientMap = this.ingredientMap.then((map)=>{
        return this.client.getDBItemPromise('Ingredients','Name',ingredients)
                    .catch((err)=>{console.error(err);throw new Error(err)})//keep the map chain alive even if we error
                    .then((payload)=>{
                        payload.map((ingredient)=>this.client.unpackItem(ingredient,RecipeHelper.IngredientPrototype))
                        .forEach((ingredient)=>{
                            map.set(ingredient.Name,[5,ingredient,3]);
                            // alert(JSON.stringify(map));
                        });
                        return map
                    })
                    .catch((err)=>{console.error(err);return map})//keep the map chain alive even if we error
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
                    console.log('Loading ingredient: '+ingredient)
                    return (this.client.getDBItemPromise('Ingredients','Name',[ingredient])
                        //info format: [query type,object,status]
                        //status codes: 0 -- excluded
                        //              1 -- added
                        //              3 -- unused
                        .then((payload)=>this.client.unpackItem(payload[0],RecipeHelper.IngredientPrototype))
                        // .then((ingredientObject)=>{alert(JSON.stringify(ingredientObject));return ingredientObject})
                        .then((ingredientObject)=>map.set(ingredientObject.Name,[search,ingredientObject,3]))//put the retrieved info in the map
                        .then((map2)=>this.updateResultList(map2,ingredient,callback,nosort))
                        .catch((err)=>{console.error(err);return map})//invalid DB key? fail quietly so the chain stays alive
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
     * [rejection score,raw score,importance score]
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
            map.get(ingredient)[1].recipes.forEach((recipe)=>{
                let recipeName = recipe.Name
                if(!recipeTracker.has(recipeName)){
                    recipeTracker.add(recipeName)
                    let prevEntry = this.recipeMap.has(recipeName)?this.recipeMap.get(recipeName):[0,0,0]; //set base values to 0 if no entry exists
                    this.recipeMap.set(recipeName,[
                        prevEntry[0],
                        prevEntry[1]+updateType,
                        prevEntry[2]+updateType*(+recipe.Importance)
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
            map.get(ingredient)[1].recipes.forEach((recipe)=>{
                let prevEntry = this.recipeMap.has(recipe.Name)?this.recipeMap.get(recipe.Name):[0,0,0]; //set base values to 0 if no entry exists
                //increment the rejection score by one
                this.recipeMap.set(recipe.Name,[prevEntry[0]+adjustment,prevEntry[1],prevEntry[2]])
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
            console.error('Incorrect query code found when updating recipe map: '+updateType)
        }
        return map //keep the chain alive
    }

    sortRecipeMap(callback){
        console.log('Sorting recipe map . . .')
        callback(this.sorted = Array.from(this.recipeMap.entries())
            .sort(this.currentFilter) //sort by selected filter
            .filter((entry)=>(entry[1][0]==0)&&(entry[1][1]!=0)) //remove rejected items (items with positive rejection score)
        )
    }

    setFilter(filter,callback,nosort){
        this.currentFilter = this.getFilter(filter);
        if(nosort){
            return;
        }
        this.sortRecipeMap(callback);
    }

    getFilter(filter){
        switch(filter){
            case 'least_additional':
                console.log('Set filter type to: ' + filter)
                return ((a,b)=>(b[1][2]-a[1][2])); //compare importance scores
            case 'best_match':
                console.log('Set filter type to: ' + filter)
                return ((a,b)=>(b[1][1]-a[1][1])); //compare raw scores
            //THESE NEED INFO FROM A RECIPE OBJECT -- HOW SHOULD WE GET IT (efficiently)?
            case 'time_filter':
            case 'cost_filter':
            case 'rating_filter':
            case 'difficulty_filter':
            case 'cookware_filter':
            case 'custom':
            default:
                console.log('Set filter type to: none')
                return ((a,b)=>true);
        }
    }

    autocomplete(base,callback){
        this.asyncCompletions.then((auto)=>callback(auto.getCompletion(base))).catch((err)=>'Error when loading autocomplete')
    }
 }

 export default SearchHelper;