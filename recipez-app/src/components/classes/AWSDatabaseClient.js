/**
 * Title: AWSDatabaseClient.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the database access client
 */
 import AWS from 'aws-sdk';

var creds = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-2:7da319d0-f8c8-4c61-8c2a-789a751341aa',
});
AWS.config.update({region:'us-east-2',credentials:creds});
var db = new AWS.DynamoDB();

 class DBClient {
    constructor(){
        this.getDBItems = this.getDBItems.bind(this);
        this.buildBatchRequest = this.buildBatchRequest.bind(this);
        this.login = this.login.bind(this);

        this.authenticated = false
    }

    /*
     * Retrieve an object containing database items matching the given key list
     * the retrieved object will be sent to the given 'target' function handle
     * and marked as successful or unsuccessful
     *
     * string tableName: name of the table to retrieve items from
     * [string] keys: list of ingredient names to use as DB keys
     * handle target: function handle to send items to
     */
    getDBItems(tableName,keys,target){
        db.batchGetItem(this.buildBatchRequest(tableName,keys),function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data});
            }
        }.bind(this))
    }

    /*
     * Construct an SQS object to retrieve a list of keys from a table
     * 
     * string tableName: name of table to retrieve keys from 
     * [string] keys: DB keys to retrieve
     *
     * return: JSON object set up as SQS query
     */
    buildBatchRequest(tableName,keys) {
        var keyList = keys.map(key => ({Name:{S: key }}));
        // alert(JSON.stringify(keyList))
        return { RequestItems:{ [tableName]:{ Keys: keyList }}}
    }

    /*
     * log the user in to allow them to upload to DB and view user-specific data
     */
    login(username,password) {
        return this.authenticated = true
    }

    isLoggedIn(){
        return this.authenticated
    }

    unpackFormatting(aws_response) {
        
    }

 }

 export default DBClient;