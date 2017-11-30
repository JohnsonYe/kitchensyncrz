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

    /**
     * [addIngredient description]
     * @param {[type]}   ingredient [description]
     * @param {[type]}   search     [description]
     * @param {Function} callback   [description]
     */
    updateIngredient(ingredient,search,callback){
        this.ingredientMap = //push another link to the chain to update the status of the ingredient map
            this.ingredientMap.then((map)=>{ //load the new ingredient if necessary
                if(!map.has(ingredient)){ //update the map if the ingredient isnt in it or we are removing it
                    return (this.client.getDBItemPromise('Ingredients','Name',[ingredient])
                        .then((payload)=>map.set(ingredient,[search,payload[0],true]))//put the retrieved info in the map
                        .then((map2)=>this.updateResultList(map2,ingredient,callback))
                        .catch((err)=>map)//invalid DB key? ignore it (for now?)
                    )
                } else if(search == 1 && !map.get(ingredient)[2]){
                    return this.updateResultList(map.set(ingredient,[search,map.get(ingredient)[1],true]),ingredient,callback)                    
                } else if(search!=1){ //use the value in the map to complete the action
                    return this.updateResultList(map.set(ingredient,[search,map.get(ingredient)[1],map.get(ingredient)[2]&&search!=-1]),ingredient,callback)
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

    updateResultList(map,ingredient,callback){
        let updateType = map.get(ingredient)[0];
        if(updateType==1||updateType==-1){ //use ingredient in search
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
            this.sortRecipeMap(callback)
        } else { //reject or un-reject ingredient from search
            let adjustment = (updateType==0)?1:-1;
            map.get(ingredient)[1].recipes.L.forEach((recipe)=>{
                let prevEntry = this.recipeMap.has(ingredient)?this.recipeMap.get(recipe.M.Name.S):[0,0,0]; //set base values to 0 if no entry exists
                //increment the rejection score by one
                this.recipeMap.set(recipe.M.Name.S,[prevEntry[0]+adjustment,prevEntry[1],prevEntry[2]])
            })
            //this should only get called from a Promise chain
            //branch the chain into the supplied callback
            this.sortRecipeMap(callback)
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