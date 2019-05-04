import React, { Component } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import firebase from "firebase";

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
    let img = "";
    if (firebase.auth().currentUser != undefined) {
      if (firebase.auth().currentUser.photoURL != undefined) {
        if (firebase.auth().currentUser.photoURL.length > 0) {
          img = (
            <img
              className="profile-pic"
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
          );
        }
      }
    }

    return (
      <div className="header">
        <nav className="bueno-nav">
          <div className="row">
            <div className="col-md-2 col-sm-12">
            <div className="bueno-brand-text">
              <a className="navbar-brand mr-1 " href="/">Bueno!</a>
            </div>
            </div>
            <div className="col-sm-2 col-xs-4">
            <div className="game-btn">
              <span className="navbar-text mr-auto">
                {this.state.user ? (
                  <Link to="/game" className={"btn btn-primary"}>
                    Game
                </Link>
                ) : (
                    <p/>
                  )}
              </span>
              </div>
            </div>


            <div className="col-md-6 col-sm-8 col-xs-4">
              <div className="welcome-container">
                
                  {this.state.user ? (
                    <span className="navbar-text welcome">
                      {img}
                      Welcome, {this.state.user.displayName}
                    </span>
                  ) : (
                      <span className="navbar-text welcome">
                        <i className="fab fa-canadian-maple-leaf" />
                      </span>
                    )}
                
              </div>
            </div>

            <div className="col-md-2 col-sm-2 col-xs-4">
              <div className="login-container">
                
                  {this.state.user ? (
                    <span className="navbar-text">
                      <button
                        onClick={this.logout}
                        type="button"
                        class="btn btn-primary"
                      >
                        Log Out
                    </button>
                    </span>
                  ) : (
                      <span className="navbar-text">
                        <Link to="/" className={"btn btn-primary"}>
                          Login
                      </Link>
                      </span>
                    )}
                
              </div>
            </div>
          </div>
        </nav>
      </div>

      /*
      <div className="header">
        <nav className="navbar navbar-expand-md navbar-dark bg-primary justify-content-end">
          <a className="navbar-brand mr-1" href="/">
            Bueno
          </a>
          <div className="d-flex w-50 order-0">

            <span className="navbar-text mr-auto">
              {this.state.user ? (
                <Link to="/game" className={"btn btn-primary"}>
                  Game
                </Link>
              ) : (
                  <p />
                )}
            </span>
          </div>
          <div className="justify-content-start order-1">
            <div className="navbar-nav">
              {this.state.user ? (
                <span className="navbar-text welcome">
                  {img}
                  Welcome, {this.state.user.displayName}
                </span>
              ) : (
                  <span className="navbar-text welcome">
                    <i class="fab fa-canadian-maple-leaf" />
                  </span>
                )}
            </div>
          </div>
          {this.state.user ? (
            <span className="navbar-text small text-truncate mt-1 text-right order-1 order-md-last">
              <button
                onClick={this.logout}
                type="button"
                class="btn btn-primary"
              >
                Log Out
              </button>
            </span>
          ) : (
              <span className="navbar-text small text-truncate mt-1 text-right order-1 order-md-last">
                <Link to="/" className={"btn btn-primary"}>
                  Login
              </Link>
              </span>
            )}
        </nav>
      </div>
      */

    );
  }
}

export default Nav;
