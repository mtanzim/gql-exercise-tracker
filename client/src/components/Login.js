import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import { useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { LOGIN, REGISTER } from "./api";

export const Login = () => {
  const authValue = useContext(AuthContext);
  const history = useHistory();

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

  const [
    register,
    { loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER);
  const [login, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN
  );
  const [values, setValues] = useState(getDefaultValues());
  const [isRegister, setRegister] = useState(false);

  const getLoginData = async () => {
    if (isRegister) {
      const {
        data: { signupUser },
      } = await register({ variables: values });
      return signupUser;
    }
    const {
      data: { loginUser },
    } = await login({ variables: values });
    return loginUser;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, user } = await getLoginData();
      authValue.login(user, token);
      setValues(getDefaultValues());
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  if (authValue?.authState?.authenticated) {
    return <Redirect to="/" />;
  }

  if (registerLoading || loginLoading) {
    return <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <form className="mt-2" onSubmit={handleSubmit}>
        {formStructure
          .filter((k) => isRegister || k.name !== "verifyPassword")
          .filter((k) => isRegister || k.name !== "name")
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
      {/*eslint-disable-next-line*/}
      <a
        href="#"
        onClick={() => {
          setRegister((cur) => !cur);
          setValues(getDefaultValues());
        }}
      >
        {isRegister ? "Login instead" : "Register instead"}
      </a>
      {registerError && <p>{registerError.message}</p>}
      {loginError && <p>{loginError.message}</p>}
    </React.Fragment>
  );
};
