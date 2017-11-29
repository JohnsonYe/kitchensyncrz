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

import MealEditor from "./editMealPage";

function DailyPlannerItem(props) {

    const noImg = "http://www.vermeer.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"

    return (
        <div className="card m-3 hoverable">
            <div className="card bg-light">
                <div className="card-body">
                    <MealEditor />
                    <p>5:15 AM to 7:15 AM - 2hours</p>
                </div>
            </div>
        </div>
    );
}

function ShoppingListItem(props) {
    return (
        <a href="#" className="list-group-item list-group-item-action">Item {props.num}</a>
    );
}

class DynamicList extends Component{

    constructor(props) {
        super(props);
    }
    render() {

        if( this.props.type === "item" ) {
            return (
                Object.keys(this.props.list).map((key) => {
                    return <ShoppingListItem meal={this.props.list[key]}/>
                })
            );
        }
        else {
            return (
                Object.keys(this.props.list).map((key) => {
                    return <DailyPlannerItem meal={this.props.list[key]}/>
                })
            );
        }
    }
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

    }

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
        this.state.meals.splice((this.state.numMeals-1),1);
        this.setState({ meals : this.state.meals });
        this.setState({ numMeals: (--this.state.numMeals) });
    }

    /**
     * Adds a meal to the list
     */
    addItem() {
        this.state.items[this.state.numShopItems] = "Item-" + this.state.numShopItems;
        this.setState({ items : this.state.items });
        this.setState({ numShopItems: (++this.state.numShopItems) });
    }

    /** TODO Removes card from Daily Meal Planner*/
    removeItem() {
        this.state.items.splice((this.state.numShopItems-1),1);
        this.setState({ items : this.state.items });
        this.setState({ numShopItems: (--this.state.numShopItems) });
    }

    render() {

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
                                <DynamicList list={this.state.meals}/>
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
                                    <DynamicList type="item" list={this.state.items}/>
                                </ul>

                            </div>
                        </div>
                        </div>

                    </div>

                    <div className="row">
                        Button Goes Here
                    </div>
                </div>
            </div>
        );
    }
}

export default Planner;