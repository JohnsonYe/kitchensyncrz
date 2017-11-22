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

function DailyPlannerItem(props) {

    return (
        <div className="card m-3 hoverable">
            <div className="card bg-light">
                <div className="card-body">
                    <MealEditor />
                    <p>{props.start} to {props.end} - {props.duration}</p>
                </div>
            </div>
        </div>
    );
}

function ShoppingListItem(props) {
    return (
        <a href="#" className="list-group-item list-group-item-action">{props.name} {props.index}</a>
    );
}

class Planner extends Component {

    constructor(props) {
        super(props);
        var
            now = new Date(),
            //Days of the Week String References
            days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            today = days[now.getDay()] + " " + now.getDate().toString() + ", " + (1900+now.getYear()).toString(),
            mealData = [], /*TODO Change to getMealData after testing*/
            itemData = [];

        this.state = {
            day: now.getDate(),
            date: today,
            numMeals: 0,
            numShopItems: 0,
            numMealsPrepared: 0,
            meals: mealData,
            items: itemData
        };

        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderMeal = this.renderMeal.bind(this);
        this.renderItem = this.renderItem.bind(this);

    }

    /** Functionality Methods **/

    /**
     * Adds a meal to the list
     */
    addMeal() {
        this.state.meals[this.state.numMeals] = "Meal-" + this.state.numMeals;
        this.setState({ meals : this.state.meals });
        this.setState({ numMeals: (++this.state.numMeals) });
    }
    /** TODO Removes card from Daily Meal Planner*/
    removeMeal() {
        if( this.state.numMeals > 0) {
            this.state.meals.splice((this.state.numMeals - 1), 1);
            this.setState({meals: this.state.meals});
            this.setState({numMeals: (--this.state.numMeals)});
        }
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

    renderMeal(index, start, end, duration, name) {
        return (
            <DailyPlannerItem
                name={name}
                start={start}
                end={end}
                duration={duration}
            />
        );
    }

    renderItem(index, name) {
        return (
            <ShoppingListItem
                name={name}
                index={index}
            />
        );

    }

    /** Render Items End **/


    /** Driver */
    render() {
        var count = 0;

        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1>Planner</h1>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                            <div className="col-4">
                                <h3>Daily Meal Planner</h3>
                                <h6>{this.state.date}</h6>
                                <h3>{this.state.numMeals}</h3>
                                <h6>Meals</h6>
                                <h3>{this.state.numMealsPrepared}</h3>
                                <h6>Prepared</h6>
                            </div>
                            <div className="col-8">
                                <Button
                                    bsSize="small"
                                    bsStyle="secondary"
                                    onClick={this.addMeal}>Test</Button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={this.removeMeal}>Remove Test</button>
                                <DynamicList
                                    renderLI={this.renderMeal(0,"start", "end", "Duration", "Meal")}
                                    list={this.state.meals}
                                />
                            </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                            <div className="col-4">
                                <h3>Shopping List</h3>
                                <h3>{this.state.numShopItems}</h3>
                                <h6>Items</h6>
                            </div>

                            <div className="col-8">
                                <Button
                                    bsSize="small"
                                    bsStyle="secondary"
                                    onClick={this.addItem}>Test</Button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={this.removeItem}>Remove Test</button>
                                <ul className="list-group">
                                    <DynamicList
                                        renderLI={this.renderItem(0, "Item")}
                                        list={this.state.items}
                                    />
                                </ul>

                            </div>
                        </div>
                        </div>

                    </div>

                    <div className="row">
                        Daily Meal Planner goes here
                    </div>
                </div>
            </div>
        );
    }
}

export default Planner;