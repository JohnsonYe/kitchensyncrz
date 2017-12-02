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
        this.client.registerPrototype(User.PantryItemPrototype)
        this.loadUserData = this.loadUserData.bind(this);
        this.verify = this.verify.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);
        this.addToPantry = this.addToPantry.bind(this);
        this.removeFromPantry = this.removeFromPantry.bind(this);
        this.loadStream = new Promise(this.loadUserData);
        this.verified = false;
        // this.createUser('hello world')
    }

    createUser(username){
        this.loadStream = Promise.resolve({ //create a new user data object locally
            username:username,
            cookbook:{},
            cookware:new Set(['fork']), //this can't be empty
        })
            .then((data)=>{ //attempt to push the data to the database, which will break the chain if something goes wrong
                return new Promise((pass,fail)=>this.client.putDBItem('User',this.client.packItem(data,User.UserDataPrototype),fail,pass))
            })
            .then((data)=>console.log(data.payload))
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
        // if(this.userData.username === DBClient.UNAUTH_NAME){ //skip loading if the user is not signed in
        //     // alert('rejected!')
        //     reject('User is not logged in!')
        //     return
        // }

        // This can eventually be replaced with getDBItemPromise, which does the same thing
        this.client.getDBItems('User','username',[this.client.getUsername()],(response)=>{
            if(response.status){
                // alert(JSON.stringify(this.client.unpackItem(response.payload[0],User.UserDataPrototype)))
                resolve(this.client.unpackItem(response.payload[0],User.UserDataPrototype))
                // resolve(this.userData)
            } else {
                // alert('rejected!')
                reject(response.payload)
            }
            /*; alert(JSON.stringify(this.userData))*/})
    }

    deleteRecipe(recipeName){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('cookbook',recipeName)),
            (response)=>{
                if(response.status){
                    this.addUserData((data)=>{
                        if(data.cookbook[recipeName]){
                            delete data.cookbook[recipeName];
                        }
                        return data
                    })
                } else {
                    //the request failed, what should we do?
                    console.error(response.payload)
                }
            })
    }


    saveCustomRecipe(recipeObject){
        //pack the recipe into JSON format and add it to the user's recipe map
        this.client.updateItem( //basic update request, expects a complicated syntax that we build below
            this.client.buildUpdateRequest( //construct the params syntax according to the action we want
                'User', //table to get item from
                'username',this.client.getUsername(), //keyfield and specific key
                //set cookbook[recipeObject.Name] = (data)
                this.client.buildMapUpdateExpression('cookbook',recipeObject.Name,{S:JSON.stringify(recipeObject)})),
            (response)=>{ //if the request succeeds, 'add' to the local use data by transforming it in a then clause
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookbook[recipeObject.Name]=JSON.stringify(recipeObject);
                        return data;
                    })
                } else {
                    //the request failed, what should we do?
                    console.error(response.payload)
                }
            })
    }

    saveExternalRecipe(recipeName){
        //save just the recipe name to the cookbook so we know to load it froma public recipe page
        this.client.updateItem( //basic update request, expects a complicated syntax that we build below
            this.client.buildUpdateRequest( //construct the params syntax according to the action we want
                'User', //table to get item from
                'username',this.client.getUsername(), //keyfield and specific key
                //set cookbook[recipeName] = 'none'
                this.client.buildMapUpdateExpression('cookbook',recipeName,{S:'none'})),
            (response)=>{ //if the request succeeds, 'add' to the local user data by transforming it in a then clause
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookbook[recipeName]='none';
                        return data;
                    })
                } else {
                    //the request failed, what should we do?
                    console.error(response.payload)
                }
            })
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
    getPantry(callback){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        this.getUserData('pantry').then(callback)
    }

    addToPantry(ingredient,unit,amount){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildMapUpdateExpression('pantry',ingredient,{M:{amount:{N:amount.toString()},unit:{S:unit}}})),
            (response)=>{
                if(response.status){
                    // this.userData.pantry[ingredient] = {amount:amount,unit:unit}
                    this.addUserData((data)=>{
                        data.pantry[ingredient] = {amount:amount,unit:unit};
                        return data
                    })
                } else {
                    console.error(response.payload)
                }
            })

    }

    removeFromPantry(ingredient){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('pantry',ingredient)),
            (response)=>{
                if(response.status){
                    this.addUserData((data)=>{
                        if(data.pantry[ingredient]){
                            delete data.pantry[ingredient];
                        }
                        return data
                    })
                } else {
                    console.error(response.payload)
                }
            })
    }

    getCookbook(callback){
        this.getUserData('cookbook').then(callback)
    }

    getCookware(callback){
        this.getUserData('cookware').then(callback)
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

    /**
     * return a Promise that will provide the user data chain and automatically index into the specified field
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getUserData(name){
        return this.loadStream.then((data)=>data[name]).catch((e)=>'Failed to fetch loaded data!');
    }

    /**
     * apply a function to the user data chain before serving it to future requests
     */
    addUserData(transform){
        this.loadStream = this.loadStream.then(transform);
    }

    /**
     * add a verification link to the user data chain, which will fail if validation fails
     * @param  String username the username associated with the requested data
     * @return User          the User object we are verifying
     */
    verify(username){
        if(!this.verified){
            this.loadStream = this.loadStream.then((data)=>this.validateUsername(username,data));
            this.verified = true;
        }
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

User.PantryItemPrototype = {
    _NAME:'PANTRYITEM',
    amount:{type:'N'},
    unit:{type:'S'}
}

User.UserDataPrototype = {
    _NAME:'USERDATA',
    username:{type:'S'},
    cookbook:{type:'M',inner:{type:'S'}},
    cookware:{type:'SS'},
    pantry:{type:'M',inner:{type:User.PantryItemPrototype._NAME}},
    planner:{}
}


var static_user = new User();

User.getUser = (username) => static_user;

export default User;