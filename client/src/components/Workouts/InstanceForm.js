import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { EXERCISES } from "../Exercises/api";
import { CREATE_EXERCISE_INSTANCE, GET_INSTANCES } from "./api";

export const InstanceForm = ({ initValues, sessionId }) => {
  const { loading, data } = useQuery(EXERCISES);

  const [addExerciseInstance] = useMutation(CREATE_EXERCISE_INSTANCE, {
    update(
      cache,
      {
        data: { createExerciseInstance },
      }
    ) {
      const { exerciseInstances: current } = cache.readQuery({
        query: GET_INSTANCES,
        variables: { sessionId },
      });
      const updated = current.concat([createExerciseInstance]);
      cache.writeQuery({
        query: GET_INSTANCES,
        variables: { sessionId },
        data: { exerciseInstances: updated },
      });
    },
  });

  const [values, setValues] = useState({
    exerciseId: initValues?.exerciseId || "",
    duration: initValues?.duration || "",
    repetitions: initValues?.duration || "",
    weight: initValues?.weight || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitValues = Object.keys(values).reduce((prev, cur) => {
      switch (cur) {
        case "exerciseId":
        case "repetitions":
          if (values[cur] !== "") {
            prev[cur] = parseInt(values[cur], 10);
          }
          return prev;
        case "duration":
        case "weight":
          if (values[cur] !== "") {
            prev[cur] = parseFloat(values[cur]);
          }
          return prev;
        default:
          return prev;
      }
    }, {});
    try {
      await addExerciseInstance({
        variables: { sessionId, ...submitValues },
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  if (loading) {
    return <p>Loading...</p>;
  }
  const { exercises } = data;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Exercises
        <select
          name="exerciseId"
          value={values.exerciseId}
          onChange={handleChange}
        >
          <option value={null} />
          {exercises.map((exc) => (
            <option key={exc.id} value={exc.id}>
              {exc.name} - {exc.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Weight
        <input
          className="ml-2 mr-2"
          type="text"
          name="weight"
          value={values.weight}
          onChange={handleChange}
        />
      </label>
      <label>
        Repetitions
        <input
          className="ml-2 mr-2"
          type="text"
          name="repetitions"
          value={values.repetitions}
          onChange={handleChange}
        />
      </label>
      <label>
        Duration
        <input
          className="ml-2 mr-2"
          type="text"
          name="duration"
          value={values.duration}
          onChange={handleChange}
        />
      </label>
      <Button variant="primary" type="submit">
        Add
      </Button>
    </form>
  );
};
