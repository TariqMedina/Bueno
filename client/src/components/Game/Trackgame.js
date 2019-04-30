import React, { Component } from "react";


import { auth, provider, startFirebaseUI } from "../Firebase/Firebaseconfig";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      user: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleQuit = this.handleQuit.bind(this);
    // this.login = this.login.bind(this); // <-- add this line
    // this.logout = this.logout.bind(this); // <-- add this line
  }

  componentDidMount() {
    startFirebaseUI("#firebaseui");
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  //When user clicks game or join game do the following
  //1. Grab their name from FB - state.activeplayers - push to array
  //2. check number of players in playerarray. If playerarray.length<4 allow them to join and assign them a player number. Display their name and photo in the card deck next to them. 
  //3 If playerarray.length=4 display a message that they cannot join
  //4. If a player quits game, remove them from the player array
}