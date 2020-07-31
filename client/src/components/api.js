import { gql } from "@apollo/client";

export const CommonUser = {
  fragments: {
    user: gql`
      fragment CommonUser on user {
        id
        name
        email
        isAdmin
      }
    `,
  },
};

export const REGISTER = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    signupUser(email: $email, name: $name, password: $password) {
      token
      user {
        ...CommonUser
      }
    }
  }
  ${CommonUser.fragments.user}
`;

export const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        ...CommonUser
      }
    }
  }
  ${CommonUser.fragments.user}
`;
