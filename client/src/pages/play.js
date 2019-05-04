<Container fluid="true">
<Row>
    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: Player1.isActive ? "green" : "" }}>
        <button>Player 1</button>
    </div>
</Row>
<Row>
    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: Player1.isActive ? "green" : "" }}>
        <button disabled={!Player1.isActive} onClick={() => this.handleNextTurn(true)}>Next</button>
        <button disabled={!Player1.isActive} onClick={() => this.handleNextTurn(false)}>Reverse</button>
    </div>
</Row>
<Row>
    {this.state.Player1.cards.map(card => (
        <div className="col-md-1 mx-auto">
            <img alt={card.id} src={card.img}></img>
        </div>
    ))}
</Row>
<Row>
    <div className="col-md-2" style={{ backgroundColor: Player4.isActive ? "green" : "" }}>
        <button>Player 4</button>
    </div>
    <div className="col-md-8" style={{ backgroundColor: "red" }}>
        {/* <img src={this.state.card.img}/> */}
    </div>
    <div className="col-md-2" style={{ backgroundColor: Player2.isActive ? "green" : "" }}>
        <button>Player 2</button>
    </div>
</Row>
<Row>

    <div className="col-md-2 p4div" style={{ backgroundColor: Player4.isActive ? "green" : "", maxHeight: 500 }}>
        <button disabled={!Player4.isActive} onClick={() => this.handleNextTurn(true)}>Next</button>
        <button disabled={!Player4.isActive} onClick={() => this.handleNextTurn(false)}>Reverse</button>
        {this.state.Player4.cards.map(card => (
            <div className="col-md-1 mx-auto">
                <img alt={card.id} src={card.img}></img>
            </div>
        ))}
    </div>
    <div className="col-md-8" style={{ backgroundColor: "red" }}>
    </div>
    <div className="col-md-2" style={{ backgroundColor: Player2.isActive ? "green" : "" }}>
        <button disabled={!Player2.isActive} onClick={() => this.handleNextTurn(true)}>Next</button>
        <button disabled={!Player2.isActive} onClick={() => this.handleNextTurn(false)}>Reverse</button>
    </div>
</Row>
<Row>
    <div className="mx-auto">
        <button>Player 3</button>
    </div>
</Row>
<Row>
    <div className="col-md-3 mx-auto text-center" style={{ backgroundColor: Player3.isActive ? "green" : "" }}>
        <button disabled={!Player3.isActive} onClick={() => this.handleNextTurn(true)}>Next</button>
        <button disabled={!Player3.isActive} onClick={() => this.handleNextTurn(false)}>Reverse</button>
    </div>
</Row>
<Row>
    {this.state.Player3.cards.map(card => (
        <div className="col-md-1 mx-auto">
            <img alt={card.id} src={card.img}></img>
        </div>
    ))}
</Row>
</Container>