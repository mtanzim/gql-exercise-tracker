import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { DELETE_EXERICSE, EXERCISES, UPDATE_EXERCISE } from "./api";
import { ExerciseForm } from "./ExerciseForm";

export const Exercise = ({ exercise }) => {
  const { label, name, id } = exercise;
  const [updateExercise, { loading, error: updateError }] = useMutation(
    UPDATE_EXERCISE
  );
  const [deleteExercise, { error: deleteError }] = useMutation(
    DELETE_EXERICSE,
    {
      update(
        cache,
        {
          data: { deleteOneexercise },
        }
      ) {
        const { exercises: currentExercises } = cache.readQuery({
          query: EXERCISES,
        });
        cache.writeQuery({
          query: EXERCISES,
          data: {
            exercises: currentExercises.filter(
              (exc) => exc.id !== deleteOneexercise.id
            ),
          },
        });
      },
    }
  );

  const [isEditing, setEditing] = useState(false);

  const onDelete = async () => {
    try {
      await deleteExercise({ variables: { id } });
    } catch (err) {
      console.error(err.message);
    }
  };

  const onUpdate = async (values) => {
    try {
      await updateExercise({
        variables: { id: exercise.id, ...values },
      });
      setEditing(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (isEditing) {
    return (
      <ListGroup.Item>
        <ExerciseForm
          onSubmit={onUpdate}
          loading={loading}
          initValues={exercise}
        />
        {updateError && <p>{updateError.message}</p>}
      </ListGroup.Item>
    );
  }

  return (
    <ListGroup.Item>
      {name} - {label}
      <Button
        className="ml-2"
        variant="primary"
        onClick={() => setEditing(true)}
      >
        Edit
      </Button>
      <Button onClick={onDelete} className="ml-2" variant="danger">
        Delete
      </Button>
      {deleteError && <p>{deleteError.message}</p>}
    </ListGroup.Item>
  );
};
