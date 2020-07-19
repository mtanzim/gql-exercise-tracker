import React from "react";
import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export const Navigation = ({ user }) => {
  if (user) {
    return (
      <Nav variant="tabs">
        <Nav.Item>
          <code className="mr-4">{user}</code>
        </Nav.Item>
        <Nav.Item className="mr-2">
          {user ? <Link to="/">Logout</Link> : <Link to="/login">Login</Link>}
        </Nav.Item>
        <Nav.Item className="mr-2">
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
