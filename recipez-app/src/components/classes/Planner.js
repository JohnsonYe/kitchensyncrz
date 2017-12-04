/**
 * Title: Planner.js
 * Authors: Andrew Sanchez(backend implementation)
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature.
 */

class PlannerHelper{

    removeMeal(data, day, mealIndex) {
        if (data.days[day].mealData[mealIndex]) {
            data.days[day].mealData.splice(mealIndex, 1);
        }
    }

    /** Insert meal into planner
     * @param day - tells what day to insert meal into
     * @param meal - meal object to be inserted
     * @return pass/fail 1 pass, -1 fail
     */
    insertMeal(data, meal, day) {
        // create an array of just the current days meals for easy access
        var meals = this.getDayMealList(data, day),
            mealIndex = 0;

        //if meals has not been instantiated
        if (meals.length == 0) {
            data.days[day].mealData.push(meal);
        }

        var startHr = meal.startHr,
            startMin = meal.startMin,
            endHr = meal.endHr,
            endMin = meal.endMin;

        //Handle Database Error
        if (startMin === undefined) {
            startMin = 0;
        }

        if (endMin === undefined) {
            endMin = 0;
        }

        if (startHr === undefined) {
            startHr = 0;
        }

        if (endHr === undefined) {
            endHr = 0;
        }

        // Go through meals looking at each end times to ensure that this meals
        // start time is greater than meal before's end time.
        for (var i = 0; i < meals.length; i++) {
            let dstartHr = meals[i].startHr,
                dstartMin = meals[i].startMin,
                dendHr = meals[i].endHr,
                dendMin = meals[i].endMin;

            //Handle Database Error
            if (dstartMin === undefined) {
                dstartMin = 0;
            }

            if (dendMin === undefined) {
                dendMin = 0;
            }

            if (dstartHr === undefined) {
                dstartHr = 0;
            }

            if (dendHr === undefined) {
                dendHr = 0;
            }

            if (startHr > dendHr) {
                mealIndex += 1;
            }
            else if (startHr === dendHr) {
                if (startMin > dendMin) {
                    mealIndex += 1;
                }
            }
        }

        //if mealIndex is out of bound then add to the end
        if (mealIndex === meals.length) {
            data.days[day].mealData.push(meal);
        }

        let dstartHr = 0,
            dstartMin = 0,
            dendHr = 0,
            dendMin = 0;

        //handle Database error
        if (meals[mealIndex].startHr === undefined) {
        } else {
            dstartHr = meals[mealIndex].startHr;
        }

        if (meals[mealIndex].startMin === undefined) {
        }
        else {
            dstartMin = meals[mealIndex].startMin;
        }

        if (meals[mealIndex].endHr === undefined) {
        } else {
            dendHr = meals[mealIndex].endHr;
        }

        if (meals[mealIndex].endMin === undefined) {
        } else {
            dendMin = meals[mealIndex].endMin;
        }

        // Make sure this meals end time is less than meal afters start time (i.e. no overlap)
        if (endHr < dstartHr) {
            console.log("pushed");
            data.days[day].mealData.splice(mealIndex, 0, meal);
        }
        else if (endHr === dstartHr) {
            if (endMin < dstartMin) {
                console.log("pushed");
                data.days[day].mealData.splice(mealIndex, 0, meal);
            }
        }
        else {
            alert("Your meal cannot be added because it conflicts with another scheduled meal.");
        }
    }
     /**
      * This function creates a meal object that could be added to one of the entries in mealData.
      * @param recipe - name of recipe for meal
      * @param dur - a string of the minutes it takes to cook the meal
      * @param startHr - start time of meal
      * @param startMin - start min of meal
      */
     createMeal(recipe, dur, startHr, startMin) {

         var hr = 0,
             endMin = 0,
             endHr = 0,
             total = 0,
             recipes = [];

         recipes.push(recipe);
         total = startMin + dur;
         hr = startHr;

         while (total >= 60) {
             total = total - 60;
             hr += 1;
         }

         endHr = hr;
         endMin = total;

         //check if hr passed to the next day
         while (endHr >= 24) {
             endHr = endHr - 24;  //converts to correct time
         }

         //create meal object
         return {
             recipes: recipes,
             startHr: startHr ,
             startMin: startMin,
             endHr: endHr,
             endMin: endMin
         };
     }

