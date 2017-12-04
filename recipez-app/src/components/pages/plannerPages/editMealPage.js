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
import {Button, Modal, DropdownButton, MenuItem, ButtonToolbar} from 'react-bootstrap';
import PlannerHelper from '../../classes/Planner';
import User from '../../classes/User';
import RecipeHelper from "../../classes/RecipeHelper";
import {Link} from "react-router-dom";


function Duration(props) {
    return (
        <div>
            <div className="d-sm-inline-block">
                <h4>{props.dur}</h4>
            </div>
            &nbsp;
            <div className="d-sm-inline-block">
                <img
                    className="image-fluid"
                    src="http://clipartwork.com/wp-content/uploads/2017/02/clock-timer-clipart.png"
                    alt="Timer"
                    width={20}
                    height={20}
                />
            </div>
        </div>
    );

}

function DaySelector(props) {
    return (
        <div className="mt-3">
            <p>Select a day</p>
            <DropdownButton
                onSelect={props.handleClick}
                title={props.btnTitle}
                id="dropdown-no-caret"
                noCaret>
                <MenuItem eventKey="0">Sunday</MenuItem>
                <MenuItem eventKey="1">Monday</MenuItem>
                <MenuItem eventKey="2">Tuesday</MenuItem>
                <MenuItem eventKey="3">Wednesday</MenuItem>
                <MenuItem eventKey="4">Thursday</MenuItem>
                <MenuItem eventKey="5">Friday</MenuItem>
                <MenuItem eventKey="6">Saturday</MenuItem>
            </DropdownButton>
        </div>
    );
}

function TimeSelector(props) {
    return (
        <div className="mt-3">
            <p>Select a starting time</p>
            <ButtonToolbar>
                <DropdownButton
                    onSelect={props.handleHour}
                    title={props.hour}
                    noCaret>
                    <MenuItem eventKey="1">1</MenuItem>
                    <MenuItem eventKey="2">2</MenuItem>
                    <MenuItem eventKey="3">3</MenuItem>
                    <MenuItem eventKey="4">4</MenuItem>
                    <MenuItem eventKey="5">5</MenuItem>
                    <MenuItem eventKey="6">6</MenuItem>
                    <MenuItem eventKey="7">7</MenuItem>
                    <MenuItem eventKey="8">8</MenuItem>
                    <MenuItem eventKey="9">9</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="11">11</MenuItem>
                    <MenuItem eventKey="12">12</MenuItem>
                </DropdownButton>
                :
                <DropdownButton
                    onSelect={props.handleMin}
                    title={props.min}
                    noCaret>
                    <MenuItem eventKey="0">00</MenuItem>
                    <MenuItem eventKey="5">05</MenuItem>
                    <MenuItem eventKey="10">10</MenuItem>
                    <MenuItem eventKey="15">15</MenuItem>
                    <MenuItem eventKey="20">20</MenuItem>
                    <MenuItem eventKey="25">25</MenuItem>
                    <MenuItem eventKey="30">30</MenuItem>
                    <MenuItem eventKey="35">35</MenuItem>
                    <MenuItem eventKey="40">40</MenuItem>
                    <MenuItem eventKey="45">45</MenuItem>
                    <MenuItem eventKey="50">50</MenuItem>
                    <MenuItem eventKey="55">55</MenuItem>
                </DropdownButton>
                <DropdownButton
                    onSelect={props.handleNoon}
                    title={props.noon}
                    noCaret>
                    <MenuItem eventKey="am">am</MenuItem>
                    <MenuItem eventKey="pm">pm</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        </div>
    );

}

class MealEditor extends Component {

