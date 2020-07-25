import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import { Route, Switch, Redirect } from "react-router-dom";
import { Exercises } from "./components/Exercises/Exercises";
import { Forum } from "./components/Forum";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Navigation } from "./components/Navigation";
import { Workouts } from "./components/Workouts/Workouts";
import { AuthContextProvider, AuthContext } from "./AuthContext";

export const PrivateRoute = ({ children, ...rest }) => {
  const { authState } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

function App() {
  return (
    <AuthContextProvider>
      <Container>
        <Navigation />
        <Switch>
          <PrivateRoute path="/exercises">
            <Exercises />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/workouts">
            <Workouts />
          </PrivateRoute>
          <PrivateRoute path="/forum">
            <Forum />
          </PrivateRoute>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </Container>
    </AuthContextProvider>
  );
}

export default App;
