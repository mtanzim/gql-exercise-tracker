import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { GET_SESSIONS, MAKE_SESSION } from "./api";

export const SessionForm = ({ initValues, isEditing, onUpdate }) => {
  const [addSession, { loading }] = useMutation(MAKE_SESSION, {
    update(
      cache,
      {
        data: { createExerciseSession },
      }
    ) {
      const { exerciseSessions: current } = cache.readQuery({
        query: GET_SESSIONS,
      });
      const updated = current.concat([createExerciseSession]);
      cache.writeQuery({
        query: GET_SESSIONS,
        data: { exerciseSessions: updated },
      });
    },
  });

  const onAdd = async (values) => {
    try {
      await addSession({ variables: values });
    } catch (err) {
      console.error(err.message);
    }
  };

  const [values, setValues] = useState({
    note: initValues?.note || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      return onUpdate(values);
    }
    return onAdd(values);
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
          Note
          <input
            className="ml-2 mr-2"
            type="text"
            name="note"
            value={values.note}
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
