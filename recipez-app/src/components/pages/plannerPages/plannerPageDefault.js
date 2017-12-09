/**
 * Title: plannerPageDefault.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 *
 * Description: This file will be the first page the user sees when
 * selecting Planner from the navbar. All other planner related pages
 * are can be accessed from this one. At the bottom of this page is a link
 * to a full week planner.
 *
 * Components: dailyMealPlanner, shoppingList
 */
import React, { Component } from 'react';

import MealEditor from "./editMealPage"
import PlannerHelper from "../../classes/Planner";
import User from '../../classes/User';
import ShoppingList from "./ShoppingList";
import RecipeHelper from "../../classes/RecipeHelper";


/**Lets the user know what recipe is up next to cook will be placed in Daily Meal Planner*/
function UpNextCard(props) {

    return (
        <div className="card m-3">
            <div className="view overlay">
                <img
                    className="img-fluid "
                    src={props.url}
                    alt="Food Porn"
                />
            </div>
            <div className="card-img-overlay">
                <h3 className="card-title text-white">Up next: {props.recipe}</h3>
            </div>
        </div>
    );
}

function DailyPlannerItem(props) {
    return (
        <div className="card m-3">
                <div className="card-body ">
                    <MealEditor className="planner-hover"
                                data={props.data}
                                recipe={props.recipe}
                                day={props.day}
                                mealIndex={props.mealIndex}
                                dur={props.dur}
                                edit={true}
                                update={props.update}
                    />
                    <p>{props.start} to {props.end} - {props.dur}</p>
                </div>
            </div>
    );
}

function ShoppingListItem(props) {
    return (
        <a href="#" className="list-group-item list-group-item-action">{props.name} </a>
    );
}

class Planner extends Component {
    constructor(props) {
        super(props);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            //data = new PlannerHelper(this.update),
            user = User.getUser();


        this.plannerHelper = new PlannerHelper();

        this.state = {
            days: days,
            numMealDay: 0,
            numMealWeek: 0,
            nextMeal: "Loading ...",
            nextImg: "http://travelmasters.ca/wp-content/uploads/2017/03/no-image-icon-4-1024x1024.png",
            mealData:null,
        };

        this.updateNextMealCard = this.updateNextMealCard.bind(this);

        user.getPlanner((planner)=>{
            this.setState({mealData:planner});
            this.updateNextMealCard();
        });


        this.loadNumMeals = this.loadNumMeals.bind(this);
        this.loadTotalMeals = this.loadTotalMeals.bind(this);
        this.renderMeal = this.renderMeal.bind(this);
        this.renderMealCards = this.renderMealCards.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderDayPlanner = this.renderDayPlanner.bind(this);
        this.renderShoppingList = this.renderShoppingList.bind(this);
        this.renderWeekPlanner = this.renderWeekPlanner.bind(this);
        this.renderWeekCol = this.renderWeekCol.bind(this);
        this.update = this.update.bind(this);
    }

    /** Functionality Methods **/

    updateNextMealCard() {
        let recipeHelper = new RecipeHelper();
        //figure out what recipe to display in upnext
        let date = new Date();
        let curHr = date.getHours(),
            today = date.getDay(),
            index = 0;

        let meals = this.plannerHelper.getDayMealList(this.state.mealData, today);



        for(let i = 0; i < meals.length ;i++) {
            let hr = this.plannerHelper.getMealStartTime(this.state.mealData, today, i);
            hr = parseInt(hr);
            if( hr <= curHr) {
                index = i;
            }
        }

        this.setState({ nextMeal: this.plannerHelper.getMealRecipeName(this.state.mealData, today, index)});

        recipeHelper.loadRecipe(this.plannerHelper.getMealRecipeName(this.state.mealData, today, index), (data) => {
            if(data&&data.Image) {
                this.setState({nextImg: Array.from(data.Image)[0]});
            }
        });
    }

    /** Pass to modal and call after they save or remove something*/
    update(planner) {
        this.setState( {mealData: planner} );
        this.updateNextMealCard();
    }


    /** Functionality Methods End **/

    /**===============================================================================================================*/

