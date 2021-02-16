import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Button, swal } from '@lib'
import { Group, Info, Submit, FormError } from '@shared/Form'
import { array } from '@utils'

import submitResponse from '@graphql/mutators/submit-response'

const QuestionnaireResponseSummary = ({ questionnaireRequest, readonly }) => {
  const [submitErrors, setSubmitErrors] = useState({})
  const history = useHistory()

  const handleSubmit = () => {
    swal({
      text: 'You will no longer be allowed to make changes after this, are you sure you want to send the response?',
      icon: 'warning',
      buttons: {
        delete: {
          text: 'Yes',
          value: 'submit'
        },
        cancel: 'Cancel'
      }
    }).then((value) => {
      if (value === 'submit') {
        submitResponse({
          id: questionnaireRequest.questionnaireResponseSummary.id
        }).then(({ data, extensions }) => {
          if (data.submitResponse) {
            swal({
              text: 'Response sent!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })

            history.push('/vendor/rfp-logic')
          } else if (extensions?.errors) {
            setSubmitErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      }
    })
  }

  return (
    <div>
      <FormError errors={submitErrors} />
      <Group>
        <Info
          label='Total Questions'
          value={questionnaireRequest.questionnaireResponseSummary.totalQuestions}
        />
        <Info
          label='Non-Required Questions'
          value={questionnaireRequest.questionnaireResponseSummary.skippableQuestions}
        />
      </Group>

      <Group>
        <Info
          label='Answered Questions'
          value={questionnaireRequest.questionnaireResponseSummary.answeredQuestions}
        />
        <Info
          label='Skipped Questions'
          value={questionnaireRequest.questionnaireResponseSummary.skippedQuestions}
        />
      </Group>

      <Group>
        <Info
          label='Answered Rates'
          value={questionnaireRequest.answeredRates}
        />
        <Info
          label='Exclusions'
          value={questionnaireRequest.answeredExceptions}
        />
      </Group>

      {!readonly && !questionnaireRequest.completed && (
        <Submit className='right'>
          <Button
            className='circle icon-right'
            icon='fal fa-paper-plane'
            iconAlign='right'
            text='Send Response'
            onClick={handleSubmit}
          />
        </Submit>
      )}
    </div>
  )
}

QuestionnaireResponseSummary.propTypes = {
  questionnaireRequest: PropTypes.object,
  readonly: PropTypes.bool
}

QuestionnaireResponseSummary.defaultProps = {
  questionnaireRequest: {},
  readonly: true
}

export default QuestionnaireResponseSummary
