import client from '../client'
import questionnairesGql from '../queries/questionnaires'
import createQuestionnaireGql from '../mutations/create-questionnaire'

const createQuestionnaire = (input) => {
  return client.mutate({
    mutation: createQuestionnaireGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createQuestionnaire) {
        try {
          // get questionnaires cache
          const cache = store.readQuery({
            query: questionnairesGql
          })

          // add to questionnaires cache
          store.writeQuery({
            query: questionnairesGql,
            data: {
              questionnaires: [...cache.questionnaires, data.createQuestionnaire]
            }
          })
        } catch (error) {
          // re-query questionnaires
          client.query({
            query: questionnairesGql
          })
        }
      }
    }
  })
}

export default createQuestionnaire
