import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import {
  DELETE_ONE_SESSION,
  GET_SESSIONS,
  MOCK_USER_ID,
  UPDATE_SESSION,
  GET_INSTANCES,
} from "./api";
import { SessionForm } from "./SessionForm";
import { InstanceForm } from "./InstanceForm";
import { ExerciseInstances } from "./ExerciseInstances";

export const Sessions = ({ session }) => {
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
  const [isActive, setActive] = useState(false);
  const { note, timestamp, user, id } = session;
  const { name: userName } = user;

  const { data: instanceData, loading: instancesLoading } = useQuery(
    GET_INSTANCES,
    { variables: { sessionId: id } }
  );

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
        <SessionForm isEditing onUpdate={onUpdate} initValues={session} />
      </ListGroup.Item>
    );
  }

  return (
    <ListGroup.Item>
      {note} - {userName} - {timestamp}
      <Button
        onClick={() => setActive((cur) => !cur)}
        className="ml-2"
        variant="success"
      >
        {isActive ? "Complete" : "Start"}
      </Button>
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
      {isActive && <InstanceForm sessionId={id} />}
      {instancesLoading ? (
        "Loading instances"
      ) : (
        <ExerciseInstances data={instanceData} />
      )}
    </ListGroup.Item>
  );
};