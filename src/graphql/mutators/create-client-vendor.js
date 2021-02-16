import client from '../client'

import clientGql from '../queries/client'
import createClientVendorGql from '../mutations/create-client-vendor'

const createClientVendor = (input, type, clientId) => {
  return client.mutate({
    mutation: createClientVendorGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createClientVendor) {
        const variables = {
          id: clientId
        }

        try {
          // read client cache

          const clientCache = store.readQuery({
            query: clientGql,
            variables
          })

          const newClientVendors = [
            ...clientCache.client.clientVendors,
            data.createClientVendor
          ]

          // write to cache

          store.writeQuery({
            query: clientGql,
            data: {
              client: {
                ...clientCache.client,
                clientVendors: newClientVendors
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
    }
  })
}

export default createClientVendor
