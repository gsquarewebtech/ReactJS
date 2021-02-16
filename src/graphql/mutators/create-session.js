import client from '../client'
import authGql from '@graphql/queries/auth'
import createSessionGql from '../mutations/create-session'

const createSession = (input) => {
  return client.mutate({
    mutation: createSessionGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createSession) {
        const { user } = data.createSession

        store.writeQuery({
          query: authGql,
          data: {
            auth: user
          }
        })

        if (user.userType) {
          localStorage.setItem('authToken', data.createSession.token)
        }
      }
    }
  })
}

export default createSession
