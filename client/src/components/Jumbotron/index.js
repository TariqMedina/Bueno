import React, { Component } from 'react';
import './style.css';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import image from './bueno-logo.png';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';

class Jumbotron extends Component {
  state = { 
    isSignedIn: false,
    firebasePlayers: "",
    activePlayers: [],
    toGame: false,
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
    let firebasePlayers;
    firebase.database().ref('/players').on('value', (snapshot) => {
      if(snapshot.val() === null){
        firebasePlayerListCount = 0;
      } else {
        
        firebasePlayers = this.snapshotToArray(snapshot);
        firebasePlayerListCount = Object.keys(snapshot.val()).length;
      }
      //console.log(firebasePlayerListCount);
      this.setState({
        firebasePlayers: firebasePlayerListCount
      }, () => {
        if(this.state.firebasePlayers > 0){
          this.setState({
            activePlayers: [...firebasePlayers]
          })
        }
        if(this.state.firebasePlayers === 4){
          this.setState({
            gameMessage: 'Sorry, we have 4 players. Please wait',
            gameBtnClass: 'btn btn-info btn-lg join-btn',
            disabled: true
          })
        } else {

        }
      })
    })
    //this.setState({})
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });
  }

  snapshotToArray = (snapshot) => {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        console.log("snapshotArray function: " + JSON.stringify(item));
        item.key = childSnapshot.key;
        item.profilePic = firebase.auth().currentUser.photoURL;

        returnArr.push(item);
    });

    return returnArr;
  };

  handleClick = () => {
    if (this.state.firebasePlayers <= 4) {
      console.log('hello less than 4');

      //push current user to firebase
      const playersRef = firebase.database().ref('players');
      let user = firebase.auth().currentUser.email;
      let name = firebase.auth().currentUser.displayName;
      const player = {
        user: user,
        name: name
      };
      playersRef.push(player);

      let firebasePlayers;
      playersRef.on('value', (snap) => {
        firebasePlayers = snap.val();
      })

      this.setState({
        gameMessage: "Waiting for other players... ",
        disabled: true
      });
      
      playersRef.on('value', (snap) => {
        let firebasePlayerListCount = Object.keys(snap.val()).length;
        if(firebasePlayerListCount === 4){
          console.log("4 players in the game, start game!");
          this.setState({
            toGame: true
          })
        }
      })
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
    if (this.state.toGame === true) {
      return <Redirect
              to={{
                pathname: "/game",
                state: { activePlayers: this.state.activePlayers }
              }}
            />
    }
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
            {/*<Link to={{ pathname: '/game', state: { userName: firebase.auth().currentUser.displayName} }}>*/}
            <button
                className={this.state.gameBtnClass}
                onClick={this.handleClick}
                role="button"
                disabled={this.state.disabled ? true : false}
              >
                {this.state.gameMessage}. {this.state.firebasePlayers}/4
              </button>
        {/*</Link>*/}
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
