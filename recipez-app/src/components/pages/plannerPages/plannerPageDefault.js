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
import {Button} from 'react-bootstrap';

import DynamicList from "../../dynamicList"
import MealEditor from "./editMealPage"
import PlannerHelper from "../../classes/Planner";
import User from '../../classes/User';

/**Lets the user know what recipe is up next to cook will be placed in Daily Meal Planner*/
function UpNextCard(props) {

    const img1 = "http://twolovesstudio.com/wp-content/uploads/sites/5/2017/05/99-Best-Food-Photography-Tips-5-1.jpg";
    const img2 = "https://static1.squarespace.com/static/533dbfc0e4b0a3ebd0e44c92/t/552f072de4b0b098cbb115b6/1429145391117/Chris+Sanchez+Food+photo";
    return (
        <div className="card m-3">
            <div className="view overlay">
                <img
                    className="img-fluid "
                    src={img2}
                    alt="Food Porn"
                />
            </div>
            <div className="card-img-overlay">
                <h3 className="card-title text-white">Up next ...</h3>
            </div>
        </div>
    );
}

function DailyPlannerItem(props) {
    return (
        <div className="card m-3">
                <div className="card-body">
                    <MealEditor data={props.data}
                                recipe={props.recipe}
                                day={props.day}
                                mealIndex={props.mealIndex}
                                dur={props.dur}
                                edit={true}
                    />
                    <p className="">{props.start} to {props.end} - {props.dur}</p>
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
            user = User.getUser("user001");

        this.plannerHelper = new PlannerHelper();

        this.state = {
            days: days,
            numMeals: 0,
            numShopItems: 0,
            numMealsPrepared: 0,
            items: [],
            mealData: null,
        };

        user.getPlanner((planner) => {
            this.setState({mealData: planner});
        });

        this.removeMeal = this.removeMeal.bind(this);
        this.loadNumMeals = this.loadNumMeals.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderMeal = this.renderMeal.bind(this);
        this.renderMealCards = this.renderMealCards.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderDayPlanner = this.renderDayPlanner.bind(this);
        this.renderShoppingList = this.renderShoppingList.bind(this);
        this.renderWeekPlanner = this.renderWeekPlanner.bind(this);
        this.renderWeekCol = this.renderWeekCol.bind(this);
    }

    /** Functionality Methods **/


    /** TODO Removes card from Daily Meal Planner*/
    removeMeal() {
        if (this.state.numMeals > 0) {
            this.plannerHelper.removeMeal(this.state.mealData, 0, 0);
        }
    }

    /** Pass to modal and call after they save or remove something*/
    update() {
        this.setState({mealData: this.state.mealData});
    }

    /**
     * Adds a item to the list
     */
    addItem() {
        this.state.items[this.state.numShopItems] = "Item-" + this.state.numShopItems;
        this.setState({ items : this.state.items });
        this.setState({ numShopItems: (++this.state.numShopItems) });
    }

    /** TODO Removes card from Daily Meal Planner*/
    removeItem() {
        if (this.state.numShopItems > 0) {
            this.state.items.splice((this.state.numShopItems - 1), 1);
            this.setState({items: this.state.items});
            this.setState({numShopItems: (--this.state.numShopItems)});
        }
    }

    /** Functionality Methods End **/

    /**===============================================================================================================*/

    /** Render Items Start **/
    renderMeal(day, mealIndex) {
        return (
            <DailyPlannerItem
                data={this.state.mealData}
                recipe={this.plannerHelper.getMealRecipeName(this.state.mealData, day, mealIndex)}
                start={this.plannerHelper.getMealStartTime(this.state.mealData, day, mealIndex)}
                end={this.plannerHelper.getMealEndTime(this.state.mealData, day, mealIndex)}
                day={day}
                dur={this.plannerHelper.getDuration(this.plannerHelper.getMeal(this.state.mealData, day, mealIndex))}
                mealIndex={mealIndex}
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
                        <h2>Weekly Meal Planner</h2>
                        <h3>{this.state.numMeals}</h3>
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
                        <h2>Daily Meal Planner</h2>
                        <p>{date}</p>
                        <h3>{this.loadNumMeals(today)}</h3>
                        <p>Meals</p>
                        <h3>{this.state.numMealsPrepared}</h3>
                        <p>Prepared</p>
                    </div>
                </div>
                <div className="col-9">
                    <MealEditor
                        recipe={"Marinade for Chicken"}
                        dur={"1 h 20 m"}
                    />
                    <UpNextCard/>
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
                        <h2>Shopping List</h2>
                        <h2>{this.state.numShopItems}</h2>
                        <p>Items</p>
                    </div>
                </div>

                <div className="col-9">
                    <Button
                        bsSize="small"
                        bsStyle="secondary"
                        onClick={this.addItem}>Test</Button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={this.removeItem}>Remove Test
                    </button>
                    <ul className="list-group">
                        <DynamicList
                            renderLI={this.renderItem("Item")}
                            list={this.state.items}
                        />
                    </ul>
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

    /** Driver */
    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1>Planner</h1>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            {this.renderDayPlanner()}
                        </div>

                        <div className="col-sm-12 col-md-6">
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
