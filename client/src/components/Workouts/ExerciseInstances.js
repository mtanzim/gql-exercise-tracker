import React from "react";
import Button from "react-bootstrap//Button";

export const ExerciseInstances = ({ data, isActive }) => {
  const { exerciseInstances } = data;
  const categories = exerciseInstances.reduce((prev, cur) => {
    const k = `${cur?.exercise?.name} - ${cur?.exercise?.label}`;
    if (prev[k]) {
      prev[k].push(cur);
    } else {
      prev[k] = [cur];
    }
    return prev;
  }, {});
  const totalWeight = exerciseInstances.reduce(
    (prev, cur) => (prev += cur?.weight * cur?.repetitions || 0),
    0
  );
  const totalDuration = exerciseInstances.reduce(
    (prev, cur) => (prev += cur?.duration || 0),
    0
  );

  return (
    <div>
      <h5>{`Total lifted: ${totalWeight} kg`}</h5>
      <h5>{`Total duration: ${totalDuration} s`}</h5>
      {Object.keys(categories).map((cat) => (
        <React.Fragment key={cat}>
          <h6>{cat}</h6>
          <ul>
            {categories[cat].map((excInstance) => {
              return (
                <li className="mb-2" key={excInstance.id}>
                  {excInstance.weight} kg
                  {excInstance.repetitions && ` - ${excInstance.repetitions}x`}
                  {excInstance.duration &&
                    ` for ${excInstance.duration} seconds`}
                  {isActive && (
                    <Button className="ml-4" variant="outline-danger" size="sm">
                      X
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
};
