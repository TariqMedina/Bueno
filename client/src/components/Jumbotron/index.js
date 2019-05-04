import React, { Component } from 'react';
import './style.css';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import image from './bueno-logo.png';
import { Link } from "react-router-dom";

class Jumbotron extends Component {
  state = { 
    isSignedIn: false,
    firebasePlayers: "",
    activePlayers: [],
    gameMessage: 'Join the Game!',
    gameBtnClass: 'btn btn-primary btn-lg join-btn',
    disabled: false,
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
    let firebasePlayerListCount;
    firebase.database().ref('/players').on('value', (snapshot) => {
      if(snapshot.val() === null){
        firebasePlayerListCount = 0;
      } else {
        firebasePlayerListCount = Object.keys(snapshot.val()).length;
      }
      //console.log(firebasePlayerListCount);
      this.setState({
        firebasePlayers: firebasePlayerListCount
      }, () => {
        if(this.state.firebasePlayers === 4){
          this.setState({
            gameMessage: 'Sorry, we have 4 players. Please wait',
            gameBtnClass: 'btn btn-info btn-lg join-btn',
            disabled: true
          })
        }
      })
    })
    //this.setState({})
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });
  }

  handleClick = () => {
    if (this.state.firebasePlayers <= 4) {
      console.log('hello less than 4');
      this.setState({
        activePlayers: [
          ...this.state.activePlayers,
          firebase.auth().currentUser.displayName
        ]
      });
      //push current user to firebase
      const playersRef = firebase.database().ref('players');
      const player = {
        user: firebase.auth().currentUser.email,
        name: firebase.auth().currentUser.displayName,
        // displayImg: firebase.auth().currentUser.photoURL
      };
      playersRef.push(player);
    } else {
      console.log('hello greater than 4');
      this.setState({
        gameMessage: 'Sorry, we have 4 players. Please wait',
        gameBtnClass: 'btn btn-info btn-lg join-btn',
        disabled: true
      });
      console.log('sorry we have enough players');
    }
  }

  render() {
    return (
      <div className="jumbotron text-center">
        <img className="bueno-logo" src={image} alt="bueno logo" />
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
            <Link to={{ pathname: '/game', state: { userName: firebase.auth().currentUser.displayName, displayImg: firebase.auth().currentUser.photoURL} }}>
            <button
                className={this.state.gameBtnClass}
                onClick={this.handleClick}
                role="button"
                disabled={this.state.disabled ? true : false}
              >
                {this.state.gameMessage}
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
