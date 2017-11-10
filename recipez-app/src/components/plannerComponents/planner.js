/**
 * Title: planner.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the planner component
 */
import React, { Component } from 'react';
import PlannerItem from "./plannerItem";
class Planner extends Component {

    constructor(props) {
       super(props);
       this.state = {
           days: [
               {
                   title: "Sun",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Mon",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Tue",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Wed",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Thurs",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Fri",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               },
               {
                   title: "Sat",
                   meals: [
                       {
                           Breakfast: null,
                           Lunch: null,
                           Dinner: null
                       }
                   ]
               }

           ]

       }
    }

    /**
     * This method create the image of what a meal should look like.
     */
    renderMeal() {

    }

    /**
     * This method will remove a meal from meal planner
     * @returns {XML}
     */
    removeMeal() {

    }

    /**
     * This method will highlight the current day of the week
     * @returns {XML}
     */
    currentDay() {

    }

    render() {

        return (
            <div>
                <PlannerItem day="Sunday" />
                <PlannerItem day="Monday" />
                <PlannerItem day="Tuesday" />
                <PlannerItem day="Wednesday" />
                <PlannerItem day="Thursday" />
                <PlannerItem day="Friday" />
                <PlannerItem day="Saturday" />
            </div>
        )
    }
}

export default Planner;