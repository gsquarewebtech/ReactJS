import client from '../client'
import questionnaireRequestGroupsGql from '../queries/questionnaire-request-groups'
import createQuestionnaireRequestGroupGql from '../mutations/create-questionnaire-request-group'

const createQuestionnaire = (input) => {
  return client.mutate({
    mutation: createQuestionnaireRequestGroupGql,
    variables: input,
    update: (store, { data }) => {
      if (data.createQuestionnaireRequestGroup) {
        try {
          // get questionnaire request groups cache
          const cache = store.readQuery({
            query: questionnaireRequestGroupsGql
          })

          // add to questionnaire request groups cache
          store.writeQuery({
            query: questionnaireRequestGroupsGql,
            data: {
              questionnaireRequestGroups: [...cache.questionnaireRequestGroups, data.createQuestionnaireRequestGroup]
            }
          })
        } catch (error) {
          // re-query questionnaire request groups
          client.query({
            query: questionnaireRequestGroupsGql
          })
        }
      }
    }
  })
}

export default createQuestionnaire
