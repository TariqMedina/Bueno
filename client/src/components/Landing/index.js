import React, { Component } from "react";
import logo from "./logo.svg";
import "./Landing.css";
import firebase, { auth, provider } from "./firebase.js";

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    };

    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: ""
    });
  }
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    const itemsRef = firebase.database().ref("items");

    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Bueno</h1>
            <i class="fas fa-cubes"></i>
            {this.state.user ? (
              <div>
              <p> Welcome, {this.state.user.displayName}</p>
              <button onClick={this.logout}>Log Out</button>
              
              </div>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        {this.state.user ? (
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} />
            </div>
            <div className="container">
              <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="What's your name?"
                    value={this.state.user.displayName || this.state.user.email}
                  />
                  <input
                    type="text"
                    name="currentItem"
                    placeholder="What are you bringing?"
                    onChange={this.handleChange}
                    value={this.state.currentItem}
                  />
                  <button>Add Item</button>
                </form>
              </section>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>
              Log in to play!
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Landing;
