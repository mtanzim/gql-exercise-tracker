import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
export const AUTH_INFO = "exercise-auth-info";

const initState = {
  authenticated: false,
  token: null,
  user: {
    id: null,
    name: null,
    email: null,
    isAdmin: false,
  },
};

const defaultValue = {
  authState: initState,
  login: () => {},
  logout: () => {},
};

export const AuthContext = React.createContext(defaultValue);

export const AuthContextProvider = ({ children }) => {
  const [authState, setState] = useState(initState);
  const client = useApolloClient();

  useEffect(() => {
    if (!authState.authenticated) {
      const existingAuth = JSON.parse(localStorage.getItem(AUTH_INFO));
      if (existingAuth) {
        setState(existingAuth);
      }
    }
  }, [authState]);

  const login = async (user, token) => {
    const newState = { authenticated: true, token, user };
    setState(newState);
    localStorage.setItem(AUTH_INFO, JSON.stringify(newState));
  };
  const logout = async () => {
    localStorage.removeItem(AUTH_INFO);
    setState(initState);
    client.clearStore();
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
