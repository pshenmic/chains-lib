import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import fetch from 'cross-fetch';

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'wss://gateway-ws.dev.xdefiservices.com/',
        })
      )
    : null;

const httpLink = new HttpLink({
  uri: 'https://gql-router.dev.xdefiservices.com/graphql',
  fetch,
});

const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        wsLink,
        httpLink
      )
    : httpLink;

const cache = new InMemoryCache({
  dataIdFromObject: (obj: any) => {
    return obj.id;
  },
  typePolicies: {
    Query: {
      fields: {
        assets: {
          merge: true,
        },
      },
    },
  },
});

export const gqlClient = new ApolloClient({
  link: splitLink,
  cache,
});
