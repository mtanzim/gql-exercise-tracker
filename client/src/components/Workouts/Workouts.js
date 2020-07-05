import { useQuery } from "@apollo/react-hooks";
import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { GET_SESSIONS, MOCK_USER_ID } from "./api";
import { Sessions } from "./Sessions";
import { SessionForm } from "./SessionForm";

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
      <h4 className="mt-4">Start a new workout session</h4>
      <ListGroup>
        <ListGroup.Item>
          <SessionForm />
        </ListGroup.Item>
      </ListGroup>
      <ListGroup className="mt-4">
        {exerciseSessions.map((s) => (
          <Sessions key={s.id} session={s} />
        ))}
      </ListGroup>
    </div>
  );
};
