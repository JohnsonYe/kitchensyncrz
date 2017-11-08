/**
 * Title: aws_database_client.js
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
        this.ingredientSearch = this.ingredientSearch.bind(this);
        this.getDBItems = this.getDBItems.bind(this);
        this.buildBatchRequest = this.buildBatchRequest.bind(this);
        this.result = {};
        this.buildBatchRequest('not a real table',['test','test2'])
    }
    ingredientSearch(ingredients,target) {
        return this.getDBItems('Ingredients',ingredients,target)
    }
    recipeSearch(recipes,target) {
        return this.getDBItems('Recipes',ingredients,target)
    }
    getDBItems(tableName,keys,target){
        db.batchGetItem(this.buildBatchRequest(tableName,keys),function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data});
            }
        }.bind(this))
    }
    buildBatchRequest(tableName,keys) {
        var keyList = keys.map(key => ({Name:{S: key }}));
        // alert(JSON.stringify(keyList));
        return { RequestItems:{ [tableName]:{ Keys: keyList }}}
        // return {}['RequestItems'][tableName]['Keys'] = keyList;
    }

 }

 export default DBClient;