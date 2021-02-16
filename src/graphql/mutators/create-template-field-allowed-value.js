import client from '../client'
import templateFieldAllowedValuesGql from '../queries/template-field-allowed-values'
import createTemplateFieldAllowedValueGql from '../mutations/create-template-field-allowed-value'

const createTemplateFieldAllowedValue = (input) => {
  return client.mutate({
    mutation: createTemplateFieldAllowedValueGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createTemplateFieldAllowedValue) {
        try {
          const { clientId, templateField } = data.createTemplateFieldAllowedValue

          const variables = {
            clientId: clientId,
            templateId: templateField.templateId
          }

          // get templateFieldAllowedValues cache
          const cache = store.readQuery({
            query: templateFieldAllowedValuesGql,
            variables
          })

          // add to templateFieldAllowedValues cache
          store.writeQuery({
            query: templateFieldAllowedValuesGql,
            variables,
            data: {
              templateFieldAllowedValues: [...cache.templateFieldAllowedValues, data.createTemplateFieldAllowedValue]
            }
          })
        } catch (error) {
          // re-query templateFieldAllowedValues
          client.query({
            query: templateFieldAllowedValuesGql
          })
        }
      }
    }
  })
}

export default createTemplateFieldAllowedValue
