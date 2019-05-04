import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Col, Row, Container } from "../components/Grid";
// import Modals from "../components/Modal"
import cards from "./cards.js"
import "./style.css";

// var Modal = require('react-bootstrap-modal')
const io = require('socket.io-client');
// var socket = io('ws://localhost:3001', { transports: ['websocket'] });
var socket = io('https://glacial-savannah-39108.herokuapp.com/', { transports: ['websocket'] });
// const socket = io('http://localhost:3000');

const Player1 = {
    name: "Player1",
    isActive: false,

};
const Player2 = {
    name: "Player2",
    isActive: false,
};
const Player3 = {
    name: "Player3",
    isActive: false,
};
const Player4 = {
    name: "Player4",
    isActive: false,
};

var myDeck = [];
let backCard = cards.splice(cards.length - 1, 1);

function startgame() {
    myDeck = shuffle(cards);

    Player1.cards = myDeck.splice(0, 7);
    Player2.cards = myDeck.splice(0, 7);
    Player3.cards = myDeck.splice(0, 7);
    Player4.cards = myDeck.splice(0, 7);
}

startgame();


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var myname = "Player";
var myimg = "img";

class Game extends Component {
    state = {
        allPlayers: [Player1, Player2, Player3, Player4],
        playerOrder: [],
        setPlayers: 0,
        // card,
        Player1: Player1,
        Player2: Player2,
        Player3: Player3,
        Player4: Player4,
        showModal: false,
        drawn: false,
        backCard: backCard[0],
        alert: "Waiting for players",
        currentPlayer: 0,
        turnOrder: true,
        drawPile: myDeck,
        discardPile: [],
        Player1cards: [],
        Player2cards: [],
        Player3cards: [],
        Player4cards: [],
        playCard: "",
        show: false,
    };

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount() {

        let player = this.state.Player1;
        // player.isActive = true;
        // this.setState({Player1:player});
        socket.on('stateChange', (myState) => { this.defineOrder(myState) });
        var playerName = window.prompt("Please enter your username");
        myname = playerName;
        this.addPlayer(playerName);
        socket.on('playerAdded', (currentState) => this.setNewPlayer(currentState));
        // console.log(this.props.location.state.userName);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillUnmount() {
        socket.off('stateChange');
        socket.off('playerAdded');
    }


    addPlayer = (playerName) => {
        socket.emit('connected', playerName);
        var setPlayers = this.state.setPlayers + 1;
        var allPlayer = this.state.allPlayers;
        var playerOrder = this.state.playerOrder;
        if (setPlayers === 1) {
            allPlayer[0].name = playerName
            playerOrder.push(playerName);
        }
        this.setState({
            setPlayers: setPlayers,
            allPlayers: allPlayer,
            Player1: allPlayer[0],
            Player2: allPlayer[1],
            Player3: allPlayer[2],
            Player4: allPlayer[3],
            playerOrder: playerOrder
        }, () => { socket.emit('setPlayer', this.state) })
        console.log(allPlayer)
    }

    setNewPlayer = (currentState) => {
        console.log(currentState.allPlayers)
        var playerName = currentState.playerName;
        var setPlayers = currentState.setPlayers + 1;
        console.log(setPlayers);
        var allPlayer = currentState.allPlayers;
        var playerOrder = currentState.playerOrder;
        if (playerOrder.find(player => player === playerName)) {
            var thisIndex = allPlayer.findIndex(player => player.name === playerName);
            allPlayer[thisIndex].name = playerName;
            setPlayers--;
        }
        else if (setPlayers < 5) {
            playerOrder.push(playerName)
            if (setPlayers === 1) {
                allPlayer[0].name = playerName;

            }
            else if (setPlayers === 2) {
                allPlayer[1].name = playerName;
            }
            else if (setPlayers === 3) {
                allPlayer[2].name = playerName;
            }
            else if (setPlayers === 4) {
                allPlayer[3].name = playerName;
                startgame();
            }
        }
        console.log(playerOrder);
        this.setState({
            playerOrder: playerOrder
        })
        this.defineOrderStart(allPlayer, setPlayers);
        this.setState({
            setPlayers: setPlayers,
            allPlayers: allPlayer,
            Player1: allPlayer[0],
            Player2: allPlayer[1],
            Player3: allPlayer[2],
            Player4: allPlayer[3],
            alert: "Waiting for players"
        }, () => { socket.emit('setPlayer', this.state) })
        console.log(setPlayers)



        if (setPlayers === 4) {
            this.startNew();
        }
    }

    defineOrderStart = (allPlayer, setPlayers) => {
        var myindex = allPlayer.findIndex(x => x.name === myname);
        if (myindex !== 0) {
            let existingPlayer = allPlayer.splice(0, myindex);
            allPlayer.push(...existingPlayer);
            console.log(allPlayer);
            // return allPlayer;
        }
    }

