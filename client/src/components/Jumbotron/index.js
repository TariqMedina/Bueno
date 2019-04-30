import React, { Component } from 'react';
import './style.css';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Jumbotron extends Component {
  state = {
    user: null,
    isSignedIn: false,
    activePlayers: [],
    gameMessage: 'Join the Game!',
    gameBtnClass: 'btn btn-primary btn-lg',
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
        redirect:true
      });
      
      render () {
        return (
           <div>
            {this.renderRedirect()}
            <button onClick={this.setRedirect}>Redirect</button>
           </div>
        )
      }
    } else {
      this.setState({
        gameMessage: 'Sorry, we have 4 players. Please wait',
        gameBtnClass: 'btn-secondary btn-lg',
        disabled: true
      });
      console.log('sorry we have enough players');
    }
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/game" />;
    }
  };

  render() {
    return (
      <div className="jumbotron text-center">
        <h1>Bueno</h1>
        <p>
          Spice up your life with Bueno, a digital version of Uno, the popular
          card game!
        </p>
        {this.state.isSignedIn ? (
          <div>
            <h2>Welcome to Bueno, {firebase.auth().currentUser.displayName}</h2>
            <hr />
            {/* <a className="btn btn-primary btn-lg" href="/game" role="button">Join the Game!</a> */}
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
