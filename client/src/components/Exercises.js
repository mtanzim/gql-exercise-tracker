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

const Exercise = ({ exercise, onDelete }) => {
  const { label, name } = exercise;
  return (
    <ListGroup.Item>
      {name} - {label}
      <Button className="ml-4" variant="danger" type="submit">
        Delete
      </Button>
    </ListGroup.Item>
  );
};

const AddExerciseForm = ({ addExercise }) => {
  const [values, setValues] = useState({
    name: "",
    label: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addExercise({ variables: values });
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  return (
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
      {/* <input type="submit" value="Add New" /> */}
      <Button variant="primary" type="submit">
        Add New
      </Button>
    </form>
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

  const [deleteExercise] = useMutation(DELETE_EXERICSE, {
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
  });

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
            onDelete={() => deleteExercise({ variables: { id: exc.id } })}
          />
        ))}
      </ListGroup>
      {formLoading ? (
        "Submitting..."
      ) : (
        <AddExerciseForm addExercise={addExercise} className="mt-2" />
      )}
      {submitError && <p>{submitError.message}</p>}
    </div>
  );
};