    startNew = () => {
        var players = this.state.playerOrder;
        var allPlayer = this.state.allPlayers;
        console.log("Starting the game")
        var myIndex = allPlayer.findIndex(x => x.name === players[0]);
        allPlayer[myIndex].isActive = true;
        this.setState({
            allPlayers: allPlayer,
            Player1: allPlayer[0],
            Player2: allPlayer[1],
            Player3: allPlayer[2],
            Player4: allPlayer[3],
            currentPlayer: myIndex,
            alert: "Start the game! " + allPlayer[myIndex].name + "'s turn"
        });
    }

    defineOrder = (myState) => {
        let current = myState.currentPlayer;
        let statePlayer = myState.allPlayers;
        let thisPlayer = myState.allPlayers[current];
        let allPlayer = [];
        var myIndex = statePlayer.findIndex(x => x.name === myname);
        if (myIndex === 0) {
            allPlayer[0] = statePlayer[0];
            allPlayer[1] = statePlayer[1];
            allPlayer[2] = statePlayer[2];
            allPlayer[3] = statePlayer[3];
            current = allPlayer.findIndex(x => x.name === thisPlayer.name);
        }
        else if (myIndex === 1) {
            allPlayer[0] = statePlayer[1];
            allPlayer[1] = statePlayer[2];
            allPlayer[2] = statePlayer[3];
            allPlayer[3] = statePlayer[0];
            current = allPlayer.findIndex(x => x.name === thisPlayer.name);
        }
        else if (myIndex === 2) {
            allPlayer[0] = statePlayer[2];
            allPlayer[1] = statePlayer[3];
            allPlayer[2] = statePlayer[0];
            allPlayer[3] = statePlayer[1];
            current = allPlayer.findIndex(x => x.name === thisPlayer.name);
        }
        else if (myIndex === 3) {
            allPlayer[0] = statePlayer[3];
            allPlayer[1] = statePlayer[0];
            allPlayer[2] = statePlayer[1];
            allPlayer[3] = statePlayer[2];
            current = allPlayer.findIndex(x => x.name === thisPlayer.name);
        }
        this.setState({
            allPlayers: allPlayer,
            Player1: allPlayer[0],
            Player2: allPlayer[1],
            Player3: allPlayer[2],
            Player4: allPlayer[3],
            currentPlayer: current,
            playCard: myState.playCard,
            alert: thisPlayer.name + "'s turn"
        })
    }

    handleTurn = (card) => {

        let allPlayer = this.state.allPlayers;
        let current = this.state.currentPlayer;
        let thisPlayer = this.state.allPlayers[current];

        let inPlay = this.state.playCard;
        let turnOrder = this.state.turnOrder;


        if (inPlay === "") {
            thisPlayer.isActive = false;
            thisPlayer.cards = thisPlayer.cards.filter(function (a) {
                return a !== card;
            })
            allPlayer[current] = thisPlayer;
            this.setState({
                allPlayers: allPlayer
            })
            if (card.value === "reverse") {
                turnOrder = !turnOrder;
                this.setState({
                    turnOrder: turnOrder
                })
            }
            if (card.value === "skip") {
                this.handleSkip(turnOrder, current, allPlayer, card)
            }
            else {
                this.handleNextTurn(turnOrder, current, allPlayer, card)
            }
        }
        else if (inPlay.color === card.color || inPlay.value === card.value || card.color === "wild") {
            thisPlayer.isActive = false;
            thisPlayer.cards = thisPlayer.cards.filter(function (a) {
                return a !== card;
            })
            if (thisPlayer.cards.length === 0) {
                let message = "Player " + (current + 1) + " wins!"
                this.setState({
                    alert: message
                })
                this.handleVictory();
                return;
            }
            allPlayer[current] = thisPlayer;
            this.setState({
                allPlayers: allPlayer
            })

            if (card.value === "reverse") {
                turnOrder = !turnOrder;
                this.setState({
                    turnOrder: turnOrder
                })
            }
            if (card.color === "wild") {
                this.setState({
                    playCard: card,
                    showModal: true
                })
            }
            else if (card.value === "skip") {
                this.handleSkip(turnOrder, current, allPlayer, card)
            }
            else {
                this.handleNextTurn(turnOrder, current, allPlayer, card)
            }
        }
        else {
            thisPlayer.isActive = true;
            allPlayer[current] = thisPlayer;
            this.setState({
                allPlayers: allPlayer,
                alert: "Please choose a valid card!"
            })
        }

    }

    handleVictory = () => {
        setTimeout(() => {
            window.location.reload();
        }, 3000)


    }

