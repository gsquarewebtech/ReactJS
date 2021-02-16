import client from '../client'

import addFileUploadFieldResolverGql from '../mutations/add-file-upload-field-resolvers'

const addFileUploadFieldResolver = (input) => {
  return client.mutate({
    mutation: addFileUploadFieldResolverGql,
    variables: input
  })
}

export default addFileUploadFieldResolver
