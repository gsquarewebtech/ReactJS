import client from '../client'

import sendForgotPasswordGql from '../mutations/send-forgot-password'

const sendForgotPassword = (input) => {
  return client.mutate({
    mutation: sendForgotPasswordGql,
    variables: input,
    update: (store, { data }) => {
      console.log('Logger::sendForgotPasswordMutator', data)
    }
  })
}

export default sendForgotPassword
