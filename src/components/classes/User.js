/*
 * title: user.js
 * Author: Alexander Haggart
 * Date Created: 11/8/17
 * Description: This file will handle user data operations through the DBClient
 */
 import DBClient from './AWSDatabaseClient'

 /**
  * SINGLETON CLASS --> USE User.getUser() to get the shared instance
  */

 class User {
    constructor(){
        this.client = DBClient.getClient()
        this.loadUserData = this.loadUserData.bind(this);
        this.verify = this.verify.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);
        this.addToPantry = this.addToPantry.bind(this);
        this.removeFromPantry = this.removeFromPantry.bind(this);

        // this.addToPantry('zucchini','none',1)
        // this.removeFromPantry('zucchini')

        this.userData = { username:this.client.getUsername(), cookbook:{},cookware:{},pantry:{},planner:{}}

        // this.client.updateItem(
        //     this.client.buildUpdateRequest(
        //         'User',
        //         'username',this.client.getUsername(),
        //         this.client.buildSetUpdateExpression('cookbook',{SS:["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies","To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"]})),
        //     this.client.alertResponseCallback)
        this.loadStream = new Promise(this.loadUserData)
    }

    /**
     * this.userData:
     * {
     *      username: <String> username associated with this object, also the primary key for the User table
     *      pantry:   <Map<String,Object>> user's ingredient pantry and associated metadata
     *      cookbook: <Set<String>> user's favorited/saved recipe list
     *      cookware: <Set<String>> user's available cookware
     *      planner:  <???> TODO work with planner team on data organization
     * }
     */
    loadUserData(resolve,reject){
        if(this.userData.username === DBClient.UNAUTH_NAME){ //skip loading if the user is not signed in
            // alert('rejected!')
            reject('User is not logged in!')
            return
        }
        this.client.getDBItems('User','username',[this.client.getUsername()],(response)=>{
            if(response.status){
                this.userData = {
                    username:   response.payload[0].username.S,
                    cookbook:   response.payload[0].cookbook.M,
                    cookware:   new Set(response.payload[0].cookware.SS),
                    pantry:     this.client.unpackMap(response.payload[0].pantry.M),
                    planner:{}
                }
                resolve(this.userData)
            } else {
                this.userData = null
                // alert('rejected!')
                reject('Failed to load user data!')
            }
            /*; alert(JSON.stringify(this.userData))*/})
    }

    /**
     * get a Pantry Object:
     * {
     *      [Ingredient]:
     *      {
     *          amount: amout of this ingredient
     *          unit: unit of ingredient amount
     *      }
     * }
     */
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
            function(response){if(response.status) this.userData.pantry[ingredient] = {amount:amount,unit:unit}}.bind(this))

    }

    removeFromPantry(ingredient){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('pantry',ingredient)),
            function(response){if(response.status&&this.userData.pantry[ingredient]) delete this.userData.pantry[ingredient]}.bind(this))
    }

    getCookbook(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return this.userData.cookbook
         // return new Set(["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies",
         //            "To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"])
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
        if(!this.userData || !this.userData[name]){
            return new Promise().reject('Could not fetch user data');
        } else {
            return this.loadStream.then((data)=>data[name]);
        }
    }

    verify(username){
        this.loadStream = this.loadStream.then((data)=>this.validateUsername(username,data))
        return this
    }

    validateUsername(username,userData){
        if(username === userData.username){
            return userData
        } else {
            throw new Error('You don\'t have permission to view '+username+'\'s personal data.')
        }
    }
 }


 var static_user = new User();

 User.getUser = (username) => static_user.verify(username);

 export default User;