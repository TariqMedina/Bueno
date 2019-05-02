import React, { Component } from 'react';
import './style.css';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import image from './bueno-logo.png';
import { Link } from "react-router-dom";

class Jumbotron extends Component {
  state = { isSignedIn: false };
  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });
  }

  render() {
    return (
      <div className="jumbotron text-center">
        <img className="bueno-logo" src={image} />
        <p className="intro-text">
          Spice up your life with Bueno, a digital version of Uno, the popular
          card game!
        </p>
        {this.state.isSignedIn ? (
          <div>
            <h2>
              Welcome to Bueno, {firebase.auth().currentUser.displayName}!
            </h2>
            <br />
            <br />
            <Link to={"/game"}>
            <button className="btn btn-primary btn-lg" role="button">
              Join the Game!
            </button>
            </Link>
          </div>
        ) : (
          // <a className="btn btn-primary btn-lg" href="/login" role="button">Log in to play!</a>
          <span>
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </span>
        )}
      </div>
    );
  }
}

export default Jumbotron;
