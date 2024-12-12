import { ApolloClient, InMemoryCache } from '@apollo/client';

export const infoClient = new ApolloClient({
    uri: import.meta.env.VITE_INFO_GRAPH,
    cache: new InMemoryCache(),
});

export const farmsClient = new ApolloClient({
    uri: import.meta.env.VITE_FARMING_GRAPH,
    cache: new InMemoryCache(),
});
