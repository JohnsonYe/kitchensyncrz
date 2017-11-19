/**
 * Title: SearchHelper.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will handle search functionality through the DBClient
 */
import DBClient from "./AWSDatabaseClient"
import Autocomplete from '../classes/Autocomplete';

 class SearchHelper {
    constructor(){
        this.client = DBClient.getClient()
        this.relevanceSearch = this.relevanceSearch.bind(this);
        this.unpackRecipeList = this.unpackRecipeList.bind(this);
        this.sortRecipes = this.sortRecipes.bind(this);
        this.ingredientSearch = this.ingredientSearch.bind(this);

        this.shouldReset = false
        this.recipeMap = null

        this.client.getDBItems('Miscellaneous','Name',['IngredientTree'],
            (response)=>{
                this.auto = new Autocomplete();
                this.auto.loadBinary(response.payload[0].Data.B)
            });

    }

    autocomplete(base,callback){
        this.auto.getCompletions(base,callback)
    }

    relevanceSearch(ingredients,target)
    {
        this.client.getDBItems('Ingredients','Name',ingredients,(response) => this.sortRecipes(response,target))
    }

    sortRecipes(response,target){
        this.unpackRecipeList(response)
        var sorted = Object.entries(this.recipeMap).sort((a,b) => (b[1]-a[1])).map(e => e[0]);
        // alert(JSON.stringify(sorted));
        target({status:true,payload:sorted})
    }

    unpackRecipeList(response) {
        if(!this.recipeMap || this.shouldReset){
            this.recipeMap = new Map()
        }
        if(!response.status)
            return this.recipeMap
        response.payload.forEach((ingredient) =>
            ingredient.recipes.L.forEach(function(recipe) {
                if(this.recipeMap[ recipe.M.Name.S] ){
                    this.recipeMap[ recipe.M.Name.S ] += +recipe.M.Importance.N;
                } else {
                    this.recipeMap[ recipe.M.Name.S ]  = +recipe.M.Importance.N;
                }
            }.bind(this))
        )
        return this.recipeMap
    }

    /*
     * Retrieve a DB entries for a list of ingredient names
     *
     * [string] ingredients: list of ingredient names to use as DB keys
     * handle target: function handle to send items to
     */
    ingredientSearch(ingredients,target) {
        this.client.getDBItems('Ingredients','Name',ingredients,target)
    }

    /*
     * Retrieve a DB entries for a list of recipe names
     *
     * [string] recipes: list of recipe names to use as DB keys
     * handle target: function handle to send items to
     */
    recipeSearch(recipes,target) {
        this.client.getDBItems('Recipes','Name',recipes,target)
    }
 }

 export default SearchHelper;