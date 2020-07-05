import React from "react";

export const ExerciseInstances = ({ data }) => {
  const { exerciseInstances } = data;

  return (
    <ul>
      {exerciseInstances.map((excInstance) => {
        const { exercise } = excInstance;
        return (
          <li>
            {exercise.name} - {exercise.label} - {excInstance.weight} kg -{" "}
            {excInstance.repetitions}x
          </li>
        );
      })}
    </ul>
  );
};
