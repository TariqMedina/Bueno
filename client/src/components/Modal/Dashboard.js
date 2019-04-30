import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import firebase from "firebase";
import Chat from "../Chat/Chat";



const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
    <div className="col-sm-4">
      <section className="modal-main">
        {children}
        <button onClick={handleClose} className="btn btn-primary modal-btn">close chat</button>
      </section>
      </div>
    </div>
  );
};

class Dashboard extends Component {
  state = { show: false, isSignedIn: false };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });
  }

  render() {
    return (
      
      <main>
        {this.state.isSignedIn ? (
          <section>
         <h3 className="text-center bueno-chat">Bueno Chat</h3>
        <Modal show={this.state.show} handleClose={this.hideModal}>
        <p className="bueno-chat">Show Chat</p>
        <Chat username={firebase.auth().currentUser}/>
        </Modal>
        <button type="button" onClick={this.showModal} className="btn btn-danger open-chat">
         open chat
        </button>
        </section>
        ):(
<p></p>
        )}
      </main>
    );
  }
}

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<Dashboard />, container);

export default Dashboard;