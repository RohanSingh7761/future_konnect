import { gql } from "@apollo/client";

// GraphQL query for user login
export const LOGIN_USER = gql`
  query Users($_eq: String!) {
    Users: users(where: {email: {_eq: $_eq}}) {
      id
      username: name
      email
      password: passwd
    }
  }
`;

// GraphQL mutation for user signup
export const SIGNUP_USER = gql`
  mutation InsertUsers($username: String!, $email: String!, $password: String!) {
    insert_Users: insert_users(objects: {name: $username, email: $email, passwd: $password}) {
      returning {
        id
        username: name
        email
      }
    }
  }
`;