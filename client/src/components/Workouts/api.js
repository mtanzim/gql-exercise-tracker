import { gql } from "@apollo/client";
import { CommonUser } from "../api";
import { CommonExercise } from "../Exercises/api";

export const CommonSession = {
  fragments: {
    exerciseSessions: gql`
      fragment CommonSession on exercise_session {
        id
        note
        timestamp
        user {
          ...CommonUser
        }
      }
      ${CommonUser.fragments.user}
    `,
  },
};

export const GET_SESSIONS = gql`
  query GetSessions {
    exerciseSessions {
      ...CommonSession
    }
  }
  ${CommonSession.fragments.exerciseSessions}
`;

export const MAKE_SESSION = gql`
  mutation CreateExerciseSession($note: String) {
    createExerciseSession(note: $note) {
      ...CommonSession
    }
  }
  ${CommonSession.fragments.exerciseSessions}
`;

export const DELETE_ONE_SESSION = gql`
  mutation DeleteOneSession($id: Int!) {
    deleteOneexercise_session(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_SESSION = gql`
  mutation UpdateOneSession($id: Int!, $note: String) {
    updateOneexercise_session(where: { id: $id }, data: { note: $note }) {
      ...CommonSession
    }
  }
  ${CommonSession.fragments.exerciseSessions}
`;

export const CommonInstance = {
  fragments: {
    exerciseInstance: gql`
      fragment CommonInstance on exercise_instance {
        id
        weight
        duration
        repetitions
        exercise {
          ...CommonExercise
        }
        exercise_session {
          ...CommonSession
        }
      }
      ${CommonExercise.fragments.exercise}
      ${CommonSession.fragments.exerciseSessions}
    `,
  },
};

export const CREATE_EXERCISE_INSTANCE = gql`
  mutation CreateExerciseInstance(
    $exerciseId: Int!
    $sessionId: Int!
    $weight: Float
    $duration: Float
    $repetitions: Int
  ) {
    createExerciseInstance(
      exerciseId: $exerciseId
      sessionId: $sessionId
      weight: $weight
      duration: $duration
      repetitions: $repetitions
    ) {
      ...CommonInstance
    }
  }
  ${CommonInstance.fragments.exerciseInstance}
`;

export const GET_INSTANCES = gql`
  query GetInstances($sessionId: Int!) {
    exerciseInstances(sessionId: $sessionId) {
      ...CommonInstance
    }
  }
  ${CommonInstance.fragments.exerciseInstance}
`;

export const DELETE_INSTANCE = gql`
  mutation DeleteExerciseInstances($id: Int!) {
    deleteOneexercise_instance(where: { id: $id }) {
      id
    }
  }
`;
