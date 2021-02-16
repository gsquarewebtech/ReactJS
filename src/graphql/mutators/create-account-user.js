import client from '../client'

import clientGql from '../queries/client'
import vendorGql from '../queries/vendor'
import createAccountUserGql from '../mutations/create-account-user'

const createAccountUser = (input, type, clientId = null) => {
  return client.mutate({
    mutation: createAccountUserGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createAccountUser) {
        if (type === 'client') {
          const variables = {
            id: data.createAccountUser.accountId
          }

          try {
            // read client cache

            const clientStore = store.readQuery({
              query: clientGql,
              variables
            })

            const newAccountUsers = [
              ...clientStore.client.accountUsers,
              data.createAccountUser
            ]

            // update client cache

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
          const variables = {
            id: data.createAccountUser.accountId
          }

          if (clientId) {
            variables.clientId = clientId
          }

          console.log('Logger::mutators::createAccountUser', {
            variables,
            clientId
          })

          try {
            // read vendor cache

            const vendorStore = store.readQuery({
              query: vendorGql,
              variables
            })

            const newAccountUsers = [
              ...vendorStore.vendor.accountUsers,
              data.createAccountUser
            ]

            console.log('Logger::mutators::createAccountUser::newAccountUsers', newAccountUsers)

            // update vendor cache

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
            // re-query account users

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

export default createAccountUser
