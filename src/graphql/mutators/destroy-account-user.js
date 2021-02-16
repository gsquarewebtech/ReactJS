import client from '../client'

import clientGql from '../queries/client'
import vendorGql from '../queries/vendor'
import destroyAccountUserGql from '../mutations/destroy-account-user'

const destroyAccountUser = (id, type, clientId) => {
  return client.mutate({
    mutation: destroyAccountUserGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyAccountUser) {
        if (type === 'client') {
          const variables = {
            id: data.destroyAccountUser.accountId
          }

          try {
            // read client cache

            const clientStore = store.readQuery({
              query: clientGql,
              variables
            })

            const newAccountUsers = clientStore.client.accountUsers.filter(accountUser => accountUser.id !== id)

            // remove account user

            store.writeQuery({
              query: clientGql,
              variables,
              data: {
                client: {
                  ...clientStore.client,
                  accountUsers: newAccountUsers
                }
              }
            })
          } catch (error) {
            // re-query client

            client.query({
              query: clientGql,
              variables
            })
          }
        }

        if (type === 'vendor') {
          console.log('Logger::mutator', {
            id,
            type,
            clientId
          })

          const variables = {
            id: data.destroyAccountUser.accountId
          }

          if (clientId) {
            variables.clientId = clientId
          }

          try {
            // read vendor cache

            const vendorStore = store.readQuery({
              query: vendorGql,
              variables
            })

            const newAccountUsers = vendorStore.vendor.accountUsers.filter(accountUser => accountUser.id !== id)

            // remove account user

            store.writeQuery({
              query: vendorGql,
              variables,
              data: {
                vendor: {
                  ...vendorStore.vendor,
                  accountUsers: newAccountUsers
                }
              }
            })
          } catch (error) {
            // re-query vendor

            client.query({
              query: vendorGql,
              variables
            })
          }
        }
      }
    }
  })
}

export default destroyAccountUser
