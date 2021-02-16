import client from '../client'
import templateFieldMappingsGql from '../queries/template-field-mappings'
import destroyTemplateFieldMappingGql from '../mutations/destroy-template-field-mapping'

const destroyTemplateFieldMapping = (id, clientId) => {
  return client.mutate({
    mutation: destroyTemplateFieldMappingGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      const { id, templateField } = data.destroyTemplateFieldMapping

      const variables = {
        clientId: clientId,
        templateId: templateField.templateId
      }

      // read templateFieldMappings existing cache
      const templateFieldMappingsCache = store.readQuery({
        query: templateFieldMappingsGql,
        variables
      })

      // remove templateFieldMappings from cache
      store.writeQuery({
        query: templateFieldMappingsGql,
        variables,
        data: {
          templateFieldMappings: templateFieldMappingsCache.templateFieldMappings.filter(t => t.id !== id)
        }
      })
    }
  })
}

export default destroyTemplateFieldMapping
