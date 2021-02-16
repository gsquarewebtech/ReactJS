import client from '../client'
import templateFieldMappingsGql from '../queries/template-field-mappings'
import createTemplateFieldMappingGql from '../mutations/create-template-field-mapping'

const createTemplateFieldMapping = (input) => {
  return client.mutate({
    mutation: createTemplateFieldMappingGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createTemplateFieldMapping) {
        try {
          const { clientId, templateField } = data.createTemplateFieldMapping

          const variables = {
            clientId: clientId,
            templateId: templateField.templateId
          }

          // get templateFieldMappings cache
          const cache = store.readQuery({
            query: templateFieldMappingsGql,
            variables
          })

          // add to templateFieldMappings cache
          store.writeQuery({
            query: templateFieldMappingsGql,
            variables,
            data: {
              templateFieldMappings: [...cache.templateFieldMappings, data.createTemplateFieldMapping]
            }
          })
        } catch (error) {
          // re-query templateFieldMappings
          client.query({
            query: templateFieldMappingsGql
          })
        }
      }
    }
  })
}

export default createTemplateFieldMapping
