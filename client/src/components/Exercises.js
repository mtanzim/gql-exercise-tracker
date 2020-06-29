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

const UPDATE_EXERCISE = gql`
  mutation UpdateExercise($id: Int!, $name: String, $label: String) {
    updateOneexercise(
      where: { id: $id }
      data: { name: $name, label: $label }
    ) {
      id
      name
      label
    }
  }
`;

const Exercise = ({ exercise }) => {
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

const ExerciseForm = ({ onSubmit, loading, initValues }) => {
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

  const onAdd = async (values) => {
    try {
      await addExercise({ variables: values });
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

  const { exercises } = data;

  return (
    <div>
      <h1>Exercises</h1>
      <ListGroup>
        {exercises.map((exc) => (
          <Exercise key={exc.id} exercise={exc} />
        ))}
      </ListGroup>
      <h4 className="mt-4">Add new</h4>
      <ListGroup>
        <ListGroup.Item>
          <ExerciseForm
            loadig={formLoading}
            onSubmit={onAdd}
            className="mt-2"
          />
        </ListGroup.Item>
      </ListGroup>
      {submitError && <p>{submitError.message}</p>}
    </div>
  );
};
