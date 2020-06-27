import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export const Navigation = ({ user = "Guest" }) => (
  <Navbar>
    <Navbar.Brand>Exercise Tracker</Navbar.Brand>
    <Navbar.Toggle />
    <Nav className="mr-auto">
      <Nav.Link>
        <Link to="/">Home</Link>
      </Nav.Link>
      <Nav.Link>
        <Link to="/exercises">Exercises</Link>
      </Nav.Link>
      <Nav.Link>
        <Link to="/workouts">Workouts</Link>
      </Nav.Link>
    </Nav>
    <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>{user}</Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);
