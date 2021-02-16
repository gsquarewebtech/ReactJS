import client from '../client'
import clientCustomerGql from '../queries/client-customer'
import updateClientCustomerGql from '../mutations/update-client-customer'

const updateClientCustomer = (input) => {
  return client.mutate({
    mutation: updateClientCustomerGql,
    variables: input,
    update: (store, { data }) => {
      if (data.updateClientCustomer) {
        // update to clients cache
        store.writeQuery({
          query: clientCustomerGql,
          variables: {
            id: input.id
          },
          data: {
            clientCustomer: data.updateClientCustomer
          }
        })
      }
    }
  })
}

export default updateClientCustomer
