import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const EXERCISES = gql`
  {
    exercises {
      id
      label
      name
    }
  }
`;

const CREATE_EXERCISE = gql`
  mutation CreateExercise($name: String!, $label: String!) {
    createExercise(name: $name, label: $label) {
      id
      name
      label
    }
  }
`;

const DELETE_EXERICSE = gql`
  mutation DeleteOneExercise($id: Int!) {
    deleteOneexercise(where: { id: $id }) {
      id
      name
      label
    }
  }
`;

const Exercise = ({ exercise, deleteExercise }) => {
  const { label, name, id } = exercise;
  const onDelete = async () => {
    try {
      await deleteExercise({ variables: { id } });
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <ListGroup.Item>
      {name} - {label}
      <Button
        onClick={onDelete}
        className="ml-4"
        variant="danger"
        onClick={onDelete}
      >
        Delete
      </Button>
    </ListGroup.Item>
  );
};

const AddExerciseForm = ({ addExercise, loading }) => {
  const [values, setValues] = useState({
    name: "",
    label: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExercise({ variables: values });
    } catch (err) {
      console.error(err.message);
    }
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
          Add New
        </Button>
      </form>
    </React.Fragment>
  );
};

export const Exercises = () => {
  const { loading, error, data } = useQuery(EXERCISES);
  const [
    addExercise,
    { loading: formLoading, error: submitError },
  ] = useMutation(CREATE_EXERCISE, {
    update(
      cache,
      {
        data: { createExercise },
      }
    ) {
      const { exercises: currentExercises } = cache.readQuery({
        query: EXERCISES,
      });
      cache.writeQuery({
        query: EXERCISES,
        data: { exercises: currentExercises.concat([createExercise]) },
      });
    },
  });

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

  if (loading) {
    return <p>{"Loading..."}</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const { exercises } = data;

  return (
    <div>
      <h1>Exercises</h1>
      <ListGroup>
        {exercises.map((exc) => (
          <Exercise
            key={exc.id}
            exercise={exc}
            deleteExercise={deleteExercise}
          />
        ))}
      </ListGroup>
      <AddExerciseForm
        loadig={formLoading}
        addExercise={addExercise}
        className="mt-2"
      />
      {submitError && <p>{submitError.message}</p>}
      {deleteError && <p>{deleteError.message}</p>}
    </div>
  );
};
