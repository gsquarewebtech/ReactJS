import client from '../client'

import clientGql from '../queries/client'
import createClientCustomerGql from '../mutations/create-client-customer'

const createClientCustomer = (input, type, clientId) => {
  return client.mutate({
    mutation: createClientCustomerGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createClientCustomer) {
        const variables = {
          id: data.createClientCustomer.clientId
        }

        try {
          // read client cache

          const clientCache = store.readQuery({
            query: clientGql,
            variables
          })

          const newClientCustomers = [
            ...clientCache.client.clientCustomers,
            data.createClientCustomer
          ]

          // write to cache

          store.writeQuery({
            query: clientGql,
            variables,
            data: {
              client: {
                ...clientCache.client,
                clientCustomers: newClientCustomers
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

export default createClientCustomer
