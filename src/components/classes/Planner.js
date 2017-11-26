/**
 * Title: Planner.js
 * Authors: Alexander Haggart, Andrew Sanchez(backend implementation)
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature
 */
import DBClient from "./AWSDatabaseClient"

class PlannerHelper{
    constructor(){
        var now = new Date(); // Andrew added
        this.client = DBClient.getClient()
        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
        var mealData = [];
        // this.addMeal('Monday.breakfast','chicken noodle soup',(e)=>alert(JSON.stringify(e.payload)));
    }

    addMeal(day,recipe,target){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User','username',this.client.getUsername(),
                this.client.buildMapUpdateExpression('planner',day,{S:recipe})),
                this.client.pushResponseToHandle(target));

    }


    removeMeal(day,recipe){

    }

     /**TEST ============================================================================*/
     testMealData(){

         var recipe1 = {
                 name: "Spaghetti",
                 duration: 30,
                 link: "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/9/23/1/FNM_110114-Spaghetti-with-Pecan-Herb-Pesto-Recipe_s4x3.jpg.rend.hgtvcom.616.462.suffix/1412282745840.jpeg",
                 description: "I tell all my hoes ... rack it up"
             },
             recipe2 = {
                 name: "Booty",
                 duration: 120,
                 link: "http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png",
                 description: "Love is not just a verb"
             };

         var meal1 = this.createMeal(recipe1, 12, 30),
             meal2 = this.createMeal(recipe2, 2, 45);

         //Access Meal Data data[dayOfWeek][mealIndex]
         var data = [
             [],  //Sun
             [meal1, meal2],  //Mon
             [],  //Tue
             [],  //Wed
             [],  //Thur
             [],  //Fri
             []   //Sat
         ];

         return data;
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
     /** ======================================END OF TEST STUFF=======================================================*/

     /**
      * This function will retrieve the users mealData array that is currently in the DataBase
      * @returns [] Array of meal
      */
     getMealData() {
         return [];
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