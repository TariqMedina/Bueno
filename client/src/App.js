import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Game from "./pages/game";
import Nav from "./components/Nav/nav";
import Login from "./components/Login/login"
import Home from "./components/Home/Home"


function App() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/game" component={Game} />
            {/* <Route exact path="/books/:id" component={Detail} />
            <Route component={NoMatch} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
  
  export default App;