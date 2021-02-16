import client from '../client'
import clientsGql from '../queries/clients'
import destroyClientGql from '../mutations/destroy-client'

const destroyClient = (id) => {
  return client.mutate({
    mutation: destroyClientGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyClient) {
        const { id } = data.destroyClient

        // read clients cache
        const clientsCache = store.readQuery({
          query: clientsGql
        })

        // remove from clients cache
        store.writeQuery({
          query: clientsGql,
          data: {
            clients: clientsCache.clients.filter(t => t.id !== id)
          }
        })
      }
    }
  })
}

export default destroyClient
