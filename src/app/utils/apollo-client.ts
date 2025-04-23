import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

// Default Hasura endpoint - change this to your actual endpoint in production
const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_ENDPOINT

const httpLink = createHttpLink({
  uri: HASURA_ENDPOINT,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
    },
  }
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError || graphQLErrors) {
    console.log('GraphQL Error or Network Error:', networkError || graphQLErrors);
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});
