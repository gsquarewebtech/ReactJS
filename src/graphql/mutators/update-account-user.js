import client from '../client'

import clientGql from '../queries/client'
import vendorGql from '../queries/vendor'
import updateAccountUserGql from '../mutations/update-account-user'

const updateAccountUser = (input, type, clientId) => {
  return client.mutate({
    mutation: updateAccountUserGql,
    variables: input,
    update: (store, { data }) => {
      if (data.updateAccountUser) {
        const gqlQuery = type === 'client' ? clientGql : vendorGql

        const variables = {
          id: data.updateAccountUser.accountId
        }

        if (clientId) {
          variables.clientId = clientId
        }

        try {
          // read cache

          const accountStore = store.readQuery({
            query: gqlQuery,
            variables
          })

          const newAccountUsers = accountStore[type].accountUsers.map(accountUser => {
            const newAccountUser = { ...accountUser }

            if (accountUser.id === data.updateAccountUser.id && data.updateAccountUser.isMain) {
              newAccountUser.isMain = true
            } else {
              newAccountUser.isMain = false
            }

            return newAccountUser
          })

          // rewrite cache

          store.writeQuery({
            query: gqlQuery,
            variables,
            data: {
              [type]: {
                ...accountStore[type],
                accountUsers: newAccountUsers
              }
            }
          })
        } catch (error) {
          // re-query

          client.query({
            query: gqlQuery,
            variables
          })
        }
      }
    }
  })
}

export default updateAccountUser
