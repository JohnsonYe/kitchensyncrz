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

  // Trying to create new branch - Morten

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

        this.mort = "Morten Knapp";

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
        this.verified = false;
    }

    getMort(){
        return this.client.getUsername;
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
                    exclude:    new Set(response.payload[0].exclude.SS),
                    shoppingList: new Set(response.payload[0].shoppingList.SS),
                    pantry:     this.client.unpackMap(response.payload[0].pantry.M)
                }
                // alert(JSON.stringify(this.client.unpackItem(response.payload[0],User.UserDataPrototype)))
                resolve(this.client.unpackItem(response.payload[0],User.UserDataPrototype))
                // resolve(this.userData)
            } else {
                this.userData = null
                // alert('rejected!')
                reject('Failed to load user data!')
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
                        delete data.cookbook[recipeName];
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

    publishRecipe(recipeName){
        alert('dont fucking use publishRecipe')
        //remove the recipe JSON from the user's cookbook
        let set_external_expression = this.client.buildRemoveElementUpdateExpression('cookbook',recipeName);

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

        //pull the recipe object from the local user data
        this.getUserData('cookbook').then((data)=>{})

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
         return this.getUserData('pantry').then(response=>{alert(JSON.stringify(response));callback(response)})
    }


    addToPantry(ingredient,unit,amount){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildMapUpdateExpression('pantry',ingredient,{M:{amount:{N:amount.toString()},unit:{S:unit}}})),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        data.pantry[ingredient] = {amount:amount,unit:unit};
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    removeFromPantry(ingredient){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('pantry', ingredient)),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.pantry[ingredient];
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    getCookbook(callback){
        return this.getUserData('cookbook').then(callback).catch(console.error);
    }


    addToCookbook(recipe, info){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildMapUpdateExpression('cookbook', recipe, {S:info})),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookbook[recipe] = {info:info};
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    removeFromCookbook(recipe){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('cookbook', recipe)),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.cookbook[recipe];
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }



    getCookware(callback){
        return this.getUserData('cookware').then(callback).catch(console.error);
    }

    addToCookware(item){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildStringSetAppendUpdateExpression('cookware', {SS:[item]})),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookware[item] = {item:item};
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    removeFromCookware(item){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveSetElementUpdateExpression('cookware', item)),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.cookware[item];
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }


    getExclusionList(callback){
        return this.getUserData('exclude').then(callback).catch(console.error);

    }

    addToExclusionList(ingredient){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildStringSetAppendUpdateExpression('exclude', {SS:[ingredient]})),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        data.exclude[ingredient] = {ingredient:ingredient};
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }


    removeFromExclusionList(ingredient){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveSetElementUpdateExpression('exclude', ingredient)),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.exclude[ingredient];
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    getShoppingList(callback){
        return this.getUserData('shoppingList').then(callback).catch(console.error);

    }

    addToShoppingList(item){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildStringSetAppendUpdateExpression('shoppingList', {SS:[item]})),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        data.shoppingList[item] = {item:item};
                        return data
                })
             }else {
                console.error(response.payload)
            }
        })
    }

    removeFromShoppingList(item){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveSetElementUpdateExpression('shoppingList', item)),
            (response) => {
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.shoppingList[item];
                        return data;
                })
             }else {
                console.error(response.payload);
            }
        })
    }


    getPlanner(callback){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        this.getUserData('planner').then(callback).catch(console.error)
    }

    setPlanner(planner,callback){
        let packed = this.client.packItem(planner,undefined);
        console.log(JSON.stringify(packed));
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User','username',this.client.getUsername(),
                this.client.buildSetUpdateExpression('planner',packed)),
            (response)=>{
                if(response.status){
                    this.addUserData((data)=>{
                        data.planner = planner;
                        return data;
                    },callback);
                } else {
                    console.error(response.payload);
                }
            })
    }

    getNotes(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return {"Good Old Fashioned Pancakes":
                    {target:{type:'ingredient',id:'blueberry'},
                    text:'use frozen blueberries for that dank artifical taste'}}

    }

    getPreferences(callback){
        this.getUserData('preferences').then(callback);
    }

    setPreferences(preferences,callback){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User','username',this.client.getUsername(),
                this.client.buildSetUpdateExpression('preferences',{SS:Array.from(preferences)})),
            (response)=>{
                if(response.status){
                    this.addUserData((data)=>{
                        data.preferences = preferences;
                        return data;
                    })
                } else {
                    console.error(response.payload);
                }
            })
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
    addUserData(transform,callback){
        this.loadStream = this.loadStream.then(transform);
        if(callback){
            callback(this.loadStream);
        }
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
 DBClient.getClient().registerPrototype(User.PantryItemPrototype)


 User.UserDataPrototype = {
    _NAME:'USERDATA',
    username:{type:'S'},
    cookbook:{type:'M',inner:{type:'S'}},
    cookware:{type:'SS',inner:{type:'SET'}},
    pantry:{type:'M',inner:{type:User.PantryItemPrototype._NAME}},
    shoppingList:{type:'SS'},
    planner:{},
    exclude:{type:'SS'},
    preferences:{type:'SS'},
 }
 DBClient.getClient().registerPrototype(User.UserDataPrototype)

 var static_user = new User();

 User.getUser = (username) => static_user.verify(username);

 export default User;