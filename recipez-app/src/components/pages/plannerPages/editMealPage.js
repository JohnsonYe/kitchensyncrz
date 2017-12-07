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
        if (this.props.dur.includes("h")) {
            let temp, temp2;
            temp = this.props.dur.slice(0, 2);
            temp2 = this.props.dur.slice(this.props.dur.indexOf("h") + 1, this.props.dur.length);

            //total min
            dur = parseInt(temp) * 60 + parseInt(temp2);
        } else {
            dur = parseInt(this.props.dur);
        }

        this.state = {
            days: days,
            showEditor: false,
            dayOnBtn: days[day],
            hourOnBtn: startHr,
            minOnBtn: startMin,
            noonOnBtn: noon,
            endtime: endTime,
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
        //this.renderMealList = this.renderMealList.bind(this);
        this.renderImg = this.renderImg.bind(this);
        //this.printMealList = this.printMealList.bind(this);

        this.renderImg();
        // this.renderMealList();

    }

    /** Updates day on button */
    handleDaySelection(evt) {
        this.setState({dayOnBtn: this.state.days[evt]});
    }

    /**Updates hour on button*/
    handleHourSelection(evt) {
        this.setState( {hourOnBtn: evt} );
    }

    /**Updates min on button*/
    handleMinSelection(evt) {
        if(evt < 10) {
            evt = "0"+evt
        }

        this.setState( {minOnBtn: evt} );
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
        var user = User.getUser();
        user.getPlanner((planner)=>{
            planner = transform(planner);
            //if(this.props.edit === true)
            //     window.location.reload();
            console.log('test pack: '+JSON.stringify(planner));
            user.setPlanner(planner,()=> {
                console.log('success');
                if(this.props.edit === true){
                    this.props.update(planner);
                     this.renderImg();
                 }
             });
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
        var hour = parseInt(this.state.hourOnBtn),
            min = parseInt(this.state.minOnBtn),
            noon = this.state.noonOnBtn;

        //alert(JSON.stringify(hour));

        if( noon == "am") {
            if (hour == 12) {
                hour = 0;
            }
        }
        else if (noon == "pm" && hour == "12"){
            hour = 12;
        }
        else {
            hour = 12 + hour;
        }

        let total = min + this.state.dur;
        let hr = hour;

        while( total >= 60) {
            total = total - 60;
            hr += 1;
        }

        //check if hr passed to the next day
        while (hr >= 24) {
            hr = hr - 24;  //converts to correct time
        }

        return hr+":"+total;
    }

    edit() {
        var hour = parseInt(this.state.hourOnBtn),
            min = parseInt(this.state.minOnBtn),
            noon = this.state.noonOnBtn;

            //alert(JSON.stringify(hour));

        if( noon == "am") {
            if (hour == 12) {
                hour = 0;
            }
        }
        else if (noon == "pm" && hour == "12"){
            hour = 12;
        }
        else {
            hour = 12 + hour;
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
            min = parseInt(this.state.minOnBtn),
            noon = this.state.noonOnBtn;

            //alert(JSON.stringify(hour));

        if( noon == "am") {
            if (hour == 12) {
                hour = 0;
            }
        }
        else if (noon == "pm" && hour == "12"){
            hour = 12;
        }
        else {
            hour = 12 + hour;
        }

        
        let transform = (planner) => {
            let meal = this.plannerHelper.createMeal(this.props.recipe,this.state.dur,hour,min);
            console.log('created meal: '+JSON.stringify(meal));
            this.plannerHelper.insertMeal(planner,meal,this.state.days.indexOf(this.state.dayOnBtn));
            console.log('updated planner: '+JSON.stringify(planner));
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

    renderImg() {
        let recipeHelper = new RecipeHelper();

        recipeHelper.loadRecipe(this.props.recipe, (data) => {
            if(data&&data.Image) {
                this.setState({img: Array.from(data.Image)[0]});
            }
        });
    }

    render() {

        var editButton = (
                <a
                    className="card-link"
                    onClick={this.open}>{this.props.recipe}
                </a>
            ),
            addButton = (
                <a className="btn btn-dark"
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
                            update={this.updateEndTime}
                        />

                        <div className="mt-3">
                            <p>Your meal should be ready at {this.updateEndTime()}.</p>
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
