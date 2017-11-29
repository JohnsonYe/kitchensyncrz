/**
 * Title: Planner.js
 * Authors: Alexander Haggart, Andrew Sanchez(backend implementation)
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature
 */
import DBClient from "./AWSDatabaseClient";
import User from './User';
import RecipeHelper from './RecipeHelper';

class PlannerHelper{

    constructor(){
        this.client = DBClient.getClient();
        this.recipes = new RecipeHelper();
        this.user = User.getUser(this.client.getUsername());

        //Access Meal Data data[dayOfWeek][mealIndex]
        this.mealData = []
        this.getMealData( (mealData) => this.mealData = mealData);

        //Methods
        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
    }

    addMeal(day, recipe, hr, min) {

    }

    removeMeal(day,recipe){
        //this.mealData[day].
    }

     /**
      * This function creates a meal object that could be added to one of the entries in mealData.
      * @param recipe - passing a in a recipe object will give us recipe name, duration, img link, and description (or index)
      * @param start - the time you plan to start cooking this meal
      * @return {recipe: *, startTime: *, endTime: *} a.k.a meal object
      */
     createMeal(day, recipe, startHr, startMin) {
         /**TODO Anything that has to do with recipes is subject to change since I'm not sure how define recipe objects
          */

         var hr = 0,
             endMin = 0,
             endHr = 0,
             total = 0,
             recipes = [];



         this.recipes.loadRecipe(recipe, (recipeData)=>{
             recipes.push(recipe);

             total = startMin + 0; //recipeData.TimeCost;

             hr = Math.floor(total/60);

             endMin = total - (hr)*(60);
             endHr = startHr + hr;

             //check if hr passed to the next day
             if( endHr >= 24) {
                 endHr = (24 - endHr) * (-1);  //converts to correct time
             }

             var meal = {
                 recipes: recipes,
                 startHr: startHr ,
                 startMin: startMin,
                 endHr: endHr,
                 endMin: endMin
             };

             //create a meal
             this.mealData.days[day].mealData.push(meal);
             alert(JSON.stringify(this.mealData))
             //push that meal into the correct spot in mealData
             this.pushMealData();
             //call pushMealData

         });
     }

     /**
      * This function will retrieve the users mealData array that is currently in the DataBase
      * @returns [] Array of meal
      */
     getMealData(callback) {
         return this.user.getUserData('planner').then((e)=>{alert(JSON.stringify(e));callback(e)});
     }

     /**
      * Pushes the local mealData containing changes user made to Database
      */
     pushMealData() {
         this.client.updateItem(
             this.client.buildUpdateRequest(
                 'User','username',this.client.getUsername(),
                 this.client.buildSetUpdateExpression('planner', {M:DBClient.getClient().packItem(this.mealData, User.PlannerPrototype)})),
             (response)=>{alert(JSON.stringify(response.payload))})
     }
}

 export default PlannerHelper;