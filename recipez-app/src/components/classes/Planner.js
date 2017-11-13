/**
 * Title: Planner.js
 * Authors: Alexander Haggart
 * Date Created: 11/13/2017
 * Description: This file will assist in database transactions involving the planner feature
 */
import DBClient from "./AWSDatabaseClient"

 class PlannerHelper{
    constructor(){
        this.client = DBClient.getClient()

        var req = this.client.buildUpdateRequest('User','user001','planner','SET',{S:'chicken and rice'});
        // this.client.updateItem(req,(s,r) => alert(JSON.stringify(s)))


    }

    addMeal(day,recipe){

    }

    removeMeal(day,recipe){

    }

    pushRequest(request){

    }



 }

 export default PlannerHelper;