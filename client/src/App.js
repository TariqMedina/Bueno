import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Game from "./pages/game";
import Nav from "./components/Nav/nav";

function App() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Game} />
            {/* <Route exact path="/books" component={Books} />
            <Route exact path="/books/:id" component={Detail} />
            <Route component={NoMatch} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
  
  export default App;