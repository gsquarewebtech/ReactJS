import client from '../client'
import usersGql from '../queries/users'
import destroyUserGql from '../mutations/destroy-user'

const destroyUser = (id) => {
  return client.mutate({
    mutation: destroyUserGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyUser) {
        const user = data.destroyUser
        const variables = { id: user.id }

        // read users cache
        const usersCache = store.readQuery({
          query: usersGql,
          variables
        })

        // remove from users cache
        store.writeQuery({
          query: usersGql,
          variables,
          data: {
            users: usersCache.users.filter(t => t.id !== id)
          }
        })
      }
    }
  })
}

export default destroyUser
