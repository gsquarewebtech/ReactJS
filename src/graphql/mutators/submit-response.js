import client from '../client'

import submitResponseGql from '../mutations/submit-response'

const submitResponse = (input) => {
  return client.mutate({
    mutation: submitResponseGql,
    variables: input,
    update: (store, { data }) => {
      console.log('Logger::submitResponse', data)
    }
  })
}

export default submitResponse