    /** Render Items Start **/
    renderMeal(day, mealIndex) {
        let end;
        if (this.plannerHelper.getMealEndTime(this.state.mealData, day, mealIndex) === "0") {
            end = "00";
        }
        else {
            end = this.plannerHelper.getMealEndTime(this.state.mealData, day, mealIndex);
        }
        return (
            <DailyPlannerItem
                data={this.state.mealData}
                recipe={this.plannerHelper.getMealRecipeName(this.state.mealData, day, mealIndex)}
                start={this.plannerHelper.getMealStartTime(this.state.mealData, day, mealIndex)}
                end={end}
                day={day}
                dur={this.plannerHelper.getDuration(this.plannerHelper.getMeal(this.state.mealData, day, mealIndex))}
                mealIndex = {mealIndex}
                update = {this.update}
            />
        );
    }

    renderMealCards(day) {
        if (this.state.mealData)
            var meals = this.plannerHelper.getDayMealList(this.state.mealData, day);
        else return (<div>Loading ...</div>);

        return (
            Object.keys(meals).map((key) => {
                return this.renderMeal(day, key);
            })
        );
    }

    renderWeekCol(day) {
        return (
            <div className="col-md col-sm-12">
                <p>{this.state.days[day]}</p>
                {this.renderMealCards(day)}
            </div>
        );
    }

    renderWeekPlanner() {

        return (
            <div className="col-md-12">
                <div className="
                                            border
                                            border-left-0
                                            border-right-0
                                            border-dark">
                    <div className="mx-auto">
                        <h3>Weekly Meal Planner</h3>
                        <h3>{this.loadTotalMeals()}</h3>
                        <p>Meals</p>
                    </div>
                </div>
                <div className="row">
                    {this.renderWeekCol(0)}
                    {this.renderWeekCol(1)}
                    {this.renderWeekCol(2)}
                    {this.renderWeekCol(3)}
                    {this.renderWeekCol(4)}
                    {this.renderWeekCol(5)}
                    {this.renderWeekCol(6)}
                </div>
            </div>
        );
    }

    renderDayPlanner() {

        var now = new Date(),
            today = now.getDay(),
            date = this.state.days[today] + " " + now.getDate().toString() + ", " + (1900 + now.getYear()).toString();

        return (
            <div className="row">
                <div className="col-3
                                            border
                                            border-left-0
                                            border-top-0
                                            border-bottom-0
                                            border-dark">
                    <div className="mx-auto">
                        <h3>Daily Meal Planner</h3>
                        <p>{date}</p>
                        <h3>{this.loadNumMeals(today)}</h3>
                        <p>Meals</p>
                    </div>
                </div>
                <div className="col-9">
                    <UpNextCard
                        recipe = {this.state.nextMeal}
                        url={this.state.nextImg}
                    />
                    {this.renderMealCards(today)}
                </div>
            </div>
        );
    }


    renderItem(name) {
        return (
            <ShoppingListItem
                name={name}
            />
        );
    }

    renderShoppingList() {
        return (
            <div className="row">
                <div className="col-3
                                            border
                                            border-left-0
                                            border-top-0
                                            border-bottom-0
                                            border-dark">
                    <div className="mx-auto">
                        <h3>Shopping List</h3>
                        <h3>{}</h3>
                        <p>Items</p>
                    </div>
                </div>
                <div className="col-9">
                    <ShoppingList />
                </div>
            </div>
        );
    }

    /** Render Items End **/

    /**Loads the numbers of Meals*/
    loadNumMeals(day) {
        var numMeals = 0;
        if (this.state.mealData)
            numMeals = this.plannerHelper.getNumMeals(this.state.mealData, day);
        else return (<div>Loading ...</div>);

        return numMeals;
    }

    loadTotalMeals() {
        var total = 0;
        if(this.state.mealData)
            total = this.plannerHelper.getTotalNumMeals(this.state.mealData);
        else return (<div>Loading ...</div>);

        return total;
    }


    /** Driver */
    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1 className="text-white">Planner</h1>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6">
                            {this.renderDayPlanner()}
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6">
                            {this.renderShoppingList()}
                        </div>
                    </div>
                    &nbsp;
                    <div className="row">
                        {this.renderWeekPlanner()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Planner;
