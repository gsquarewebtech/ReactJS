import client from '../client'

import clientGql from '../queries/client'
import destroyClientVendorGql from '../mutations/destroy-client-vendor'

const destroyClientVendor = (id) => {
  return client.mutate({
    mutation: destroyClientVendorGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyClientVendor) {
        const { id, clientId } = data.destroyClientVendor

        const variables = {
          id: clientId
        }

        // read client cache

        const clientStore = store.readQuery({
          query: clientGql,
          variables
        })

        const newClientVendors = clientStore.client.clientVendors.filter(clientVendor => clientVendor.id !== id)

        // remove client vendor

        store.writeQuery({
          query: clientGql,
          data: {
            client: {
              ...clientStore.client,
              clientVendors: newClientVendors
            }
          }
        })
      }
    }
  })
}

export default destroyClientVendor
