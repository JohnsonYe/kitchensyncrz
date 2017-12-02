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
        // 
        this.timeFilter = this.timeFilter.bind(this);
        this.difficultyFilter = this.difficultyFilter.bind(this);
        this.ratingFilter = this.ratingFilter.bind(this);

        this.shouldReset = false
        this.recipeMap = new Map()

        this.ingredientMap = Promise.resolve(new Map());

        let zip = new JSZip();
        //I lOvE aSyNc ChAiNiNg CoMpOsItIoN
        this.asyncCompletions = this.client.getDBItemPromise('Miscellaneous','Name',['IngredientsTree']) //async
            .then((payload)=>payload[0].Data.B)
            .then((binary)=>zip.loadAsync(binary,{base64:true})) //more async
            .then((file)=>zip.file('Ingredients.tst').async('string')) //MORE ASYNC
            .then((json)=>new Autocomplete().loadJSON(json))
            .then((autocomplete)=>{console.log('Finished loading autocomplete in searchbar: ');return autocomplete})
            // .catch((err)=>err)
    }

    hasIngredient(ingredient){
        return this.ingredientMap.then((map)=>map.get(ingredient))
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
                            map.set(ingredient.Name,[5,ingredient,UNUSED_STATUS]);
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
    updateIngredient(ingredient,search,callbacks,nosort){
        let {successCallback,outputCallback,failureCallback} = {...callbacks};
        
        let process_ingredient_fn = (ingredientObject)=>{
            if(outputCallback){
                outputCallback(ingredientObject);
            }
            return ingredientObject; // pass the object along to the next link
        };

        let add_to_map_fn = (ingredientObject,ingredientMap)=>{
            return ingredientMap.set(ingredientObject.Name,[search,ingredientObject,UNUSED_STATUS]);
        };

        let get_add_to_map_fn = (ingredientMap)=>{
            return ((ingredientObj)=>add_to_map_fn(ingredientObj,ingredientMap));
        };

        let update_result_list_fn = (recipeMap)=>{
            return this.updateResultList(recipeMap,ingredient,successCallback,nosort);
        };

        let failed_to_load_fn = (err,ingredientMap)=>{
            console.error('Error loading ingredient: '+ err)
            if(failureCallback){
                failureCallback(ingredient);
            }
            return ingredientMap;
        };

        let get_failed_to_load_fn = (ingredientMap)=>{
            return (err)=>failed_to_load_fn(err,ingredientMap);
        };

        this.ingredientMap = //push another link to the chain to update the status of the ingredient map
            this.ingredientMap.then((ingredientMap)=>{ //load the new ingredient if necessary
                if(!ingredientMap.has(ingredient)){ //update the map if the ingredient isnt in it or we are removing it
                    console.log('Loading ingredient: '+ingredient)
                    return (this.client.getDBItemPromise('Ingredients','Name',[ingredient])
                        //info format: [query type,object,status]
                        //status codes: 0 -- excluded
                        //              1 -- added
                        //              3 -- unused
                        .then((payload)=>this.client.unpackItem(payload[0],RecipeHelper.IngredientPrototype))
                        // .then((ingredientObject)=>{alert(JSON.stringify(ingredientObject));return ingredientObject})
                        .then( process_ingredient_fn )
                        .then( get_add_to_map_fn(ingredientMap) )//put the retrieved info in the map
                        .then( update_result_list_fn )
                        .catch( get_failed_to_load_fn(ingredientMap) )//invalid DB key? fail quietly so the chain stays alive
                    )
                } else {
                    return this.updateResultList(ingredientMap.set(ingredient,[search,ingredientMap.get(ingredient)[1],ingredientMap.get(ingredient)[2]]),ingredient,successCallback,nosort) 
                }                   
                //since this ingredient is already in the map, dont modify the map or fire the callback
                //callers should not rely on this method to use the callback for any given set of arguments
                return ingredientMap
            })

    }

    /**
     * RECIPE ENTRY FORMAT:
     * [rejection score,raw score,importance score]
     */

    updateResultList(map,ingredient,callback,nosort){
        let updateType = map.get(ingredient)[0];
        let status = map.get(ingredient)[2];
        if(updateType==ADD_TO_SEARCH||updateType==REMOVE_FROM_SEARCH){ //use ingredient in search
            if((updateType==ADD_TO_SEARCH&&status!=UNUSED_STATUS)||(updateType==REMOVE_FROM_SEARCH&&status!=INCLUDED_STATUS)){ //query doesn't fit the current status, reject it and do nothing
                return map;
            }
            map.get(ingredient)[2] = updateType==ADD_TO_SEARCH?INCLUDED_STATUS:UNUSED_STATUS;
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
        } else if(updateType==ADD_TO_EXCLUDE||updateType==REMOVE_FROM_EXCLUDE){ //reject or un-reject ingredient from search
            if((updateType==ADD_TO_EXCLUDE&&status!=UNUSED_STATUS)||(updateType==REMOVE_FROM_EXCLUDE&&status!=EXCLUDED_STATUS)){ //query doesn't fit the current status, reject it and do nothing
                return map;
            }
            map.get(ingredient)[2] = updateType==REMOVE_FROM_EXCLUDE?UNUSED_STATUS:EXCLUDED_STATUS;
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

    getRecipeList(){
        return Array.from(this.recipeMap.entries());
    }

    sortRecipeMap(callback){
        console.log('Sorting recipe map . . .')
        this.sorted = this.getRecipeList();
        return Promise.resolve(this.sorted) //use a promise to account for potential asynchronous sort
            .then((sorted)=>sorted.filter((entry)=>(entry[1][0]==0)&&(entry[1][1]!=0))) //filter rejected items
            .then(this.currentFilter) //apply filter -- may be asynchronous --> promise chain handles this gracefully
            .then(callback);
    }

    clear(callback){ //zero out the ingredient map and recipe map (without clearing it) 
        this.ingredientMap = this.ingredientMap.then((ingredients)=>{
            ingredients.forEach((value,key,map)=>{
                map.get(key)[2] = UNUSED_STATUS;
            })
            return ingredients;
        })
        this.recipeMap.forEach((value,key,map)=>{
            map.set(key,[0,0,0])
        });
        this.sortRecipeMap(callback)
    }

    /**
     * set this helper's "loader", which is a promise containing recipe information for more intensive searching
     * @param {[type]} loader [description]
     */
    setRecipeLoaderSource(loaderSource){
        this.recipeLoaderSource = loaderSource;
    }

    setFilter(filter,callback,nosort){
        this.currentFilter = this.getFilter(filter);
        if(nosort){
            return;
        }
        this.sortRecipeMap(callback);
    }

    useAsyncLoader(filter,method){
        if(this.recipeLoaderSource){
            return ((unsorted)=>{
                return this.recipeLoaderSource().then((recipes)=>method(unsorted,recipes))
            })
        } else {
            console.error('Loader not set when setting filter: ' + filter)
            return this.useSynchronous((a,b)=>true); //return a no-sort object so we dont crash and burn
        }
    }

    useSynchronous(syncSorter){
        return ((unsorted)=>unsorted.sort(syncSorter))
    }

    /*
     * recipe map organization:
     * [
     *     0: recipe name,
     *     1: [
     *             0: rejection score,
     *             1: raw score,
     *             2: importance score,
     *        ]
     * ]
     * 
     */
    getFilter(filter){
        switch(filter){
            case 'least_additional':
                console.log('Set filter type to: ' + filter)
                return this.useSynchronous((a,b)=>(b[1][2]-a[1][2])); //compare importance scores
            case 'best_match':
                console.log('Set filter type to: ' + filter)
                return this.useSynchronous((a,b)=>(b[1][1]-a[1][1])); //compare raw scores
            case 'difficulty_filter':
                console.log('Set filter type to: ' + filter)
                return this.useAsyncLoader(filter,this.difficultyFilter)                
            case 'time_filter':
                console.log('Set filter type to: ' + filter)
                return this.useAsyncLoader(filter,this.timeFilter) 
            case 'rating_filter':
                console.log('Set filter type to: ' + filter)
                return this.useAsyncLoader(filter,this.ratingFilter) 
            case 'cost_filter':
            case 'cookware_filter':
            case 'custom':
            default:
                console.log('Set filter type to: default (given: ' + filter + ')')
                return this.useSynchronous((a,b)=>0); //this should probably be some combination of raw and importance scores
        }
    }

    ratingFilter(unsorted,recipes){
        return unsorted.sort((a,b)=>(RecipeHelper.getAvgRating(recipes.get(b[0])) - RecipeHelper.getAvgRating(recipes.get(a[0]))));        
    }

    timeFilter(unsorted,recipes){
        return unsorted.sort((a,b)=>(RecipeHelper.getPrepTime(recipes.get(a[0])) - RecipeHelper.getPrepTime(recipes.get(b[0]))));
    }

    difficultyFilter(unsorted,recipes){
        return unsorted.sort((a,b)=>{
            // console.log(this.evaluateDifficulty(recipes[a[0]]) + ' :: ' + this.evaluateDifficulty(recipes[b[0]]))
            return this.evaluateDifficulty(recipes.get(b[0]))-this.evaluateDifficulty(recipes.get(a[0]))
        });
    }

    evaluateDifficulty(recipe){
        return recipe?(recipe.Difficulty==='Easy'?1:(recipe.Difficulty==='Hard'?0:-1)):-2;
    }


    autocomplete(base,callback){
        this.asyncCompletions.then((auto)=>callback(auto.getCompletion(base))).catch((err)=>'Error when loading autocomplete')
    }
 }

 const ADD_TO_SEARCH = SearchHelper.ADD_TO_SEARCH = 1;
 const REMOVE_FROM_SEARCH = SearchHelper.REMOVE_FROM_SEARCH = -1;
 const ADD_TO_EXCLUDE = SearchHelper.ADD_TO_EXCLUDE = 0;
 const REMOVE_FROM_EXCLUDE = SearchHelper.REMOVE_FROM_EXCLUDE = 2;

 const UNUSED_STATUS = SearchHelper.UNUSED_STATUS = 3;
 const INCLUDED_STATUS = SearchHelper.INCLUDED_STATUS = 1;
 const EXCLUDED_STATUS = SearchHelper.EXCLUDED_STATUS = 0;

 export default SearchHelper;