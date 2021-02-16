import client from '../client'

import usersGql from '../queries/users'
import createUserGql from '../mutations/create-user'

const createUser = (input) => {
  return client.mutate({
    mutation: createUserGql,
    variables: input,
    update: (store, { data }) => {
      console.log('LOGGER::data.createUser', data)
      if (data.createUser) {
        try {
          // read users cache
          const usersStore = store.readQuery({
            query: usersGql
          })

          // update client cache
          store.writeQuery({
            query: usersGql,
            data: {
              users: [...usersStore.users, data.createUser]
            }
          })
        } catch (error) {
          // re-query users
          client.query({
            query: usersGql
          })
        }
      }
    }
  })
}

export default createUser