    /** This funtion will edit a meal and save the change to the database
     * @param day - the day where
     * @param mealIndex - the index of the meal you want to edit
     * @param meal - new meal object to replace the old one.
     */
    editMeal(data, day, mealIndex, meal, newDay) {
        this.removeMeal(data, day, mealIndex);
        this.insertMeal(data, meal, newDay);
    }


    /** Gives the an array of meals for that day
     * @param day - day you want the meal list of*/
    getDayMealList(data, day) {
        //alert(JSON.stringify(data));
        return data.days[day].mealData;
     }

    getMealRecipeName(data, day, mealIndex) {
        //alert(JSON.stringify(data.days));
        if (data.days[day].mealData[mealIndex].recipes) {
            return data.days[day].mealData[mealIndex].recipes[0];

        } else return "Unavailable";
    }

    /** Gives meals start time startHr: startMin
     * @param day - day the meal wanted is in
     * @param mealIndex - index of the meal you want
     */
    getMealStartTime(data, day, mealIndex) {

        var hour = data.days[day].mealData[mealIndex].startHr,
            min = data.days[day].mealData[mealIndex].startMin,
            noon = "am";

         //alert(JSON.stringify(hour));

         if(hour == 12) {
             noon = "pm";
         }
         else if(hour > 12) {
             hour = (hour - 12);
             noon = "pm"
         }
         else if(hour === undefined) {  //undefined
             hour = 12;
             noon = "am";
         }

        if (min < 10) {
            min = "0" + min;
        } else if (min === undefined) { //undefined
            min = "00";
        }

        return hour + ":" + min + " " + noon;
    }

    getMeal(data, day, mealIndex) {
        return this.getDayMealList(data, day)[mealIndex];
    }

    /** gets duration string form*/
    getDuration(meal) {
        let startHr = meal.startHr,
            startMin = meal.startMin,
            endHr = meal.endHr,
            endMin = meal.endMin;

        if (meal.startMin === undefined) {
            startMin = 0;
        }

        if (meal.endMin === undefined) {
            endMin = 0;
        }

        if (meal.startHr === undefined) {
            startHr = 0;
        }

        if (meal.endHr === undefined) {
            endHr = 0;
        }

        let min = endMin - startMin;
        let hr = endHr - startHr;

        //alert(JSON.stringify(meal.endMin));

        if (min === undefined) {
            min = "0";
        }

        if (hr === undefined) {
            hr = "0";
        }

         if( endHr - startHr == 0) {
             return (min) + " m";
         }
         else {
             return (hr) + " h " + (min) + " m";
         }
     }


    /** Gives meals end time startHr: startMin
     * @param day - day the meal wanted is in
     * @param mealIndex - index of the meal you want
     */
    getMealEndTime(data, day, mealIndex) {
        var hour = data.days[day].mealData[mealIndex].endHr,
            min = data.days[day].mealData[mealIndex].endMin,
            noon = "am";

        if(hour == 12) {
            noon = "pm";
        }
        else if (hour > 12) {
            hour = (hour - 12);
            noon = "pm"
        }
        else if (hour === undefined) {  //undefined
            hour = 12;
            noon = "am";
        }

        if (min < 10) {
            min = "0" + min;
        } else if (min === undefined) { //undefined
            min = "00";
        }

        return hour + ":" + min + " " + noon;
    }

     /** This function retrieves the number of meals for a specified day*/
     getNumMeals(data, day){
         if(data.days[day].mealData.length)
             return data.days[day].mealData.length;
         else return 0;
     }

     /** This function counts the meals in the planner*/
     getTotalNumMeals(data) {
         let total = 0;
         for(let i = 0; i < 7; i++) {
             total += data.days[i].mealData.length;
         }

         return total;
     }
}

 export default PlannerHelper;