    handleDraw = (n) => {
        if (!this.state.drawn && this.state.playCard !== "") {
            let current = this.state.currentPlayer;
            let thisPlayer = this.state.allPlayers[current];
            let drawPile = this.state.drawPile;
            let thisPlayerCards = thisPlayer.cards;
            let draw = drawPile.splice(0, n);
            let allPlayer = this.state.allPlayers;
            // thisPlayer.cards = thisPlayerCards.push(draw)
            // console.log(draw);
            for (let i in draw) {
                thisPlayerCards.push(draw[i]);
            }
            // thisPlayer.cards = thisPlayerCards.push(draw);

            allPlayer[current] = thisPlayer;
            // console.log(thisPlayer.cards)
            if (n === 1) {
                this.setState({
                    allPlayers: allPlayer,
                    Player1: allPlayer[0],
                    Player2: allPlayer[1],
                    Player3: allPlayer[2],
                    Player4: allPlayer[3],
                    alert: "You drew a card, Pass or Play?",
                    drawn: true
                })
            }
            else {
                this.setState({
                    allPlayers: allPlayer,
                    Player1: allPlayer[0],
                    Player2: allPlayer[1],
                    Player3: allPlayer[2],
                    Player4: allPlayer[3],
                    alert: "Its " + thisPlayer.name + "'s turn"
                })
            }
        }
        else if (this.state.playCard === "") {
            this.setState({
                alert: "You cannot draw on the first turn",
            })
        }
        else {
            this.setState({
                alert: "You already drew a card, Pass or Play?",
            })
        }
    }

    setPlayer(newPlayer, allPlayer, current, card) {
        newPlayer.isActive = true;
        allPlayer[current] = newPlayer;
        this.setState({
            drawn: false,
            allPlayers: allPlayer,
            Player1: allPlayer[0],
            Player2: allPlayer[1],
            Player3: allPlayer[2],
            Player4: allPlayer[3],
            currentPlayer: current,
            playCard: card,
            alert: "Its " + newPlayer.name + "'s turn"
        }, () => {
            if (card.value === "draw2") {
                this.handleDraw(2);
                socket.emit('newState', this.state)
            }
            else if (card.value === "draw4") {
                this.handleDraw(4);
                socket.emit('newState', this.state)
            }
            else {
                socket.emit('newState', this.state)
            }
        })
    }

    handleSkip = (turnOrder, current, allPlayer, card) => {
        if (turnOrder) {

            current += 2;
            if (current === (this.state.allPlayers.length)) {
                current = 0;
            }
            else if (current > this.state.allPlayers.length) {
                current = 1;
            }
            let newPlayer = this.state.allPlayers[current];
            this.setPlayer(newPlayer, allPlayer, current, card);
        }
        else {
            current -= 2;
            if (current === -1) {
                current = this.state.allPlayers.length - 1;
            }
            else if (current === -2) {
                current = this.state.allPlayers.length - 2;
            }
            let newPlayer = this.state.allPlayers[current];
            this.setPlayer(newPlayer, allPlayer, current, card);
        }
    }

    handlePass = (card) => {
        if (card.function !== "value") {
            card.value = "skip2";
            this.handleTurn(card)
        }
        else {
            this.handleTurn(card)
        }
    }

    handleWild = (color) => {
        let current = this.state.currentPlayer;
        let allPlayer = this.state.allPlayers;
        let card = this.state.playCard;
        let turnOrder = this.state.turnOrder;
        card.color = color;
        this.setState({
            showModal: false
        })
        this.handleNextTurn(turnOrder, current, allPlayer, card);
    }

    handleNextTurn = (turnOrder, current, allPlayer, card) => {
        if (turnOrder) {

            current++;
            if (current > (this.state.allPlayers.length - 1)) {
                current = 0;
            }
            else if (current < 0) {
                current = this.state.allPlayers.length - 1;
            }
            let newPlayer = this.state.allPlayers[current];
            this.setPlayer(newPlayer, allPlayer, current, card);
        }
        else {
            current--;
            if (current > (this.state.allPlayers.length - 1)) {
                current = 0;
            }
            else if (current < 0) {
                current = this.state.allPlayers.length - 1;
            }
            let newPlayer = this.state.allPlayers[current];
            this.setPlayer(newPlayer, allPlayer, current, card);
        }
    }