    constructor(props) {
        super(props);

        this.plannerHelper = new PlannerHelper();
        let startHr = "12",
            startMin = "00",
            noon = "pm",
            endHr = 0,
            endMin = 0,
            total,
            hr,
            endTime = "calculating ...",
            day = 0,
            days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        if(this.props.data) {
            var strStartTime = this.plannerHelper.getMealStartTime(props.data, this.props.day, this.props.mealIndex);
            var colon = strStartTime.indexOf(":");
            console.log(strStartTime);

            startHr = strStartTime.substring(0, colon);
            startMin = strStartTime.substring(colon + 1, colon + 3);
            endTime = this.plannerHelper.getMealEndTime(props.data, this.props.day, this.props.mealIndex);
            noon = strStartTime.slice(-2);
            day = this.props.day;

        }

        //convert duration to min
        let dur = 0;
        if (this.props.dur.length > 4) {
            let temp, temp2;
            temp = this.props.dur.slice(0, 2);
            temp2 = this.props.dur.slice(this.props.dur.indexOf("h") + 1, this.props.dur.length);

            //total min
            dur = parseInt(temp) * 60 + parseInt(temp2);
        } else {
            dur = parseInt(this.props.dur);
        }

        total = parseInt(startMin) + dur;
        hr = parseInt(startHr);
        while (total >= 60) {
            total = total - 60;
            hr += 1;
        }

        endMin = total;
        endHr = hr;

        this.state = {
            days: days,
            showEditor: false,
            dayOnBtn: days[day],
            hourOnBtn: startHr,
            minOnBtn: startMin,
            noonOnBtn: noon,
            endtime: endHr+":"+endMin,
            dur: dur,  //duration in minutes
            mealList: [],
            img: "http://travelmasters.ca/wp-content/uploads/2017/03/no-image-icon-4-1024x1024.png"
        };


        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleHourSelection = this.handleHourSelection.bind(this);
        this.handleMinSelection = this.handleMinSelection.bind(this);
        this.handleNoonSelection = this.handleNoonSelection.bind(this);
        this.renderButtonToolBar = this.renderButtonToolBar.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.renderMealList = this.renderMealList.bind(this);
        this.renderImg = this.renderImg.bind(this);
        this.printMealList = this.printMealList.bind(this);

        this.renderImg();
        this.renderMealList();
    }

    /** Updates day on button */
    handleDaySelection(evt) {
        this.setState({dayOnBtn: this.state.days[evt]});
    }

    /**Updates hour on button*/
    handleHourSelection(evt) {
        this.setState( {hourOnBtn: evt} );
        this.updateEndTime();
    }

    /**Updates min on button*/
    handleMinSelection(evt) {
        if(evt < 10) {
            evt = "0"+evt
        }

        this.setState( {minOnBtn: evt} );
        this.updateEndTime();
    }

    /** Updates noon on button */
    handleNoonSelection(evt) {
        this.setState({noonOnBtn: evt});
    }


    /**Method that opens Modal*/
    open() {
        this.setState( {showEditor: true} );
    }

    /**Method that closes modal*/
    close() {
        this.setState( {showEditor: false} );
    }

    /** creates/overwrites meal to the meal */
    update(transform) {
        this.close();
        var user = User.getUser();
        user.getPlanner((planner)=>{
            planner = transform(planner);
            //if(this.props.edit === true)
            //     window.location.reload();
            user.setPlanner(planner,()=> {console.log('success');if(this.props.edit === true){this.props.update(planner);}});
        })
    }

    remove() {
        let transform = (planner) => {
            this.plannerHelper.removeMeal(this.props.data,
                this.props.day,
                this.props.mealIndex);
            return this.props.data;
        };
        return transform;
    }

    updateEndTime() {
        let hour = parseInt(this.state.hourOnBtn),
            min = parseInt(this.state.minOnBtn);

        let total = min + this.state.dur;
        let hr = hour;

        while( total >= 60) {
            total = total - 60;
            hr += 1;
        }

        this.setState( {endtime: hr+":"+total});
    }

    edit() {
        var hour = parseInt(this.state.hourOnBtn),
            min = parseInt(this.state.minOnBtn);

        //convert to 24 hour
        if (this.state.noonOnBtn === "pm") {
            hour = hour + 12;
        } else if (this.state.noonOnBtn === "am" && hour === 12) {
            hour = hour - 12;
        }

        let transform = (planner) => {
            this.plannerHelper.editMeal(this.props.data,
                                        this.props.day,
                                        this.props.mealIndex,
                                        this.plannerHelper.createMeal(this.props.recipe,
                                                                        this.state.dur,
                                                                        hour,
                                                                        min),
                                                                        this.state.days.indexOf(this.state.dayOnBtn));
            return this.props.data;
        };
        return transform;
    }

