/*
 * title: user.js
 * Author: Alexander Haggart
 * Date Created: 11/8/17
 * Description: This file will handle user data operations through the DBClient
 */
 import DBClient from './AWSDatabaseClient'

 class User {
    constructor(){
        this.client = DBClient.getClient()
        this.loadUserData = this.loadUserData.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);
        this.addToPantry = this.addToPantry.bind(this);

        this.loadUserData(this.client.getUsername())
        this.addToPantry('zucchini','none',1)
    }

    /**
     * this.userData:
     * {
     *      username: <String> username associated with this object, also the primary key for the User table
     *      pantry:   <Map<String,Object>> user's ingredient pantry and associated metadata
     *      cookbook: <Set<String>> user's favorited/saved recipe list
     *      cookware: <Set<String>> user's available cookware
     * }
     */
    loadUserData(){
        this.client.getDBItems('User','username',[this.client.getUsername()],function(response) {
            (this.userData = (response.status
            ?
            {
                username:response.payload[0].username.S,
                cookbook:new Set(response.payload[0].cookbook.SS),
                cookware:new Set(response.payload[0].cookware.SS),
                pantry:this.client.unpackMap(response.payload[0].pantry.M)
            }
            : null))/*; alert(JSON.stringify(this.userData))*/}.bind(this))
    }

    getPantry(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return this.userData.pantry       
    }

    addToPantry(ingredient,unit,amount){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildMapUpdateExpression('pantry',ingredient,{M:{amount:{N:amount.toString()},unit:{S:unit}}})),
            function(error,response){if(!error) this.userData.pantry[ingredient] = {amount:amount,unit:unit}}.bind(this))

    }

    getCookbook(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return new Set(["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies",
                    "To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"])
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


 var static_user = new User();

 User.getUser = () => static_user;

 export default User;