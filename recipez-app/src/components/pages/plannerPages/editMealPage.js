/**
 * Title: plannerPageDefault.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be in charge of editing or creating new meals
 * Depending on whether the user is planning or removing the meal
 *
 * Time will be based of 24 hour Military System
 */
import React, { Component } from 'react';
import { Grid , Row, Col , Button} from 'react-bootstrap';

class MealEditor extends Component {

    constructor(props) {
        super(props);
        var
            now = new Date(),
            //Days of the Week String References
            days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            today = days[now.getDay()] + " " + now.getDate().toString() + ", " + (1900+now.getYear()).toString(),
            mealData = this.testMealData();

        this.state = {
            mealData: mealData
        };
    }

    testMealData(){

        var recipe1 = {
            name: "Spaghetti",
                duration: 30,
                link: "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/9/23/1/FNM_110114-Spaghetti-with-Pecan-Herb-Pesto-Recipe_s4x3.jpg.rend.hgtvcom.616.462.suffix/1412282745840.jpeg",
                description: "I tell all my hoes ... rack it up"
            },
            recipe2 = {
                name: "Booty",
                duration: 120,
                link: "http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png",
                description: "Love is not just a verb"
            };

        var meal1 = this.createMeal(recipe1, 12, 30),
            meal2 = this.createMeal(recipe2, 2, 45);

        //Access Meal Data data[dayOfWeek][mealIndex]
        var data = [
            [],  //Sun
            [meal1, meal2],  //Mon
            [],  //Tue
            [],  //Wed
            [],  //Thur
            [],  //Fri
            []   //Sat
        ];

        return data;
    }

    /**
     * This function will retrieve the users mealData array that is currently in the DataBase
     * @returns [] Array of meal
     */
    getMealData() {
        return [];
    }

    /**
     * Pushes the local mealData containing changes user made to Database
     */
    pushMealData() {

    }

    /**
     * This function creates a meal object that could be added to one of the entries in mealData.
     * @param recipe - passing a in a recipe object will give us recipe name, duration, img link, and description (or index)
     * @param start - the time you plan to start cooking this meal
     * @return {recipe: *, startTime: *, endTime: *} a.k.a meal object
     */
    createMeal(recipe, startHr, startMin) {

        /**TODO Anything that has to do with recipes is subject to change since I'm not sure how define recipe objects
         */

        var hr = 0,
            endMin = 0,
            endHr = 0,
            total = 0;

        total = startMin + recipe.duration;
        hr = Math.floor(total/60);

        endMin = total - (hr)*(60);
        endHr = startHr + hr;

        //check if hr passed to the next day
        if( endHr >= 24) {
            endHr = (24 - endHr)*(-1);  //converts to correct time
        }

        return {
            recipe: recipe,
            startHr: startHr ,
            startMin: startMin,
            endHr: endHr,
            endMin: endMin
        };
    }

    /**
     * Adds a meal to mealData in order. Order is determined by start hour of recipe. Overlapping meal times are not
     * allowed.
     * @param day - index of day where the meal should be added (recall order is ... [Sun, Mon, Tue ...])
     * @param mealObj - takes a meal object
     * @return error - if meal trying to be added overlaps with the time of meal in mealData
     */
    addMeal(day, mealObj){

        //update dataBase with changes
        this.pushMealData();
    }

    /**
     * Removes a meal from mealData according to the specified name of recipe or meal.
     * @param day - index of day in mealData
     * @param mealIndex -
     */
    removeMeal(day, mealIndex) {

        //update dataBase with changes
        this.pushMealData();
    }

    renderRecipeData() {
        return (
            <p>Look
                If you had
                One shot
                Or one opportunity
                To seize everything you ever wanted
                In one moment
                Would you capture
                Or just let it slip?
                Yo
                His palms are sweaty, knees weak, arms are heavy
                There's vomit on his sweater already, mom's spaghetti
                He's nervous, but on the surface he looks calm and ready
                To drop bombs, but he keeps on forgettin'
                What he wrote down, the whole crowd goes so loud
                He opens his mouth, but the words won't come out
                He's chokin', how, everybody's jokin' now
                The clocks run out, times up, over, blaow!
                Snap back to reality, oh there goes gravity
                Oh, there goes Rabbit, he choked
                He's so mad, but he won't give up that easy? No
                He won't have it, he knows his whole back city's ropes
                It don't matter, he's dope, he knows that, but he's broke
                He's so…
            </p>
        );

    }

    /**
     * Renders Save and remove buttons
     */
    renderButtons(){
        const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
        return (
            <div className="well" style={wellStyles}>
                <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
                <Button bsSize="large" block>Block level button</Button>
            </div>
        );

    }

    renderPhoto(){
        return (
            <img src="http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
                alt="image"
                height={300}
                width={300}/>
        );
    }

    render() {
        return (
            <Grid >
                <Row>
                    <Col xs={5} md={4}>{this.renderPhoto()}</Col>
                    <Col xs={5} md={4}>{this.renderRecipeData()}</Col>
                    <Col xs={2} md={4}>{this.renderButtons()}</Col>
                </Row>
            </Grid>
        );
    }
}

export default MealEditor;