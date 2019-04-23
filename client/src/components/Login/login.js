import React, { Component } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth, provider, startFirebaseUI } from "../Firebase/Firebaseconfig";

class Login extends Component {
  state = {isSignedIn: false}
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks:{
      signInSuccess: () => false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn: !!user})
    })
  }

  render() {
    return (
      <div classname="Login">
      {this.state.isSignedIn ? (
        <div>Signed In!</div>
      ):(
        // <div>Sign in to play!</div>
        <StyledFirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
        />
           )}
      </div>
    )
}
}

export default Login;
