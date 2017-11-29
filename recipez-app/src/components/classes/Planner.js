/**
 * Title: Planner.js
 * Authors: Alexander Haggart, Andrew Sanchez(backend implementation)
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature
 */
import DBClient from "./AWSDatabaseClient";
import User from './User';

class PlannerHelper{
    constructor(){
        this.client = DBClient.getClient();
        this.user = User.getUser(this.client.getUsername());

        //Access Meal Data data[dayOfWeek][mealIndex]
        this.mealData = [
            [],  //Sun
            [],  //Mon
            [],  //Tue
            [],  //Wed
            [],  //Thur
            [],  //Fri
            []   //Sat
        ];


        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
        // this.addMeal('Monday.breakfast','chicken noodle soup',(e)=>alert(JSON.stringify(e.payload)));

    }

    addMeal(day,recipe,target){
    }


    removeMeal(day,recipe){

    }

     /**
      * This function creates a meal object that could be added to one of the entries in mealData.
      * @param recipe - passing a in a recipe object will give us recipe name, duration, img link, and description (or index)
      * @param start - the time you plan to start cooking this meal
      * @return {recipe: *, startTime: *, endTime: *} a.k.a meal object
      */
     createMeal(recipe, startHr, startMin) {

         /**TODO Anything that has to do with recipes is subject to change since I'm not sure how define recipe objects
          */

         var hr = 0,
             endMin = 0,
             endHr = 0,
             total = 0;

         total = startMin + recipe.duration;
         hr = Math.floor(total/60);

         endMin = total - (hr)*(60);
         endHr = startHr + hr;

         //check if hr passed to the next day
         if( endHr >= 24) {
             endHr = (24 - endHr)*(-1);  //converts to correct time
         }

         return {
             recipe: recipe,
             startHr: startHr ,
             startMin: startMin,
             endHr: endHr,
             endMin: endMin
         };
     }

     /**
      * This function will retrieve the users mealData array that is currently in the DataBase
      * @returns [] Array of meal
      */
     getMealData() {
         return this.user.getUserData('planner').then((e)=>alert(JSON.stringify(e)));
     }

     /**
      * Pushes the local mealData containing changes user made to Database
      */
     pushMealData() {
     }
    /**
     * Adds a meal to mealData in order. Order is determined by start hour of recipe. Overlapping meal times are not
     * allowed.
     * @param day - index of day where the meal should be added (recall order is ... [Sun, Mon, Tue ...])
     * @param mealObj - takes a meal object
     * @return error - if meal trying to be added overlaps with the time of meal in mealData
     */
    addMeal(day, mealObj){

        //update dataBase with changes
        this.pushMealData();
    }

    /**
     * Removes a meal from mealData according to the specified name of recipe or meal.
     * @param day - index of day in mealData
     * @param mealIndex -
     */
    removeMeal(day, mealIndex) {
        //update dataBase with changes
        this.pushMealData();
    }
}

 export default PlannerHelper;