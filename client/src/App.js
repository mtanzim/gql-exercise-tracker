import React from "react";
import { Route, Switch } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Exercises } from "./components/Exercises";
import { Workouts } from "./components/Workouts";
import { Home } from "./components/Home";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <Container>
      <Navigation />
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
  );
}

export default App;
