import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export const Navigation = () => {
  const { authState, logout } = useContext(AuthContext);
  const { authenticated, user } = authState;
  const history = useHistory();

  const logoutAndRedirect = () => {
    logout();
    history.push("/login");
  };

  if (authenticated) {
    return (
      <Nav variant="tabs">
        <Nav.Item>
          <code className="mr-2">{user.email}</code>
          <i onClick={logoutAndRedirect} class="fa fa-sign-out" />
        </Nav.Item>
        <Nav.Item className="mr-2 ml-4">
          <Link to="/">Home</Link>
        </Nav.Item>
        <Nav.Item className="mr-2">
          <Link to="/exercises">Exercises</Link>
        </Nav.Item>
        <Nav.Item className="mr-2">
          <Link to="/workouts">Workouts</Link>
        </Nav.Item>
        <Nav.Item className="mr-2">
          <Link to="/forum">Forum</Link>
        </Nav.Item>
      </Nav>
    );
  }

  return (
    <Nav variant="tabs">
      <Nav.Item className="mr-2">
        <Link to="/login">Login</Link>
      </Nav.Item>
    </Nav>
  );
};
