/**
 * Title: AWSDatabaseClient.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the database access client
 */
 import AWS from 'aws-sdk';
// import AWSCognito from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

 /**
  * THIS IS A SINGLETON CLASS.
  * DONT MAKE NEW DBCLIENT OBJECTS. USE THE STATIC METHOD DBClient.getClient() to retrieve a common instance
  */

import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from "amazon-cognito-identity-js";

const up = {
    USER_POOL_ID: "us-east-2_SHrX2V3xU",
    APP_CLIENT_ID: "5ome294mpcicna669ebfieplfi",
    REGION: "us-east-2",
    IDENTITY_POOL_ID: "us-east-2:7da319d0-f8c8-4c61-8c2a-789a751341aa",
};

var creds = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-2:7da319d0-f8c8-4c61-8c2a-789a751341aa',
});
AWS.config.update({region:'us-east-2',credentials:creds});

var db = new AWS.DynamoDB();

const UNAUTH_NAME = 'GUEST'

var MAX_REQUEST_LENGTH = 100;

var exprRegex = /[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g;


 class DBClient {
    constructor(){
        this.getDBItems = this.getDBItems.bind(this);
        this.getDBItemPromise = this.getDBItemPromise.bind(this);
        this.registerPrototype = this.registerPrototype.bind(this);
        this.getPrototype = this.getPrototype.bind(this);
        this.unpackItem = this.unpackItem.bind(this);
        this.login = this.login.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.getUserToken = this.getUserToken.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.authUser = this.authUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
        this.register = this.register.bind(this);
        this.confirmUser = this.confirmUser.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.getAwsCredentials = this.getAwsCredentials.bind(this);
        this.user = 'user001' //use this to test until authentication / user creation are ready

        this.authenticated = false;

        /**
         * figurative recursion hell
         */
        this.protoUnpack = { //pack items in AWS compliant format
            'S': (s,p)=>s.S,
            'L': (l,p)=>l.L.map((item)=>this.protoUnpack[p.type](item,p.inner)),
            'M': (m,p)=>Object.entries(m.M).reduce((prev,item)=>Object.assign({[item[0]]:this.protoUnpack[p.type](item[1],p.inner)},prev),{}),
            'SS':(ss,p)=>new Set(ss.SS),
            'N': (n,p)=>n.N,
            'SET':(s,p)=>new Set(s),
        }

        let castToNumber = ((n,p)=>{
            let str = n.toString();
            let obj = {'N':str};
            console.log(n + '-->' + str + '-->' + JSON.stringify(obj));
            return obj;
        })

        /**
         * literal recursion hell
         */
        this.protoPack = { //unpack items into easy-access format
            'S': (s,p)=>({'S':s}),
            'L': (l,p)=>({'L':l.map((item)=>(this.protoPack[p.type](item,p.inner)))}),
            'M': (m,p)=>({'M':Object.entries(m).reduce((prev,item)=>Object.assign({[item[0]]:this.protoPack[p.type](item[1],p.inner)},prev),{})}),
            'SS':(ss,p)=>({'SS':Array.from(ss)}),
            'N': (n,p)=>({'N':n.toString()})/*castToNumber*/,
            'SET': (n,p)=>{alert('this isnt set up yet')},
        }


    }

    putDBItem(tableName,item,errCallback,successCallback){
        db.putItem({TableName:tableName,Item:item},(err,data)=>{
            if(err){
                errCallback({status:false, payload: err});                
            } else {
                successCallback({status:true,  payload: data});                
            }
        })
    }

    /*
     * Retrieve an object containing database items matching the given key list
     * the retrieved object will be sent to the given 'target' function handle
     * and marked as successful or unsuccessful
     *
     * string tableName: name of the table to retrieve items from
     * [string] keys: list of ingredient names to use as DB keys
     * handle callback: function handle to send items to
     */
    getDBItems(tableName,keyField,keys,target){
        if(keys.length === 0){
            console.log('Received a request with zero keys, skipping database request');
            return;
        }
        if(keys.length > MAX_REQUEST_LENGTH){
            console.log('Recieved request with more than 100 keys! ('+keys.length+')')
            Promise.all((()=>{ //create a promise group out of max size batch requests
                let pos = 0,requests = [];
                while(pos < keys.length){ //split key array into size 100 chunks
                    requests.push(keys.slice(pos,pos+MAX_REQUEST_LENGTH));
                    pos+=MAX_REQUEST_LENGTH;
                }
                console.log('Split request into '+requests.length+' sub-requests')
                //map the chunk array to a promise array, containing a DBItemPromise for each chunk
                return requests.map((request)=>this.getDBItemPromise(tableName,keyField,request)) 
            })())
            .catch((err)=>target({status:false,payload:err})) //abort if any request fails
            //-->|we shouldn't expect a very large request to fail because the user will not be directly
            //-->|creating 100+ item batch requests
            //flatten (reduce) the payload array to a single array and pass it to the callback
            .then((payload)=>target({status:true,payload:payload.reduce((prev,next)=>prev.concat(next),[])}))

            return;
        }
        db.batchGetItem(this.buildBatchRequest(tableName,keyField,keys),function(err,data){
            if(err){ //the call failed for some reason --> probably invalid keys (not strings)
                target({status:false, payload: err + ' --> make sure your query keys are strings!' });
            } else if(data.Responses[tableName].length == 0) { //no results, but the call went through
                target({status:false, payload: 'Item: ' + JSON.stringify(keys) + ' not found!'});
            } else { //everythng looks good, index into the response
                target({status:true,  payload: data.Responses[tableName]});
            }
        })
    }

    /**
     * [get a Promise object containing the database items requested]
     * @param  {[String]} tableName [name of table to get items from]
     * @param  {[String]} keyField  [name of field used as database key]
     * @param  {[JSON]} keys      [keys to fetch items with]
     * @return {[Promise]}           [Promise object with pending DB response]
     */
    getDBItemPromise(tableName,keyField,keys){
        return new Promise((pass,fail)=>{ //wrap a standard request in a promise
            this.getDBItems(tableName,keyField,keys,(response)=>{
                if(response.status){//call succeeded, pass
                    pass(response.payload)
                } else { //call failed, fail
                    fail(response.payload)
                }
            });
        });
    }

    /*
     * Construct an SQS object to retrieve a list of keys from a table
     * 
     * string tableName: name of table to retrieve keys from 
     * [string] keys: DB keys to retrieve
     *
     * return: JSON object set up as SQS query
     */
    buildBatchRequest(tableName,keyField,keys) {
        var keyList = keys.map(key => ({[keyField]:{S: key }}));
        // alert(JSON.stringify(keyList))
        return { RequestItems:{ [tableName]:{ Keys: keyList }}}
    }

    updateItem(params,target){
        db.updateItem(params,this.pushResponseToHandle(target))

    }

    pushResponseToHandle(target){
        return (function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data});
            }
        })
    }

    buildMapUpdateExpression(mapName,key,value){
        let xkey = key.replace(exprRegex, '_')
        return {
                expr: 'SET #'+xkey+'.#' + xkey + '2 = :'+xkey+'_value',
                names:{["#"+xkey]:mapName,['#'+xkey+'2']:key},
                values:{[":"+xkey+'_value']:value}
            }
    }

    buildFieldCreateExpression(fieldName,base){
        return{
            expr:'SET #'+fieldName+' = if_not_exists(#'+fieldName+',:'+fieldName+'_value)',
            names:{['#'+fieldName]:fieldName},
            values:{[':'+fieldName+'_value']:base}
        }
    }

    combineUpdateExpressions(exp1,exp2){
        return {
            expr:   exp1.expr + ', ' + exp2.expr.slice(3),
            names:  Object.assign(exp1.names,exp2.names),
            values: Object.assign(exp1.values,exp2.values)
        }
    }

    buildSetUpdateExpression(attrName,value){
        return {
                expr: 'SET #attr = :item',
                names:{"#attr":attrName},
                values:{":item":value}
            }
    }

    buildListAppendUpdateExpression(attrName,value){
        return {
                expr: 'SET #attr = list_append(if_not_exists(#attr,:empty_list),:item)',
                names:{"#attr":attrName},
                values:{":item":value,":empty_list":{L:[]}}
            }
    }

    buildStringSetAppendUpdateExpression(attrName,value){
        return {
                expr: 'ADD #attr :item',
                names:{"#attr":attrName},
                values:{":item":value}
            }
    }

    buildRemoveElementUpdateExpression(attr,key){
        let xattr = attr.replace(exprRegex, '_')       
        return {
            expr: 'REMOVE #'+xattr+'.#'+xattr+'_value',
            names:{['#'+xattr]:attr,['#'+xattr+'_value']:key},
            values:undefined
        }
    }

    buildRemoveSetElementUpdateExpression(attrName,elemName){
        return {
            expr: 'DELETE '+attrName+" :v",
            names:undefined,
            values:{":v": {"SS": [elemName]}}
        }
    }



    buildUpdateDeleteRequest(tableName,keyField,key,updateExpression){
        return {"UpdateExpression": updateExpression.expr,
                "TableName":tableName,
                "Key":{[keyField]:{S:key}}
            }
    }

    /**
     * params object builder for AWS update transactions
     * 
     * @param  {[type]} tableName        [description]
     * @param  {[type]} keyField         [description]
     * @param  {[type]} key              [description]
     * @param  {[type]} updateExpression [description]
     * @return {[type]}                  [description]
     */
    buildUpdateRequest(tableName,keyField,key,updateExpression){
        return {"UpdateExpression": updateExpression.expr,
                "ExpressionAttributeNames":updateExpression.names,
                "ExpressionAttributeValues":updateExpression.values,
                "TableName":tableName,
                "Key":{[keyField]:{S:key}}
            }

    }

    /*
     * log the user in to allow them to upload to DB and view user-specific data
     */
    login(username,password) {
        const userPool = new CognitoUserPool({
            UserPoolId: up.USER_POOL_ID,
            ClientId: up.APP_CLIENT_ID
        });

        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationData = { Username: username, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) =>
            user.authenticateUser(authenticationDetails, {

                onSuccess: result => resolve(),
                onFailure: err => reject(err)
            })

        );

    }

    isLoggedIn(){
        return this.authenticated
    }

    getUsername(){
        return this.user
    }


     async authUser() {
         if (
             AWS.config.credentials &&
             Date.now() < AWS.config.credentials.expireTime - 60000
         ) {
             return true;
         }

         const currentUser = this.getCurrentUser();

         if (currentUser === null) {
             return false;
         }

         const userToken = await this.getUserToken(currentUser);

         await this.getAwsCredentials(userToken);
         this.user = currentUser.getUsername();
         //alert("getting new creds");

         return true;
     }

     getUserToken(currentUser) {
         return new Promise((resolve, reject) => {
             currentUser.getSession(function(err, session) {
                 if (err) {
                     reject(err);
                     return;
                 }
                 resolve(session.getIdToken().getJwtToken());
             });
         });
     }

     getCurrentUser() {
         const userPool = new CognitoUserPool({
             UserPoolId: up.USER_POOL_ID,
             ClientId: up.APP_CLIENT_ID
         });
         return userPool.getCurrentUser();
     }

     signOutUser() {
         const currentUser = this.getCurrentUser();

         if (currentUser !== null) {
             currentUser.signOut();
         }
     }

     register(username, password, email) {
         const userPool = new CognitoUserPool({
             UserPoolId: up.USER_POOL_ID,
             ClientId: up.APP_CLIENT_ID
         });

         var attributeList = [];

         var dataEmail = {
             Name : 'email',
             Value : email
         };

         //var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
         attributeList.push(dataEmail);

         return new Promise((resolve, reject) =>
             userPool.signUp(username, password, attributeList, null, (err, result) => {
                 if (err) {
                     reject(err);
                     return;
                 }

                 resolve(result.user);
             })
         );
     }

     confirmUser(user, confirmationCode) {
         return new Promise((resolve, reject) =>
             user.confirmRegistration(confirmationCode, true, function(err, result) {
                 if (err) {
                     reject(err);
                     return;
                 }
                 resolve(result);
             })
         );
     }

     authenticateUser(user, email, password) {
         const authenticationData = {
             Username: user,
             Password: password
         };
         const authenticationDetails = new AuthenticationDetails(authenticationData);

         return new Promise((resolve, reject) =>
             user.authenticateUser(authenticationDetails, {
                 onSuccess: result => resolve(),
                 onFailure: err => reject(err)
             })
         );
     }

     getAwsCredentials(userToken) {
         const authenticator = `cognito-idp.${up.REGION}.amazonaws.com/${up.USER_POOL_ID}`;

         AWS.config.update({ region: up.REGION });

         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
             IdentityPoolId: up.IDENTITY_POOL_ID,
             Logins: {
                 [authenticator]: userToken
             }
         });

         return AWS.config.credentials.getPromise();
     }


    unpackFormatting(aws_response) {

    }

    unpackMap(aws_style_map){
        var client_style_map = {};
        // alert(JSON.stringify(Object.entries(aws_style_map)))
        Object.entries(aws_style_map).forEach(
            (kvp) => Object.entries(kvp[1].M).forEach(
                (ikvp) => client_style_map[kvp[0]] = Object.assign({[ikvp[0]]:Object.entries(ikvp[1])[0][1]},client_style_map[kvp[0]])))
        // alert(JSON.stringify(client_style_map))

        return client_style_map
    }

    registerPrototype(proto, ){
        if(!proto._NAME){
            throw new TypeError('No _NAME specified for prototype: ' + JSON.stringify(proto))
        }

        this.protoUnpack[proto._NAME] = ((object,outertype)=>this.unpackItem(object.M,proto));
        this.protoPack[proto._NAME] = ((object,outertype)=>({M:this.packItem(object,proto)}));

        console.log("Registered prototype: "+proto._NAME)
    }

    getPrototype(key,object){
        return this.protoPack[key](object)
    }

    unpackItem(item,prototype){
        if(!prototype){
            throw new Error('No prototype specified for: ' + JSON.stringify(item))
        }
        //unpack an item from AWS
        // alert(JSON.stringify(item)+'\n'+JSON.stringify(prototype))
        var unpacked = {};
        Object.keys(item).forEach((key)=>{
            try{
                // console.log('unpacking: '+key)
                unpacked[key] = this.protoUnpack[prototype[key].type](item[key],prototype[key].inner)
            } catch(e){ //found an undefined key, fail quietly for now
                //normally we would throw an error so that developers know how to update prototypes, but database changes can affect this
                //function's execution in code not being developed for database interaction
                //for now, developers working with the database must be careful with adding new fields
                unpacked[key] = e+' :: NO PROTOTYPE FOUND FOR THIS ITEM: '+key+'; IF YOU ADDED THIS FIELD, PLEASE CHECK THAT YOUR PROTOTYPE'+
                    ' SPECIFICATION IS CORRECT';
                    //alert(key)
                // throw new TypeError(e.message + ': ' + key + '\nPlease check that data prototype defines this field')
            }
        })
        
        // alert(JSON.stringify(unpacked))
        return unpacked

    }

    packItem(item,prototype){
        if(!prototype){
            throw new Error('No prototype specified for: ' + JSON.stringify(item))
        }

        return Object.keys(item).reduce((prev,key)=>{
                try{
                        console.log('packing: '+key)
                        // alert(key+": "+JSON.stringify(prev[key]))
                        prev[key] = this.protoPack[prototype[key].type](item[key],prototype[key].inner);
                } catch(e){ //found an undefined key, fail quietly for now
                    //normally we would throw an error so that developers know how to update prototypes, but database changes can affect this
                    //function's execution in code not being developed for database interaction
                    //for now, developers working with the database must be careful with adding new fields
                    // alert(e+':'+prototype[key])
                    console.error('Error packing item: '+e+' :: '+key)
                    prev[key] = e+' :: NO PROTOTYPE FOUND FOR THIS ITEM: '+key+'; IF YOU ADDED THIS FIELD, PLEASE CHECK THAT YOUR PROTOTYPE'+
                        ' SPECIFICATION IS CORRECT';
                    // throw new TypeError(e.message + ': ' + key + '\nPlease check that data prototype defines this field')
                }
                return prev;}
            ,{})
    }

    /**
     * convenience method for printing output from DBClient calls
     * meant to be handed to a DBClient function as a callback for debugging
     * @param  {response Object} response Object created by pushResponseToHandle()
     */
    alertResponseCallback(response){
        alert(JSON.stringify(response))
    }

    alertAndPass(object){
        alert('got here');
        return object
    }

 }

 var static_client = new DBClient();

 DBClient.getClient = () => static_client;

 export default DBClient;