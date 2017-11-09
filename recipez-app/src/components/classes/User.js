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

        this.userData = null
    }

    loadUserData(username){
        this.client.getDBItems('User',username,(response) =>
            this.userData = response.status ? response.payload : null)
    }

    getPantry(){
        return this.getUserData('Pantry');
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