    add() {
        var hour = parseInt(this.state.hourOnBtn),
            min = parseInt(this.state.minOnBtn);

        //convert to 24 hour
        if (this.state.noonOnBtn === "pm" && hour != 12) {
            hour = hour + 12;
        } else if (this.state.noonOnBtn === "am" && hour === 12) {
            hour = hour - 12;
        }

        let transform = (planner) => {
            this.plannerHelper.insertMeal(planner,
                this.plannerHelper.createMeal(this.props.recipe,
                    this.state.dur,
                    hour,
                    min),
                this.state.days.indexOf(this.state.dayOnBtn));
            return planner;
        };
        return transform;
    }

    renderButtonToolBar() {
        if (this.props.edit) {
            return (
                <ButtonToolbar>
                    <Button onClick={(e) => this.update(this.edit())}>Save</Button>
                    <Button bsStyle="danger" onClick={(e) => this.update(this.remove())}>Remove</Button>
                    <Button onClick={this.close}>Close</Button>
                </ButtonToolbar>
            );
        } else return (
            <ButtonToolbar>
                <Button onClick={(e) => this.update(this.add())}>Add</Button>
                <Button onClick={this.close}>Close</Button>
            </ButtonToolbar>
        );
    }

    renderMealList() {

        let user = User.getUser();

        user.getPlanner((planner)=>{
            let meals = this.plannerHelper.getDayMealList(planner, this.state.days.indexOf(this.state.dayOnBtn));
            let recipes = [];

            for(let i = 0; i < meals.length; i++) {
                recipes.push(meals[i].recipe[0]);
            }

            this.setState({mealList: recipes});
        });
    }

    renderImg() {
        let recipeHelper = new RecipeHelper();

        recipeHelper.loadRecipe(this.props.recipe, (data) => {
            if(data&&data.Image) {
                this.setState({img: Array.from(data.Image)[0]});
            }
        });
    }

    printMealList() {
            return (
                Object.keys(this.state.mealList).map((key) => {
                    return (
                        <li>{this.state.mealList[key]}</li>
                    );
                })
            );
    }


    render() {

        var editButton = (
                <a
                    className="card-link"
                    onClick={this.open}>{this.props.recipe}
                </a>
            ),
            addButton = (
                <a className="col-12"
                    onClick={this.open}>
                    <img alt="planner"
                         width="18"
                         height="18"
                         src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png" />
                </a>
            ),
            button;

        if (this.props.edit == true) {
            button = editButton;
        }
        else {
            button = addButton;
        }

        return (
            <div>
                {button}
            <Modal show={this.state.showEditor} onHide={this.close}>
                <Modal.Header>{this.props.recipe}</Modal.Header>
                <Modal.Body>
                    <figure>
                        <Link to={"/Recipes/" + this.props.recipe}>
                            <img
                                className="img-fluid"
                                src={this.state.img}
                                alt="No Image"
                            />
                        </Link>
                    </figure>

                    <figcaption>
                        <ul>
                        {this.printMealList()}
                        </ul>
                    </figcaption>

                    <Duration dur={this.props.dur}/>
                    <div className="border
                                    border-dark
                                    border-top-0
                                    border-right-0
                                    border-left-0
                                    mb-2">
                            <h2>Meal Info</h2>
                        </div>
                        <DaySelector
                            handleClick={this.handleDaySelection}
                            btnTitle={this.state.dayOnBtn}
                        />
                        <TimeSelector
                            handleHour={this.handleHourSelection}
                            handleMin={this.handleMinSelection}
                            handleNoon={this.handleNoonSelection}
                            hour={this.state.hourOnBtn}
                            min={this.state.minOnBtn}
                            noon={this.state.noonOnBtn}
                        />

                        <div className="mt-3">
                            <p>Your meal should be ready at {this.state.endtime}.</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderButtonToolBar()}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default MealEditor;
