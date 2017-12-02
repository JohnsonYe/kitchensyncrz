/**
 * Title: homePage.js
 * Author: Andrew Sanchez
 * Date Created: 11/2/2017
 * Description: This file will serve as the Homepage Content
 */
import React, { Component } from 'react';

class Homepage extends Component {
    constructor(props){
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        this.state = {
            cursorWidth:100,
            cursorHeight:100,
        }

        this.moveCallback = ((e)=>{
            this.setState({
                transform:{
                    'left': e.pageX-this.state.cursorWidth/2,
                    'top' : e.pageY-this.state.cursorHeight/2,
                }
            });
        });
    }
    componentWillMount(){
        document.addEventListener('mousemove',this.moveCallback)
    }
    componentWillUnmount(){
        document.removeEventListener('mousemove',this.moveCallback);
    }
    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h1>Kitchen Sync</h1>
                </div>
                <div className="container-fluid">
                    Homepage content goes here ... Our Website is currently under construction
                    <p className="text-center"><button className="btn btn-success btn-large" id='mortens_button' onClick={(e)=>this.setState({showFollower:!this.state.showFollower})}>MORTEN'S BUTTON</button></p>
                </div>
                <div className="popover bs-tether-element bs-tether-element-attached-middle bs-tether-element-attached-left bs-tether-target-attached-middle bs-tether-target-attached-right fade bs-tether-enabled" role="tooltip" id="popover640845" container='btn' >
                    <h3 className="popover-title">Popover title</h3>
                    <div className="popover-content">And here's some amazing content. It's very engaging. Right?</div>
                </div>
                <div className='pbj-follower' style={{...this.state.transform,cursor:'none',display:this.state.showFollower?'inline':'none'}}>
                    <img src='/images/Peanut-butter-jelly-time.gif' width={this.state.cursorWidth+'px'} height={this.state.cursorHeight+'px'}/>
                </div>
            </div>
        
        );

    }
}

export default Homepage;
