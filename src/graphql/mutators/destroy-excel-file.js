import client from '../client'

import excelFilesGql from '../queries/excel-files'
import destroyExcelFileGql from '../mutations/destroy-excel-file'

const destroyExcelFile = (input) => {
  return client.mutate({
    mutation: destroyExcelFileGql,
    variables: {
      id: input.id
    },
    update: (store, { data }) => {
      if (data.destroyExcelFile) {
        const { id, accountId, group } = data.destroyExcelFile
        const variables = { group }

        if (input.accountId) {
          variables.accountId = accountId
        }

        // read users cache
        const filesCache = store.readQuery({
          query: excelFilesGql,
          variables
        })

        // remove from users cache
        store.writeQuery({
          query: excelFilesGql,
          variables,
          data: {
            excelFiles: filesCache.excelFiles.filter(t => t.id !== id)
          }
        })
      }
    }
  })
}

export default destroyExcelFile
