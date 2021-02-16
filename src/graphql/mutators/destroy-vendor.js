import client from '../client'
import vendorsGql from '../queries/vendors'
import destroyVendorGql from '../mutations/destroy-vendor'

const destroyVendor = (id) => {
  return client.mutate({
    mutation: destroyVendorGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyVendor) {
        const { id } = data.destroyVendor

        // read vendors cache
        const vendorsCache = store.readQuery({
          query: vendorsGql
        })

        // remove from clients cache
        store.writeQuery({
          query: vendorsGql,
          data: {
            vendors: vendorsCache.vendors.filter(t => t.id !== id)
          }
        })
      }
    }
  })
}

export default destroyVendor
