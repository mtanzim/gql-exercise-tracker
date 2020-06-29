import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export const ExerciseForm = ({ onSubmit, loading, initValues }) => {
  const [values, setValues] = useState({
    name: initValues?.name || "",
    label: initValues?.label || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  if (loading) {
    return <p>Submitting...</p>;
  }
  return (
    <React.Fragment>
      <form className="mt-2" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            className="ml-2 mr-2"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Label
          <input
            className="ml-2 mr-2"
            type="text"
            name="label"
            value={values.label}
            onChange={handleChange}
          />
        </label>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </form>
    </React.Fragment>
  );
};
