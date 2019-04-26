import React, { Component } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth, provider, startFirebaseUI } from "../Firebase/Firebaseconfig";
import "../Login/login.css"
import Chat from "../Chat/Chat"

class Login extends Component {
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
      <container className="fluid">
        <row>
          <div className="col-sm-6">
          <div classname="Login">
            {this.state.isSignedIn ? (
              <div>
              
              <h2>Welcome to Bueno, {firebase.auth().currentUser.displayName}</h2>
              <Chat username={firebase.auth().currentUser}/>
              </div>
              
            ) : (
              <span>
              <h2 className="justify-content-center">Sign In</h2>
              <StyledFirebaseAuth
              
                uiConfig={this.uiConfig}

                firebaseAuth={firebase.auth()}
              />
              </span>
            )}
          </div>
          </div>
        </row>
      </container>
    );
  }
}

export default Login;
