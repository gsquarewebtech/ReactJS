import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card, Button } from '@lib'
import { Group, Input, Submit } from '@shared/Form'
import { object, array, time } from '@utils'

import questionnaireRequestGroupGql from '@graphql/queries/questionnaire-request-group'
import updateQuestionnaireRequestGroup from '@graphql/mutators/update-questionnaire-request-group'

const QuestionnaireRequestGroupForm = ({ questionnaireRequestGroupId, onSave }) => {
  const [input, setInput] = useState({})
  const [inputErrors, setInputErrors] = useState({})

  const questionnaireRequestGroupQuery = useQuery(questionnaireRequestGroupGql, {
    variables: {
      id: questionnaireRequestGroupId
    }
  })

  if (questionnaireRequestGroupQuery.loading) {
    return null
  }

  const { questionnaireRequestGroup } = questionnaireRequestGroupQuery.data
  const { questionnaireRequests } = questionnaireRequestGroup
  const { questionnaire } = questionnaireRequestGroup

  const handleInputChange = (name, value) => {
    setInput((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleUpdate = () => {
    const feErrors = {}
    const payload = {
      id: questionnaireRequestGroup.id,
      expiresAt: questionnaireRequestGroup.expiresAt,
      ...input
    }

    if (!payload.expiresAt) {
      feErrors.expiresAt = [{ path: 'expiresAt', message: 'expiration date is required' }]
    }

    if (!object.keys(feErrors).length) {
      updateQuestionnaireRequestGroup(payload).then(({ data, extensions }) => {
        if (data.updateQuestionnaireRequestGroup) {
          onSave()
        } else if (extensions?.errors) {
          setInputErrors(array.groupBy(extensions.errors, 'path'))
        }
      }).catch(error => {
        console.log('Logger::error', error)
      })
    } else {
      setInputErrors(feErrors)
    }
  }

  return (
    <Card>
      <Group>
        <Input
          label='RFP Request Name'
          type='text'
          value={questionnaire?.name}
          disabled
        />
      </Group>

      <Group>
        <Input
          label='Client'
          type='text'
          value={questionnaireRequestGroup.client}
          disabled
        />
      </Group>

      <Group>
        <Input
          label='Notes'
          type='textarea'
          value={questionnaire?.description}
          onChange={(value) => handleInputChange('description', value)}
          errors={inputErrors.description}
        />
      </Group>

      <Group>
        <Input
          label='Vendors'
          type='text'
          value={questionnaireRequests.map(req => req.vendor.name).join(', ')}
          disabled
        />
      </Group>

      <Group>
        <Input
          label='Expiration'
          type='datepicker'
          settings={{
            dateFormat: 'M. d, Y G:i K',
            enableTime: true
          }}
          value={questionnaireRequestGroup.expiresAt}
          onChange={(value) => handleInputChange('expiresAt', time.utc(value).format())}
          errors={inputErrors.expiresAt}
        />
      </Group>

      <Submit className='right'>
        <Button
          className='circle'
          text='Update Request'
          onClick={handleUpdate}
        />
      </Submit>
    </Card>
  )
}

QuestionnaireRequestGroupForm.propTypes = {
  questionnaireRequestGroupId: PropTypes.string.isRequired,
  onSave: PropTypes.func
}

QuestionnaireRequestGroupForm.defaultProps = {
  onSave: () => null
}

export default QuestionnaireRequestGroupForm
