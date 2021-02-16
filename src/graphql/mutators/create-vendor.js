import client from '../client'

import vendorsGql from '../queries/vendor'
import createVendorGql from '../mutations/create-vendor'

const getGqlQuery = (type) => {
  if (type === 'vendors') {
    return vendorsGql
  }
}

const createVendor = (input, type) => {
  return client.mutate({
    mutation: createVendorGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createVendor) {
        const query = getGqlQuery(type)
        const variables = {}

        try {
          // read cache

          const gqlStore = store.readQuery({
            query,
            variables
          })

          const newValue = [
            ...gqlStore.vendors,
            data.createVendor
          ]

          // write cache
          store.writeQuery({
            query,
            variables,
            data: {
              vendors: newValue
            }
          })
        } catch (error) {
          // re-query

          client.query({
            query,
            variables
          })
        }
      }
    }
  })
}

export default createVendor
