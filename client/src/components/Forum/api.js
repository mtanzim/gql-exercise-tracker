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

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: String!) {
    createMessage(message: $message) {
      id
      message
      userId
      timestamp
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: Int!) {
    deleteOnemessage(where: { id: $id }) {
      timestamp
      id
      message
      userId
    }
  }
`;
