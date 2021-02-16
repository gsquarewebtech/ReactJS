import React from 'react'
import { ApolloProvider } from '@apollo/client'

import Routes from './routes'
import graphQLClient from '@graphql/client'

const App = () => (
  <ApolloProvider client={graphQLClient}>
    <Routes />
  </ApolloProvider>
)

export default App
