import { gql } from "@apollo/client";
import { CommonUser } from "../api";

export const SUBSCRIBE_MESSAGES = gql`
  subscription MessageSub {
    messageAdded {
      message
      id
      timestamp
      user {
        ...ForumUser
      }
    }
  }
  ${CommonUser.fragments.user}
`;

export const GET_MESSAGES = gql`
  query Messages {
    messages {
      id
      message
      userId
      timestamp
      user {
        ...CommonUser
      }
    }
  }
  ${CommonUser.fragments.user}
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: String!) {
    createMessage(message: $message) {
      id
      message
      userId
      user {
        ...CommonUser
      }
      timestamp
    }
  }
  ${CommonUser.fragments.user}
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: Int!) {
    deleteOnemessage(where: { id: $id }) {
      id
      userId
    }
  }
`;
