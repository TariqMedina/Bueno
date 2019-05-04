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
    startFirebaseUI('#firebaseui');
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
      
      </div>
      /*<div className="header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="d-flex w-50 order-0">
            <a className="navbar-brand mr-1" href="/">Bueno</a>
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
          </div>

          <div className="collapse navbar-collapse justify-content-end order-2" id="collapsingNavbar">
            <div className="navbar-nav justify-content-end">
              {this.state.user ? (
                <div>
                  <span className="navbar-text small">
                    Welcome, {this.state.user.displayName}
                  </span>
                  <span className="navbar-text small text-truncate mt-1 w-50 text-right order-1 order-md-last">
                    <button onClick={this.logout} type="button" class="btn btn-primary btn-sm">
                      Log Out
                </button>
                  </span>
                </div>
              ) : (
                  <button onClick={"/login"} type="button" class="btn btn-primary btn-sm">Log In</button>
                )}
            </div>
          </div>
        </nav>
        <br />
      </div>//End of header*/
    );
  }
}

export default Nav;
