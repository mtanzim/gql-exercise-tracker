import { gql } from "apollo-boost";

export const REGISTER = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    signupUser(email: $email, name: $name, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
