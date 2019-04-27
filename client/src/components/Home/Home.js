import React, { Component } from "react";
import firebase from "firebase";
import "./home.css";
import Jumbotron from "../Jumbotron";


class Home extends Component {
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
      <section class="home">
        <container className="fluid ">
          <row>
            <div className="col">
              <Jumbotron message="Welcome" />
        
              {this.state.isSignedIn ? (
                <div className="col-sm-4">
           
                </div>
              ) : (
                <p> </p>
              )}
            </div>
          </row>
          <row class="full">
            <div class="full" />
          </row>
        </container>
      </section>
    );
  }
}

export default Home;
