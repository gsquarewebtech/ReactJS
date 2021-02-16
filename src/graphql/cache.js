import { InMemoryCache } from '@apollo/client'

const defaultTypePolicy = {
  merge (existing, incoming) {
    return incoming
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: defaultTypePolicy,
        fileUploads: defaultTypePolicy,
        questionnaires: defaultTypePolicy,
        accountUsers: defaultTypePolicy,
        clientCustomers: defaultTypePolicy,
        templateFieldAllowedValues: defaultTypePolicy,
        templateFieldMappings: defaultTypePolicy
      }
    },
    Client: {
      fields: {
        accountUsers: defaultTypePolicy,
        clientCustomers: defaultTypePolicy,
        clientVendors: defaultTypePolicy
      }
    },
    Vendor: {
      fields: {
        accountUsers: defaultTypePolicy
      }
    }
  }
})

export default cache
