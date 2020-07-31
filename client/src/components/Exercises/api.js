import { gql } from "@apollo/client";

export const CommonExercise = {
  fragments: {
    exercise: gql`
      fragment CommonExercise on exercise {
        id
        label
        name
      }
    `,
  },
};

export const EXERCISES = gql`
  {
    exercises {
      ...CommonExercise
    }
  }
  ${CommonExercise.fragments.exercise}
`;

export const CREATE_EXERCISE = gql`
  mutation CreateExercise($name: String!, $label: String!) {
    createExercise(name: $name, label: $label) {
      ...CommonExercise
    }
  }
  ${CommonExercise.fragments.exercise}
`;

export const DELETE_EXERICSE = gql`
  mutation DeleteOneExercise($id: Int!) {
    deleteOneexercise(where: { id: $id }) {
      ...CommonExercise
    }
  }
  ${CommonExercise.fragments.exercise}
`;

export const UPDATE_EXERCISE = gql`
  mutation UpdateExercise($id: Int!, $name: String, $label: String) {
    updateOneexercise(
      where: { id: $id }
      data: { name: $name, label: $label }
    ) {
      ...CommonExercise
    }
  }
  ${CommonExercise.fragments.exercise}
`;
