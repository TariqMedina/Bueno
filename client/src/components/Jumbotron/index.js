import React, { Component } from 'react';
import './style.css';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import image from './bueno-logo.png';

class Jumbotron extends Component {
  state = {
    user: null,
    username: '',
    isSignedIn: false,
    activePlayers: [],
    gameMessage: 'Join the Game!',
    gameBtnClass: 'btn btn-primary btn-lg join-btn',
    disabled: false,
    redirect: false
  };

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

  handleClick = () => {
    console.log('hello');
    if (this.state.activePlayers.length < 4) {
      this.setState({
        activePlayers: [
          ...this.state.activePlayers,
          firebase.auth().currentUser.displayName
        ],
        username: firebase.auth().currentUser.displayName
      });
      //push current user to firebase
      const playersRef = firebase.database().ref('players');
      const player = {
        user: this.state.username
      };
      playersRef.push(player);
    } else {
      this.setState({
        gameMessage: 'Sorry, we have 4 players. Please wait',
        gameBtnClass: 'btn btn-info btn-lg join-btn',
        disabled: true
      });
      console.log('sorry we have enough players');
    }
  };

  // assign players
  //++++++

  assignPlayers = () => {
    console.log('player assignment begins');
    //I need to know the username from handleClick
  };
  // ++++

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
            {/* <a className="btn btn-primary btn-lg" href="/game" role="button">
              Join the Game!
            </a> */}
            <button
              className={this.state.gameBtnClass}
              onClick={this.handleClick}
              role="button"
              disabled={this.state.disabled ? true : false}
            >
              {this.state.gameMessage}
            </button>
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
