/**
 * Title: AWSDatabaseClient.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the database access client
 */
 import AWS from 'aws-sdk';

 /**
  * THIS IS A SINGLETON CLASS.
  * DONT MAKE NEW DBCLIENT OBJECTS. USE THE STATIC METHOD DBClient.getClient() to retrieve a common instance
  */

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
        this.getUsername = this.getUsername.bind(this);
        this.user = 'user001' //use this to test until authentication / user creation are ready

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
    getDBItems(tableName,keyField,keys,target){
        db.batchGetItem(this.buildBatchRequest(tableName,keyField,keys),function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data.Responses[tableName]});
            }
        })
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
        // return {expr: 'SET #'+key+'=if_not_exists(#'+key+',:empty_map) SET #'+key+'.' + key + ' = :'+key+'_value',
        return {expr: 'SET #'+key+'.' + key + ' = :'+key+'_value',
                names:{["#"+key]:mapName},
                // values:{[":"+key+'_value']:value,':empty_map':{M:{}}}
                values:{[":"+key+'_value']:value}
            }
    }

    combineUpdateExpressions(exp1,exp2){
        return {
            expr:   exp1.expr + ',' + exp2.expr,
            names:  Object.assign(exp1.names,exp2.names),
            values: Object.assign(exp1.values,exp2.values)
        }
    }

    buildSetUpdateExpression(attrName,value){
        return {expr: 'SET #attr = :item',
                names:{"#attr":attrName},
                values:{":item":value}
            }
    }

    buildListAppendUpdateExpression(attrName,value){
        return {expr: 'SET #attr = list_append(if_not_exists(#attr,:empty_list),:item)',
                names:{"#attr":attrName},
                values:{":item":value,":empty_list":{L:[]}}
            }
    }

    buildStringSetAppendUpdateExpression(attrName,value){
        return {expr: 'SET #attr = list_append(if_not_exists(#attr,:empty_list),:item)',
                names:{"#attr":attrName},
                values:{":item":value,":empty_set":{SS:[]}}
            }
    }

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
        this.user = username
        return this.authenticated = true
    }

    isLoggedIn(){
        return this.authenticated
    }

    getUsername(){
        return this.user
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

 }

 var static_client = new DBClient();

 DBClient.getClient = () => static_client;

 export default DBClient;