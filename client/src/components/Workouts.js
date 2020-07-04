import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const MOCK_USER_ID = 1;

const GET_SESSIONS = gql`
  query GetSessions($userId: Int!) {
    exerciseSessions(userId: $userId) {
      id
      note
      timestamp
      user {
        id
        name
        email
      }
    }
  }
`;

const MAKE_SESSION = gql`
  mutation CreateExerciseSession($userId: Int!, $note: String) {
    createExerciseSession(userId: $userId, note: $note) {
      id
      note
      timestamp
      user {
        id
        name
        email
      }
    }
  }
`;

const Sessions = ({ session }) => {
  const { note, timestamp, user } = session;
  const { name: userName } = user;

  return (
    <ListGroup.Item>
      {note} - {userName} - {timestamp}
      <Button className="ml-2" variant="primary">
        Edit
      </Button>
      <Button className="ml-2" variant="danger">
        Delete
      </Button>
    </ListGroup.Item>
  );
};

const SessionForm = ({ initValues, onSubmit, loading }) => {
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

export const Workouts = () => {
  const { loading, error, data } = useQuery(GET_SESSIONS, {
    variables: { userId: MOCK_USER_ID },
  });

  const [addSession, { loading: formLoaing }] = useMutation(MAKE_SESSION, {
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
      console.log(current);
      console.log(createExerciseSession);
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

  if (loading) {
    return <p>{"Loading..."}</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const { exerciseSessions } = data;

  return (
    <div>
      <h1>Workouts</h1>
      <ListGroup>
        {exerciseSessions.map((s) => (
          <Sessions key={s.id} session={s} />
        ))}
      </ListGroup>
      <h4 className="mt-4">Add new</h4>
      <ListGroup>
        <ListGroup.Item>
          <SessionForm onSubmit={onAdd} loading={formLoaing} />
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};
