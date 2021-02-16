import client from '../client'
import destroyQuestionnaireGql from '../mutations/destroy-questionnaire'
import questionnairesGql from '../queries/questionnaires'

const destroyQuestionnaire = (id, options = {}) => {
  return client.mutate({
    mutation: destroyQuestionnaireGql,
    variables: {
      id
    },
    update: (store, { data }) => {
      const { id } = data.destroyQuestionnaire

      // read questionnaires existing cache
      const questionnairesCache = store.readQuery({
        query: questionnairesGql,
        variables: options.variables
      })

      // remove questionnaire from cache
      store.writeQuery({
        query: questionnairesGql,
        variables: options.variables,
        data: {
          questionnaires: questionnairesCache.questionnaires.filter(t => t.id !== id)
        }
      })
    }
  })
}

export default destroyQuestionnaire
