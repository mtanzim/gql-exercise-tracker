import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { GET_SESSIONS, MAKE_SESSION, MOCK_USER_ID } from "./api";

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
        variables: { userId: MOCK_USER_ID },
      });
      const updated = current.concat([createExerciseSession]);
      console.log(updated);
      cache.writeQuery({
        query: GET_SESSIONS,
        variables: { userId: MOCK_USER_ID },
        data: { exerciseSessions: updated },
      });
    },
  });

  const onAdd = async (values) => {
    try {
      await addSession({ variables: { ...values, userId: MOCK_USER_ID } });
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
