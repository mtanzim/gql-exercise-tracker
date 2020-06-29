import React from "react";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import { Exercises } from "./components/Exercises";
import { Forum } from "./components/Forum";
import { Home } from "./components/Home";
import { Navigation } from "./components/Navigation";
import { Workouts } from "./components/Workouts";

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
        </Route>{" "}
        <Route path="/forum">
          <Forum />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
