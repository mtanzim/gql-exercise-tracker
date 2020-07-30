import { gql } from "@apollo/client";

export const SUBSCRIBE_MESSAGES = gql`
  subscription MessageSub {
    messages {
      message
      id
      timestamp
      userId
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages {
    messages {
      id
      message
      userId
      user {
        id
        name
        email
        isAdmin
      }
      timestamp
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: String!) {
    createMessage(message: $message) {
      id
      message
      userId
      user {
        id
        name
        email
        isAdmin
      }
      timestamp
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: Int!) {
    deleteOnemessage(where: { id: $id }) {
      id
      userId
    }
  }
`;
