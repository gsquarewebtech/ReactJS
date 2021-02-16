import client from '../client'

import updateExcelFileColumnResolversGql from '../mutations/update-excel-file-column-resolvers'

const updateExcelFileColumnResolver = (input) => {
  return client.mutate({
    mutation: updateExcelFileColumnResolversGql,
    variables: input
  })
}

export default updateExcelFileColumnResolver
