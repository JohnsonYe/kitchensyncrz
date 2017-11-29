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

/**Lets the user know what recipe is up next to cook will be placed in Daily Meal Planner*/
function UpNextCard(props){

    const img1 = "http://twolovesstudio.com/wp-content/uploads/sites/5/2017/05/99-Best-Food-Photography-Tips-5-1.jpg";
    const img2 = "https://static1.squarespace.com/static/533dbfc0e4b0a3ebd0e44c92/t/552f072de4b0b098cbb115b6/1429145391117/Chris+Sanchez+Food+photo";
    return (
        <div className="card m-3">
            <div className="view overlay hm-zoom">
                <img
                    className="img-fluid "
                    src={img2}
                    alt="Food Porn"
                />
                <div className="mask flex-center waves-effect waves-light">
                    <p className="white-text">Get Started</p>
                </div>
            </div>
            <div className="card-img-overlay">
                <h3 className="card-title text-white">Up next ...</h3>
            </div>
        </div>
    );
}

function DailyPlannerItem(props) {
    return (
        <div className="card m-3 hoverable">
            <div className="card transparent">
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
            days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            date = days[now.getDay()] + " " + now.getDate().toString() + ", " + (1900+now.getYear()).toString(),
            data = new PlannerHelper();
        this.state = {
            day: now.getDate(),
            date: date,
            numMeals: 0,
            numShopItems: 0,
            numMealsPrepared: 0,
            meals: [],
            items: [],
            data: data
        };

        this.addMeal = this.addMeal.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderMeal = this.renderMeal.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderDayPlanner = this.renderDayPlanner.bind(this);
        this.renderShoppingList = this.renderShoppingList.bind(this);

    }

    /** Functionality Methods **/

    /**
     * Adds a meal to the list
     */
    addMeal() {
        this.state.meals[this.state.numMeals] = "Meal-" + this.state.numMeals;
        this.setState({ meals : this.state.meals });
        this.setState({ numMeals: (++this.state.numMeals) });
        this.state.data.getMealData();
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

    renderDayPlanner() {
        return(
                <div className="row">
                    <div className="col-3
                                            border
                                            border-left-0
                                            border-top-0
                                            border-bottom-0
                                            border-dark">
                        <div className="mx-auto">
                            <h2>Daily Meal Planner</h2>
                            <p>{this.state.date}</p>
                            <h3>{this.state.numMeals}</h3>
                            <p>Meals</p>
                            <h3>{this.state.numMealsPrepared}</h3>
                            <p>Prepared</p>
                        </div>
                    </div>
                    <div className="col-9">
                        <Button
                            bsSize="small"
                            bsStyle="secondary"
                            onClick={this.addMeal}>Test</Button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={this.removeMeal}>Remove Test</button>
                        <UpNextCard/>
                        <DynamicList
                            renderLI={this.renderMeal(0,"start", "end", "Duration", "Meal")}
                            list={this.state.meals}
                        />
                    </div>
                </div>
        );
    }

    renderWeekPlanner() {

    }

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

    renderWeekCol(day) {
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
                        onClick={this.removeItem}>Remove Test</button>
                    <ul className="list-group">
                        <DynamicList
                            renderLI={this.renderItem(0, "Item")}
                            list={this.state.items}
                        />
                    </ul>
                </div>
            </div>
        );
    }

    /** Render Items End **/


    /** Driver */
    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1>Planner</h1>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            {this.renderDayPlanner()}
                        </div>

                        <div className="col-md-6">
                            {this.renderShoppingList()}
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
