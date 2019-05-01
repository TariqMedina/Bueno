import React, { Component } from 'react';
import './Chat.css';
import Form from '../Form/Form';
import firebase from 'firebase';
import firebaseConfig from '../Firebase/Firebaseconfig';

// firebase.initializeApp(firebaseConfig);
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    }
  }
  
  // componentDidMount() {
  //   firebase.auth().onAuthStateChanged(user => {
  //     this.setState({ user });
  //     console.log(user)
  //   });
  // }
  // handleSignIn() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(provider);
  // }
  // handleLogOut() {
  //   firebase.auth().signOut();
  // }
  
  render() {
    return (
      <div className="app">
        {/* <div className="app__header">
          
          <h2>
            Bueno Chat
          </h2>
          { !this.state.user ? (
            <button
              className="app__button"
              onClick={this.handleSignIn.bind(this)}
            >
              Sign in
            </button>
          ) : (
            <button
              className="app__button"
              onClick={this.handleLogOut.bind(this)}
            >
              Logout
            </button>
          )}
        </div> */}
        <div className="app__list">
          <Form user={this.state.user} />
        </div>
      </div>
      
    );
  }
}
export default Chat;