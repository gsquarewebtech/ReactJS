import client from '../client'
import fileUploadsGql from '../queries/file-uploads'
import createFileUploadGql from '../mutations/create-file-upload'

const createFileUpload = (input) => {
  return client.mutate({
    mutation: createFileUploadGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createFileUpload) {
        const variables = { group: input.group }

        try {
        // read file uploads cache
          const fileUploadsCache = store.readQuery({
            query: fileUploadsGql,
            variables
          })

          // add to file uploads cache
          const newFileUpload = data.createFileUpload.fileUpload
          newFileUpload.__typename = 'FileUpload'
          newFileUpload.upload.__typename = 'UploadedFile'
          newFileUpload.account.__typename = 'Account'

          store.writeQuery({
            query: fileUploadsGql,
            variables,
            data: {
              fileUploads: [...fileUploadsCache.fileUploads, newFileUpload]
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

export default createFileUpload