    render() {
        let modalClose = () => this.setState({ showModal: false });
        var p1cards = 100 / this.state.Player1.cards.length + "%";
        var p4cards = 100 / this.state.Player4.cards.length + "%";
        var p2cards = 100 / this.state.Player2.cards.length + "%";
        var p3cards = 100 / this.state.Player3.cards.length + "%";



        return (
            <Container fluid="true">
                <Button variant="primary" onClick={this.handleShow}>
                    Launch demo modal
        </Button>

                <Modal show={this.state.show} onHide={this.handleClose} style={{zIndex: 5000}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
            </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
            </Button>
                    </Modal.Footer>
                </Modal>
                {/* <div className="backdrop" style={{ backdropStyle }}>
                    <div className="modal" style={{ modalStyle }}>
                        {this.props.children}

                    </div>
                </div> */}
                {/* <Modal
                    show={this.state.open}
                    onHide={closeModal}
                    aria-labelledby="ModalHeader"
                >
                    <div className="modal-body">
                        <Row>
                            <Col size="md-3">
                                <div className="rounded" style={{ height: 100, backgroundColor: "red" }} onClick={() => this.handleWild("red")}>

                                </div>
                            </Col>
                            <Col size="md-3">
                                <div className="rounded" style={{ height: 100, backgroundColor: "blue" }} onClick={() => this.handleWild("blue")}>

                                </div>
                            </Col>
                            <Col size="md-3">
                                <div className="rounded" style={{ height: 100, backgroundColor: "orange" }} onClick={() => this.handleWild("yellow")}>

                                </div>
                            </Col>
                            <Col size="md-3">
                                <div className="rounded" style={{ height: 100, backgroundColor: "green" }} onClick={() => this.handleWild("green")}>

                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal> */}
                {/* <Row>
                    <span>{myname ? myname : "Not chosen"}</span>
                </Row> */}
                <Row>
                    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: this.state.Player1.isActive ? "green" : "" }}>
                        <button className="btn btn-primary">{this.state.Player1.name}</button>
                    </div>
                </Row>
                <Row>
                    <div className="col-md-3"></div>
                    <div className="col-md-6 p1div">
                        <Row>
                            {this.state.Player1.cards.map(card => (
                                <div key={card.id} style={{ width: p1cards }}>
                                    <img className="mx-auto p1cards" onClick={this.state.Player1.isActive ? () => this.handleTurn(card) : () => { }} alt={card.id} src={card.img}></img>
                                </div>
                            ))}
                        </Row>
                    </div>
                </Row>
                <Row>
                    <div className="col-md-3 text-center" style={{ backgroundColor: Player4.isActive ? "green" : "" }}>
                        <button className="btn btn-primary">{this.state.Player4.name}</button>
                        <Row>
                            <div className="p4div">
                                {this.state.Player4.cards.map(card => (
                                    <div key={card.id} style={{ height: p4cards }}>
                                        {/* <img className="p4cards" onClick={this.state.Player4.isActive ? () => this.handleTurn(card) : () => { }} alt={card.id} src={this.state.backCard.img}></img> */}
                                        <img className="p4cards" alt={card.id} src={this.state.backCard.img}></img>
                                    </div>
                                ))}
                            </div>
                        </Row>
                    </div>
                    <div className="col-md-6 mytable" style={{ backgroundColor: this.state.playCard.color ? this.state.playCard.color : "black" }}>
                        <Row>
                            <h2 className="mainMessage mx-auto">{this.state.alert}</h2>
                        </Row>
                        <Row>
                            <button className="btn btn-success mx-auto" style={this.state.drawn ? {} : { display: "none" }} onClick={() => this.handlePass(this.state.playCard)}>Pass</button>
                        </Row>
                        <Row>
                            <div className="col-md-6 text-center">
                                <img src={this.state.playCard.img} />
                            </div>
                            <div className="col-md-6 text-center">
                                <img className="drawPile" src={this.state.backCard.img} onClick={() => this.handleDraw(1)} />
                            </div>
                        </Row>
                    </div>
                    <div className="col-md-3 text-center" style={{ backgroundColor: Player2.isActive ? "green" : "" }}>
                        <button className="btn btn-primary">{this.state.Player2.name}</button>
                        <Row>
                            <div className="p2div">
                                {this.state.Player2.cards.map(card => (
                                    <div key={card.id} style={{ height: p2cards }}>
                                        <img className="p2cards" alt={card.id} src={this.state.backCard.img}></img>
                                    </div>
                                ))}
                            </div>
                        </Row>
                    </div>
                </Row>

                <Row>
                    <div className="col-md-3 mx-auto mt-1 text-center" style={{ backgroundColor: Player3.isActive ? "green" : "" }}>
                        <button className="btn btn-primary">{this.state.Player3.name}</button>
                    </div>
                </Row>
                <Row>
                    <div className="col-md-3"></div>
                    <div className="col-md-6 p3div" >
                        <Row>
                            {this.state.Player3.cards.map(card => (
                                <div key={card.id} style={{ width: p3cards }}>
                                    <img className="mx-auto p3cards" alt={card.id} src={this.state.backCard.img}></img>
                                </div>
                            ))}
                        </Row>
                    </div>
                </Row >

            </Container>
        );
    }
}

export default Game;
