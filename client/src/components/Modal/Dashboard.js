import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import firebase from 'firebase';
import Chat from '../Chat/Chat';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="row">
          <div className="col-4">{children}</div>
        </div>
        <div className="row">
          <div className="col-4">
            <button
              onClick={handleClose}
              className="btn"
              style={{
                position: 'fixed',
                bottom: '500px',
                right: 0,
                zIndex: 3,
                width: 'auto',
                backgroundColor: 'white',
                color: 'black',
                // background: 'white'
              }}
            >
              close
            </button>
          </div>
        </div>
      </section>
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
          <section className="open-chat">
            <h3 className="text-center" />
            <Modal show={this.state.show} handleClose={this.hideModal}>
              <Chat username={firebase.auth().currentUser} />
            </Modal>
            <button
              type="button"
              onClick={this.showModal}
              className="btn btn-primary"
            >
              open chat
            </button>
          </section>
        ) : (
          <p />
        )}
      </main>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<Dashboard />, container);

export default Dashboard;
