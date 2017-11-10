/*
 * title: user.js
 * Author: Alexander Haggart
 * Date Created: 11/8/17
 * Description: This file will handle user data operations through the DBClient
 */
 import DBClient from './AWSDatabaseClient'

 class User {
    constructor(client){
        this.client = client //hand this class an existing database client for data access
        this.loadUserData = this.loadUserData.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);

        this.userData = null
    }

    loadUserData(username){
        this.client.getDBItems('User',username,(response) =>
            this.userData = response.status ? response.payload : null)
    }

    getPantry(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return ['egg','flour','water','bread','sugar']        
    }

    getCookbook(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return ["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies",
                    "To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"]
    }

    getCookware(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return [{Name:'spoon',difficulty:1},{Name:'whisk',difficulty:2},{Name:'food processor',difficulty:8}]
    }

    getPlanner(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return {Monday:['cook'],Tuesday:['eat'],Wednesday:['sleep'],Thursday:['grocery shopping']}
    }

    getNotes(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return {"Good Old Fashioned Pancakes":
                    {target:{type:'ingredient',id:'blueberry'},
                    text:'use frozen blueberries for that dank artifical taste'}}

    }

    getUserData(name){
        if(!this.userData || this.userData[name]){
            return 'Could not fetch user data';
        } else {
            return this.userData[name];
        }
    }
 }

 export default User;