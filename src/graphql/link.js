import config from '@config'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink } from '@apollo/client'

const defaultLink = createUploadLink({ uri: `${config.API_URL}/graphql` })

const linkWithAuth = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken')
  const headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  operation.setContext({
    headers,
    includeExtensions: true
  })

  return forward(operation)
})

const link = linkWithAuth.concat(defaultLink)

export default link
