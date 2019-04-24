import React, { Component } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

import { auth, provider, startFirebaseUI } from "../Firebase/Firebaseconfig";

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      user: null
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
  }

  componentDidMount() {
    startFirebaseUI ('#firebaseui');
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
  
  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }



  render() {
    return (
      <div className="header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="/">
            Bueno
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* <div id="firebaseui"></div> */}
          <div className="collapse navbar-collapse" id="navbarText">
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
              <div className="navbar-nav ml-auto">
                {/* add logic to check if user is logged on */}
                {this.state.user ? (
                  <div>
                <span className="navbar-text">
                  Welcome, {this.state.user.displayName}
                </span>
                <span></span>
                <button onClick={this.logout}type="button" class="btn btn-primary btn-sm">
                  Log Out
                </button>
               
                </div>
                ) : (
                  // <button onClick={this.login} type="button" class="btn btn-primary btn-sm">Log In</button>
                  <button onClick={"/login"} type="button" class="btn btn-primary btn-sm">Log In</button>

            //       <LinkContainer to="/login">
            //   <NavItem>Login</NavItem>
            // </LinkContainer>
                )}
              </div>
            </div>
          </div>
        </nav>
        <br />
      </div>
    );
  }
}

export default Nav;
