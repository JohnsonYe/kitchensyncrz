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

        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);

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
 }

 export default PlannerHelper;