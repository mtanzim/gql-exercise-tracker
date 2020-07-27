import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!authState.authenticated) {
      const existingAuth = JSON.parse(localStorage.getItem(AUTH_INFO));
      if (existingAuth) {
        setState(existingAuth);
      }
    }
  }, [authState]);

  const login = (user, token) => {
    const newState = { authenticated: true, token, user };
    setState(newState);
    localStorage.setItem(AUTH_INFO, JSON.stringify(newState));
  };
  const logout = () => {
    setState(initState);
    localStorage.removeItem(AUTH_INFO);
  };

  return (
      <AuthContext.Provider value={{ authState, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};
