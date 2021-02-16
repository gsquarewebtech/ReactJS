import client from '../client'
import clientGql from '../queries/client'
import updateClientGql from '../mutations/update-client'

const updateClient = (input) => {
  return client.mutate({
    mutation: updateClientGql,
    variables: input,
    update: (store, { data }) => {
      if (data.updateClient) {
        // update to clients cache
        store.writeQuery({
          query: clientGql,
          variables: {
            id: input.id
          },
          data: {
            client: data.updateClient
          }
        })
      }
    }
  })
}

export default updateClient
