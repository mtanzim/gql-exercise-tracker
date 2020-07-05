import { gql } from "apollo-boost";

export const MOCK_USER_ID = 1;

export const GET_SESSIONS = gql`
  query GetSessions($userId: Int!) {
    exerciseSessions(userId: $userId) {
      id
      note
      timestamp
      user {
        id
        name
        email
      }
    }
  }
`;

export const MAKE_SESSION = gql`
  mutation CreateExerciseSession($userId: Int!, $note: String) {
    createExerciseSession(userId: $userId, note: $note) {
      id
      note
      timestamp
      user {
        id
        name
        email
      }
    }
  }
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
      id
      note
      timestamp
      user {
        id
        name
        email
      }
    }
  }
`;

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
      id
      weight
      duration
      repetitions
      exercise {
        name
        label
      }
      exercise_session {
        id
        note
        timestamp
      }
      exercise_session {
        id
        timestamp
        user {
          id
          email
        }
      }
    }
  }
`;

export const GET_INSTANCES = gql`
  query GetInstances($sessionId: Int!) {
    exerciseInstances(sessionId: $sessionId) {
      id
      weight
      duration
      repetitions
      exercise {
        name
        label
      }
      exercise_session {
        id
        note
        timestamp
      }
      exercise_session {
        id
        timestamp
        user {
          id
          email
        }
      }
    }
  }
`;
