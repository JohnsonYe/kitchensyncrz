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

const UNAUTH_NAME = 'GUEST'


 class DBClient {
    constructor(){
        this.getDBItems = this.getDBItems.bind(this);
        this.registerPrototype = this.registerPrototype.bind(this);
        this.getPrototype = this.getPrototype.bind(this);
        this.unpackItem = this.unpackItem.bind(this);
        this.login = this.login.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.user = 'user001' //use this to test until authentication / user creation are ready

        this.authenticated = false;

        /**
         * figurative recursion hell
         */
        this.protoUnpack = { //pack items in AWS compliant format
            'S': (s,p)=>s.S,
            'L': (l,p)=>l.L.map((item)=>this.protoUnpack[p.type](item,p.inner)),
            'M': (m,p)=>Object.entries(m.M).reduce((prev,item)=>Object.assign({[item[0]]:this.protoUnpack[p.type](item[1],p.inner)},prev),{}),
            'SS':(ss,p)=>ss.SS,
            'N': (n,p)=>n.N,
            'SET':(s,p)=>new Set(s)
        }

        /**
         * literal recursion hell
         */
        this.protoPack = { //unpack items into easy-access format
            'S': (s,p)=>({'S':s}),
            'L': (l,p)=>({'L':l.map((item)=>(this.protoPack[p.type](item,p.inner)))}),
            'M': (m,p)=>({'M':Object.entries(m).reduce((prev,item)=>Object.assign({[item[0]]:this.protoPack[p.type](item[1],p.inner)},prev),{})}),
            'SS':(ss,p)=>({'SS':ss}),
            'N': (n,p)=>({'N':n}),
        }
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
            } else if(data.Responses[tableName].length == 0) {
                target({status:false, payload: 'Item not found!'});
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
        let xkey = key.replace(/\s/g, '_')
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
                expr: 'SET #attr = list_append(if_not_exists(#attr,:empty_list),:item)',
                names:{"#attr":attrName},
                values:{":item":value,":empty_set":{SS:[]}}
            }
    }

    buildRemoveElementUpdateExpression(attr,key){
        let xattr = attr.replace(/\s/g, '_')       
        return {
            expr: 'REMOVE #'+xattr+'.#'+xattr+'_value',
            names:{['#'+xattr]:attr,['#'+xattr+'_value']:key},
            values:undefined
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

    registerPrototype(proto){
        if(!proto._NAME){
            throw new TypeError('No _NAME specified for prototype: ' + JSON.stringify(proto))
        }
        this.protoUnpack[proto._NAME] = ((object,outertype)=>this.unpackItem(object.M,proto));
        this.protoPack[proto._NAME] = ((object,outertype)=>({M:this.packItem(object,proto)}));
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
        var unpacked = {}
        Object.keys(item).forEach((key)=>{
            try{
                unpacked[key] = this.protoUnpack[prototype[key].type](item[key],prototype[key].inner)
            } catch(e){ //found an undefined key, fail quietly for now
                //normally we would throw an error so that developers know how to update prototypes, but database changes can affect this
                //function's execution in code not being developed for database interaction
                //for now, developers working with the database must be careful with adding new fields
                unpacked[key] = 'NO PROTOTYPE FOUND FOR THIS ITEM: '+key+'; IF YOU ADDED THIS FIELD, PLEASE CHECK THAT YOUR PROTOTYPE'+
                    ' SPECIFICATION IS CORRECT';
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
                    if(item[key]){
                        // alert(key+": "+JSON.stringify(prev[key]))
                        prev[key] = this.protoPack[prototype[key].type](item[key],prototype[key].inner)
                    }
                } catch(e){ //found an undefined key, fail quietly for now
                    //normally we would throw an error so that developers know how to update prototypes, but database changes can affect this
                    //function's execution in code not being developed for database interaction
                    //for now, developers working with the database must be careful with adding new fields
                    alert(e+':'+prototype[key])
                    prev[key] = 'NO PROTOTYPE FOUND FOR THIS ITEM: '+key+'; IF YOU ADDED THIS FIELD, PLEASE CHECK THAT YOUR PROTOTYPE'+
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

 }


 var static_client = new DBClient();

 DBClient.getClient = () => static_client;

 export default DBClient;