import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Button from "react-bootstrap/Button";
import { REGISTER } from "./api";
import { createContext } from "vm";

export const AUTH_TOKEN = "exercise-auth-token";
export const Login = () => {
  const formStructure = [
    { name: "name", label: "Name", defaultValue: "", type: "text" },
    { name: "email", label: "Email", defaultValue: "", type: "text" },
    { name: "password", label: "Password", defaultValue: "", type: "password" },
    {
      name: "verifyPassword",
      label: "Confirm Password",
      defaultValue: "",
      type: "password",
    },
  ];

  const getDefaultValues = () =>
    formStructure.reduce((prev, cur) => {
      prev[cur.name] = cur.defaultValue;
      return prev;
    }, {});

  const [register, { loading, error, data }] = useMutation(REGISTER);

  const [values, setValues] = useState(getDefaultValues());

  const [isRegister, setRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      alert(JSON.stringify(values));
      try {
        const {
          data: { signupUser },
        } = await register({ variables: values });
        const { token, user } = signupUser;
        console.log({ token, user });
        localStorage.setItem(AUTH_TOKEN, token);
      } catch (err) {
        console.error(err);
      }

      setValues(getDefaultValues());
    }
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  return (
    <React.Fragment>
      <form className="mt-2" onSubmit={handleSubmit}>
        {formStructure
          .filter((k) => (!isRegister ? k.name !== "verifyPassword" : true))
          .map((k) => (
            <label key={k.name}>
              {k.label}
              <input
                key={k.name}
                className="ml-2 mr-2"
                type={k.type}
                name={k.name}
                value={values[k.name]}
                onChange={handleChange}
              />
            </label>
          ))}
        <Button variant="primary" type="submit">
          {isRegister ? "Register" : "Login"}
        </Button>
      </form>
      <a
        href="#"
        onClick={() => {
          setRegister((cur) => !cur);
          setValues(getDefaultValues());
        }}
      >
        {isRegister ? "Login instead" : "Register instead"}
      </a>
      {error && <p>{error.message}</p>}
    </React.Fragment>
  );
};
