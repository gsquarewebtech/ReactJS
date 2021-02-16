import client from '../client'
import destroyFileUploadGql from '../mutations/destroy-file-upload'
import fileUploadsGql from '../queries/file-uploads'

const destroyFileUpload = (id, options = {}) => {
  return client.mutate({
    mutation: destroyFileUploadGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      if (data.destroyFileUpload) {
        const { id, group } = data.destroyFileUpload
        const variables = { group }

        try {
          // get file uploads cache
          const fileUploadsCache = store.readQuery({
            query: fileUploadsGql,
            variables
          })

          // remove from file uploads cache
          store.writeQuery({
            query: fileUploadsGql,
            variables,
            data: {
              fileUploads: fileUploadsCache.fileUploads.filter(t => t.id !== id)
            }
          })
        } catch (error) {
          // re-query file uploads
          client.query({
            query: fileUploadsGql,
            variables
          })
        }
      }
    }
  })
}

export default destroyFileUpload
