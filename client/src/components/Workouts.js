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

const DELETE_ONE_SESSION = gql`
  mutation DeleteOneSession($id: Int!) {
    deleteOneexercise_session(where: { id: $id }) {
      id
    }
  }
`;

const UPDATE_SESSION = gql`
  mutation UpdateOneSession($id: Int!, $note: String) {
    updateOneexercise_session(where: { id: $id }, data: { note: $note }) {
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
  const [delSession, { loading }] = useMutation(DELETE_ONE_SESSION, {
    update(
      cache,
      {
        data: { deleteOneexercise_session },
      }
    ) {
      const { exerciseSessions: current } = cache.readQuery({
        query: GET_SESSIONS,
        variables: { userId: MOCK_USER_ID },
      });
      const updated = current.filter(
        (s) => s.id !== deleteOneexercise_session.id
      );
      console.log(updated);
      cache.writeQuery({
        query: GET_SESSIONS,
        variables: { userId: MOCK_USER_ID },
        data: { exerciseSessions: updated },
      });
    },
  });
  const [updateSession, { loading: updateLoaing }] = useMutation(
    UPDATE_SESSION
  );

  const [isEditing, setEditing] = useState(false);
  const { note, timestamp, user, id } = session;
  const { name: userName } = user;

  const onDelete = async () => {
    try {
      await delSession({ variables: { id } });
    } catch (err) {
      console.error(err);
    }
  };
  const onUpdate = async (values) => {
    try {
      await updateSession({ variables: { id, ...values } });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isEditing) {
    return (
      <ListGroup.Item>
        <SessionForm
          isEditing
          onUpdate={onUpdate}
          initValues={session}
        />
      </ListGroup.Item>
    );
  }

  return (
    <ListGroup.Item>
      {note} - {userName} - {timestamp}
      <Button
        onClick={() => setEditing(true)}
        className="ml-2"
        variant="primary"
      >
        Edit
      </Button>
      <Button onClick={onDelete} className="ml-2" variant="danger">
        Delete
      </Button>
    </ListGroup.Item>
  );
};

const SessionForm = ({ initValues, isEditing, onUpdate }) => {
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

export const Workouts = () => {
  const { loading, error, data } = useQuery(GET_SESSIONS, {
    variables: { userId: MOCK_USER_ID },
  });

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
          <SessionForm />
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};
