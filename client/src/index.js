import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AUTH_INFO } from "./AuthContext";
import * as serviceWorker from "./serviceWorker";

const API_ENDPOINT = "http://localhost:4000";

const getToken = () => {
  let token = null;
  try {
    token = JSON.parse(localStorage.getItem(AUTH_INFO)).token;
  } catch (err) {
    console.error(err);
  }

  return {
    authorization: token ? `Bearer ${token}` : "",
  };
};

const client = new ApolloClient({
  uri: API_ENDPOINT,
  cache: new InMemoryCache(),
  headers: { ...getToken() },
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
