import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal'
import { Col, Row, Container } from "../components/Grid";
import cards from "./cards.js"
import "./style.css";

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
console.log(backCard)
console.log(myDeck.length);


function startgame (){
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

class Game extends Component {
    state = {
        allPlayers: [Player1, Player2, Player3, Player4],
        // card,
        Player1: Player1,
        Player2: Player2,
        Player3: Player3,
        Player4: Player4,
        showModal: false,
        drawn: false,
        backCard: backCard[0],
        alert: "Start the game! Player 1's turn",
        currentPlayer: 0,
        turnOrder: true,
        drawPile: myDeck,
        discardPile: [],
        Player1cards: [],
        Player2cards: [],
        Player3cards: [],
        Player4cards: [],
        playCard: ""
    };

    showModal() {
        this.setState({
            showModal: true
        })
    }

    componentDidMount() {
        let player = this.state.Player1;
        player.isActive = true;
        this.setState({
            Player1: player
        })
    }

    handleTurn = (card) => {
        let current = this.state.currentPlayer;
        let thisPlayer = this.state.allPlayers[current];

        let allPlayer = this.state.allPlayers;

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
            if (thisPlayer.cards.length===0){
                let message = "Player "+ (current+1)+ " wins!"
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

    handleVictory = () =>
    {   setTimeout(()=>{
            window.location.reload();
        }, 3000)


    }

    handleDraw = (n) => {
        if (!this.state.drawn && this.state.playCard!="") {
            let current = this.state.currentPlayer;
            console.log(current + 1);
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
                    alert: "Its Player " + (current + 1) + "'s turn"
                })
            }
        }
        else if (this.state.playCard===""){
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
            alert: "Its Player " + (current + 1) + "'s turn"
        }, () => {
            if (card.value === "draw2") {
                this.handleDraw(2);
            }
            else if (card.value === "draw4") {
                this.handleDraw(4);
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
            this.setPlayer(newPlayer, allPlayer, current, card
            );
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


                <Modal
                    show={this.state.showModal}
                    onHide={modalClose}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Choose color
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                </Modal>
                <Row>
                    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: this.state.Player1.isActive ? "green" : "" }}>
                        <button>Player 1</button>
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
                        <button>Player 4</button>
                        <Row>
                            <div className="p4div">
                                {this.state.Player4.cards.map(card => (
                                    <div key={card.id} style={{ height: p4cards }}>
                                        <img className="p4cards" onClick={this.state.Player4.isActive ? () => this.handleTurn(card) : () => { }} alt={card.id} src={card.img}></img>
                                    </div>
                                ))}
                            </div>
                        </Row>
                    </div>
                    <div className="col-md-6 mytable">
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
                        <button>Player 2</button>
                        <Row>
                            <div className="p2div">
                                {this.state.Player2.cards.map(card => (
                                    <div key={card.id} style={{ height: p2cards }}>
                                        <img className="p2cards" onClick={this.state.Player2.isActive ? () => this.handleTurn(card) : () => { }} alt={card.id} src={card.img}></img>
                                    </div>
                                ))}
                            </div>
                        </Row>
                    </div>
                </Row>

                <Row>
                    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: Player3.isActive ? "green" : "" }}>
                        <button>Player 3</button>
                    </div>
                </Row>
                <Row>
                    <div className="col-md-3"></div>
                    <div className="col-md-6 p1div">
                        <Row>
                            {this.state.Player3.cards.map(card => (
                                <div key={card.id} style={{ width: p3cards }}>
                                    <img className="mx-auto p1cards" onClick={this.state.Player3.isActive ? () => this.handleTurn(card) : () => { }} alt={card.id} src={card.img}></img>
                                </div>
                            ))}
                        </Row>
                    </div>
                </Row>

            </Container>
        );
    }
}

export default Game;
