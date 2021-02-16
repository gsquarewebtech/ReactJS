import client from '../client'

import questionnaireRequestGql from '@graphql/queries/questionnaire-request'
import updateQuestionnaireResponseRateGql from '../mutations/update-questionnaire-response-rate'

const updateQuestionnaireResponseRate = (input) => {
  return client.mutate({
    mutation: updateQuestionnaireResponseRateGql,
    variables: input,
    update: (store, { data }) => {
      if (data.updateQuestionnaireResponseRate) {
        const variables = {
          id: data.updateQuestionnaireResponseRate.questionnaireRequestId
        }

        // read questionnaire request cache
        const questionnaireRequestStore = store.readQuery({
          query: questionnaireRequestGql,
          variables
        })

        const updatedStore = {
          ...questionnaireRequestStore.questionnaireRequest,
          questionnaireResponseSummary: {
            ...questionnaireRequestStore.questionnaireRequest.questionnaireResponseSummary,
            answeredRates: questionnaireRequestStore.questionnaireRequest.questionnaireResponseSummary.answeredRates + 1
          }
        }

        // update answered rate summary
        store.writeQuery({
          query: questionnaireRequestGql,
          variables,
          data: {
            questionnaireRequest: updatedStore
          }
        })
      }
    }
  })
}

export default updateQuestionnaireResponseRate
