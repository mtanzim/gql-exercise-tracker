import { gql } from "@apollo/client";

export const EXERCISES = gql`
  {
    exercises {
      id
      label
      name
    }
  }
`;

export const CREATE_EXERCISE = gql`
  mutation CreateExercise($name: String!, $label: String!) {
    createExercise(name: $name, label: $label) {
      id
      name
      label
    }
  }
`;

export const DELETE_EXERICSE = gql`
  mutation DeleteOneExercise($id: Int!) {
    deleteOneexercise(where: { id: $id }) {
      id
      name
      label
    }
  }
`;

export const UPDATE_EXERCISE = gql`
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
