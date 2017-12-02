/**
 * Title: Planner.js
 * Authors: Alexander Haggart, Andrew Sanchez(backend implementation)
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature.
 */
import DBClient from "./AWSDatabaseClient";
import User from './User';
import RecipeHelper from './RecipeHelper';

class PlannerHelper{

    constructor(updateCallback){
        this.client = DBClient.getClient();
        this.recipes = new RecipeHelper();
        this.user = User.getUser(this.client.getUsername());

        //Access Meal Data data.days[dayOfTheWeek].mealData[mealIndex]
        this.data = undefined;
        this.getMealData( (data) => {
            this.data = data;
            this.loaded = true;
            updateCallback();
        });
    }


    isLoaded() {
        return this.loaded;
    }

    removeMeal(day, mealIndex){
        this.data.days[day].mealData.splice(0,mealIndex);
        //push change to database
        this.pushMealData();
    }

    /** Insert meal into planner
     * @param day - tells what day to insert meal into
     * @param meal - meal object to be inserted
     * @return pass/fail 1 pass, -1 fail
     */
    insertMeal(meal, day) {
        // create an array of just the current days meals for easy access
        var meals = this.getDayMealList(day),
            mealIndex = 0;
        //if empty
        alert(JSON.stringify(meals));
        alert(JSON.stringify(meal));

        //if meals has not been instantiated
        if(meals.length == 0) {
            this.data.days[day].mealData.push(meal);
            this.pushMealData();
            return 1;
        }

        // Go through meals looking at each end times to ensure that this meals
        // start time is greater than meal before's end time.
        while (meal.startHr > meals[mealIndex].endHr &&
                meal.startMin > meals[mealIndex].endMin) {
            mealIndex++;
        }
        //if mealIndex is out of bound then add to the end
        if(mealIndex == meals.length) {
            this.data.days[day].mealData.push(meal);
            //push change to database
            this.pushMealData();
            return 1;
        }
        // Make sure this meals end time is less than meal afters start time (i.e. no overlap)
        else if ( meal.endHr < meal[mealIndex + 1].startHr &&
            meal.endMin < meal[mealIndex + 1].endMin ) {
            //insertMeal (index, remove, object to add)
            this.data.days[day].mealData.splice(mealIndex,0,meal);
            //push change to database
            this.pushMealData();
            return 1;
        }
        else return -1;  //overlap
    }
     /**
      * This function creates a meal object that could be added to one of the entries in mealData.
      * @param recipe - name of recipe for meal
      * @param startHr - start time of meal
      * @param startMin - start min of meal
      */
     createMeal(recipe, startHr, startMin, mealCallback) {

         var hr = 0,
             endMin = 0,
             endHr = 0,
             total = 0,
             recipes = [];

         this.recipes.loadRecipe(recipe, (recipeData,err)=>{
             if(!recipeData){
                 alert(err);
                 return;
             }
             recipes.push(recipe);
             total = startMin + parseInt(recipeData.TimeCost);
             hr = Math.floor(total/60);
             endMin = total - (hr)*(60);
             endHr = startHr + hr;

             //check if hr passed to the next day
             if( endHr >= 24) {
                 endHr = (24 - endHr) * (-1);  //converts to correct time
             }

             //create meal object
             var meal = {
                 recipes: recipes,
                 startHr: startHr ,
                 startMin: startMin,
                 endHr: endHr,
                 endMin: endMin
             };

             mealCallback(meal);
         });
     }
     /** Gives the an array of meals for that day
      * @param day - day you want the meal list of*/
     getDayMealList(day) {
         //alert(JSON.stringify(this.data));
         return this.data.days[day].mealData;
     }

     /** Give an meal object
      * @param day - day the meal wanted is in
      * @param mealIndex - index of the meal you want
      */
     getMeal(day, mealIndex) {
         return this.data.days[day].mealData[mealIndex];
     }


     getMealRecipeName(day, mealIndex){
         //alert(JSON.stringify(this.data.days));
         if(this.data.days[day].mealData[mealIndex].recipes) {
             return this.data.days[day].mealData[mealIndex].recipes[0];

         }else return "Unavailable";
     }

     /** Gives meals start time startHr: startMin
      * @param day - day the meal wanted is in
      * @param mealIndex - index of the meal you want
      */
     getMealStartTime(day, mealIndex) {

         var hour = this.data.days[day].mealData[mealIndex].startHr,
             min = this.data.days[day].mealData[mealIndex].startMin,
             noon = "am";
         if(hour && min) {
             if(hour == 12) {
                 noon = "pm";
             }
             if(hour > 12) {
                 hour = (12 - hour)*(-1);
                 noon = "pm"
             }
             return hour + ":" + min + " " + noon ;
         }
         else return "Unavailable";
     }

    /** Gives meals end time startHr: startMin
     * @param day - day the meal wanted is in
     * @param mealIndex - index of the meal you want
     */
     getMealEndTime(day, mealIndex) {
        var hour = this.data.days[day].mealData[mealIndex].endHr,
            min = this.data.days[day].mealData[mealIndex].endMin,
            noon = "am";
        if(hour && min) {
            if(hour == 12) {
                noon = "pm";
            }
            if(hour > 12) {
                hour = (12 - hour)*(-1);
                noon = "pm"
            }
            return hour + ":" + min + " " + noon ;
        }
        else return "Unavailable";
     }
     /** This function retrieves the number of meeals for a specified day*/
     getNumMeals(day){
         if(this.data.days[day].mealData.length)
             return this.data.days[day].mealData.length;
         else return 0;
     }

     /**
      * This function will retrieve the users mealData array that is currently in the DataBase
      * @returns [] Array of meal
      */
     getMealData(callback) {
         return this.user.getUserData('planner').then((e)=>{//alert(JSON.stringify(e));
         callback(e)});
     }

     /**
      * Pushes the local mealData containing changes user made to Database
      */
     pushMealData() {
         this.client.updateItem(
             this.client.buildUpdateRequest(
                 'User','username',this.client.getUsername(),
                 this.client.buildSetUpdateExpression('planner', {M:DBClient.getClient().packItem(this.data, User.PlannerPrototype)})),
             (response)=>{JSON.stringify(response.payload)})
     }
}

 export default PlannerHelper;