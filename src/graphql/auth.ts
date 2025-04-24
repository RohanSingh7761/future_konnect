import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query Users($_eq: String!) {
    Users: users(where: {email: {_eq: $_eq}}) {
      id
      name
      email
      passwd
    }
  }
`;

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