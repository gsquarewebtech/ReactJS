import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Icon, swal } from '@lib'
import { Group, Input, Submit, FormError } from '@shared/Form'
import { array, object } from '@utils'
import config from '@config'

import uploadQuestionnaireRequestSpecialtyFile from '@graphql/mutators/upload-questionnaire-request-specialty-file'

const QuestionnaireSpecialtyFile = ({ questionnaireRequest, readonly }) => {
  const [state, setState] = useState({
    showUpload: false
  })

  const [input, setInput] = useState({
    questionnaireRequestId: questionnaireRequest.id,
    file: null
  })
  const [errors, setErrors] = useState({})

  const handleUpload = () => {
    // upload if file not yet exist
    const feErrors = {}

    if (!input.questionnaireRequestId) {
      feErrors.questionnaireRequestId = [{ path: 'questionnaireRequestId', message: 'questionnaire request id is required' }]
    }

    if (!input.file) {
      feErrors.file = [{ path: 'file', message: 'file is required' }]
    }

    if (!object.keys(feErrors).length) {
      uploadQuestionnaireRequestSpecialtyFile(input).then(({ data, extensions }) => {
        if (data.uploadQuestionnaireRequestSpecialtyFile) {
          setErrors({})
          swal({
            text: 'File uploaded!',
            icon: 'success',
            buttons: false,
            timer: 3000
          })
        } else if (extensions?.errors) {
          setErrors(array.groupBy(extensions?.errors, 'path'))
        }
      })
    } else {
      setErrors(feErrors)
    }
  }

  const token = localStorage.authToken

  return (
    <div>
      <Group className='specialty-template right'>
        <a
          className='button small circle icon-left'
          href={`${config.API_URL}/templates/${token}/specialty`}
        >
          <Icon className='fal fa-download' />
          Download Template
        </a>
      </Group>

      <FormError errors={errors} />

      <Group>
        <Input
          placeholder={questionnaireRequest?.specialtyFile?.upload?.name || 'Choose File ...'}
          type='file'
          disabled={readonly}
          onChange={(value) => {
            setInput((prevState) => ({ ...prevState, file: value }))
            setState((prevState) => ({ ...prevState, showUpload: true }))
          }}
          errors={errors.file}
        />
      </Group>

      {!readonly && state.showUpload && (
        <Submit className='right'>
          <Button
            className='circle icon-left'
            icon='fal fa-upload'
            text='Upload'
            onClick={handleUpload}
          />
        </Submit>
      )}
    </div>
  )
}

QuestionnaireSpecialtyFile.propTypes = {
  questionnaireRequest: PropTypes.object,
  readonly: PropTypes.bool
}

QuestionnaireSpecialtyFile.defaultProps = {
  questionnaireRequest: {},
  readonly: true
}

export default QuestionnaireSpecialtyFile
