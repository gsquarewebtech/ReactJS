import client from '../client'
import templateFieldAllowedValuesGql from '../queries/template-field-allowed-values'
import destroyTemplateFieldAllowedValueGql from '../mutations/destroy-template-field-allowed-value'

const destroyTemplateFieldAllowedValue = (id, clientId, options = {}) => {
  return client.mutate({
    mutation: destroyTemplateFieldAllowedValueGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      const { id, templateField } = data.destroyTemplateFieldAllowedValue

      const variables = {
        clientId: clientId,
        templateId: templateField.templateId
      }

      // read templateFieldAllowedValues existing cache
      const templateFieldAllowedValuesCache = store.readQuery({
        query: templateFieldAllowedValuesGql,
        variables
      })

      // remove templateFieldAllowedValues from cache
      store.writeQuery({
        query: templateFieldAllowedValuesGql,
        variables,
        data: {
          templateFieldAllowedValues: templateFieldAllowedValuesCache.templateFieldAllowedValues.filter(t => t.id !== id)
        }
      })
    }
  })
}

export default destroyTemplateFieldAllowedValue
