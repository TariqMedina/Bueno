import React, { Component } from 'react';
import './Form.css';
import Message from '../Message/Message';
import firebase from 'firebase';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser.displayName,
      message: '',
      list: []
    };
    this.messageRef = firebase
      .database()
      .ref()
      .child('messages');
    this.listenMessages();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ user: nextProps.user.displayName });
    }
  }
  handleChange(event) {
    this.setState({ message: event.target.value });
  }
  handleSend() {
    if (this.state.message) {
      var newItem = {
        user: this.state.user,
        message: this.state.message
      };
      this.messageRef.push(newItem);
      console.log(this.state.user);
      this.setState({ message: '' });
    }
  }
  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();
  }
  // listenMessages() {
  //   this.messageRef
  //     .limitToLast(10)
  //     .on('value', message => {
  //       if(message.val() !== undefined) {
  //         var message = message.val();
  //         var newList = this.state.list;
  //         newList.push(message);
  //         this.setState({
  //           list: newList
  //         });
  //       }
  //     });
  // }
  listenMessages() {
    this.messageRef.limitToLast(10).on('value', message => {
      this.setState({
        list: Object.values(message.val())
      });
    });
  }

  render() {
    return (
      <div
        style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 5000 }}
        className="form"
      >
        <div className="form__message">
          {this.state.list.map(
            (item, index) => (
              <Message key={index} message={item} />
            )
            // item-component as key eg. username+something else
          )}
        </div>
        <div className="form__row">
          <input
            className="form__input"
            type="text"
            placeholder="Type message"
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <button className="form__button" onClick={this.handleSend.bind(this)}>
            send
          </button>
        </div>
      </div>
    );
  }
}
