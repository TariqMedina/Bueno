import React, { Component } from "react";
import "./style.css";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";


class Jumbotron extends Component {
  state = { isSignedIn: false };
uiConfig = {
  signInFlow: "popup",
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
      <h1>Bueno</h1>
      <p>
      Spice up your life with Bueno, a digital version of Uno, the popular card game!
      </p>
      {this.state.isSignedIn ? (
              <div>
              
              <h2>Welcome to Bueno, {firebase.auth().currentUser.displayName}</h2>
              <hr/>
                  <a className="btn btn-primary btn-lg" href="/game" role="button">Join the Game!</a>
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
