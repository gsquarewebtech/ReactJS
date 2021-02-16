import client from '../client'

import vendorGql from '../queries/vendor'
import updateClientVendorPrimaryContactGql from '../mutations/update-client-vendor-primary-contact'

const updateClientVendorPrimaryContact = (input, clientId) => {
  return client.mutate({
    mutation: updateClientVendorPrimaryContactGql,
    variables: input,
    update: (store, { data }) => {
      if (data.updateClientVendorPrimaryContact) {
        const variables = {
          id: input.vendorId
        }

        if (clientId) {
          variables.clientId = clientId
        }

        try {
          // read account users cache

          const vendorStore = store.readQuery({
            query: vendorGql,
            variables
          })

          const newAccountUsers = vendorStore.vendor.accountUsers.map(accountUser => {
            return {
              ...accountUser,
              isMain: input.accountUserId === accountUser.id
            }
          })

          // update client cache

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
  })
}

export default updateClientVendorPrimaryContact
