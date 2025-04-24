'use client';

import { client } from '@/utils/apollo-client';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
} 