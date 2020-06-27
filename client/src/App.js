import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Exercises } from "./components/Exercises";
import { Workouts } from "./components/Workouts";
import { Home } from "./components/Home";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <Router>
      <Navigation />
      <Container>
        <Switch>
          <Route path="/exercises">
            <Exercises />
          </Route>
          <Route path="/workouts">
            <Workouts />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
