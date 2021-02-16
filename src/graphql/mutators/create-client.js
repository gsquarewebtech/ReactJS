import client from '../client'
import clientsGql from '../queries/clients'
import createClientGql from '../mutations/create-client'

const createClient = (input) => {
  return client.mutate({
    mutation: createClientGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createClient) {
        try {
        // read clients cache
          const clientsCache = store.readQuery({
            query: clientsGql
          })

          // add to clients cache
          store.writeQuery({
            query: clientsGql,
            data: {
              clients: [...clientsCache.clients, data.createClient]
            }
          })
        } catch (error) {
          // re-query clients
          client.query({
            query: clientsGql
          })
        }
      }
    }
  })
}

export default createClient
