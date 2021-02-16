import client from '../client'
import authGql from '@graphql/queries/auth'
import destroySessionGql from '../mutations/destroy-session'

const destroySession = (input) => {
  return client.mutate({
    mutation: destroySessionGql,
    variables: input,
    update: (store, { data }) => {
      if (data.destroySession) {
        // reset logout
        client.cache.reset()

        // update auth cache
        store.writeQuery({
          query: authGql,
          data: {
            auth: null
          }
        })
      }
    }
  })
}

export default destroySession
