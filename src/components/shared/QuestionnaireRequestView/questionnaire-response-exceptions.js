import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactToolTip from 'react-tooltip'

import { Input } from '@shared/Form'
import { ListView, Item, Field } from '@shared/ListView'
import SelectUploadInput from '@shared/SelectUploadInput'
import updateQuestionnaireResponseException from '@graphql/mutators/update-questionnaire-response-exception'
import updateQuestionnaireRequest from '@graphql/mutators/update-questionnaire-request'

const QuestionnaireResponseException = ({
  questionnaireRequest,
  readonly
}) => {
  const [input, setInput] = useState({
    vendorIds: [],
    exceptionIds: [],
    expiresAt: '',
    specialtyFile: questionnaireRequest.specialtyFile
  })

  const handleToggleException = (name, responseException, value) => {
    const input = {
      questionnaireRequestExceptionId: responseException.id,
      type: name,
      value
    }
    updateQuestionnaireResponseException(input).then(({ data }) => {
      console.log('Logger::updateQuestionnaireResponseException::data', data)
    })
  }
  const handleSpecialtyFileSelection = (name, value) => {
    setInput((prevState) => ({ ...prevState, [name]: value }))

    const input = {
      id: questionnaireRequest.id,
      specialtyFileId: value.id
    }

    updateQuestionnaireRequest(input).then(({ data }) => {
      console.log('Logger::updateQuestionnaireRequest::data', data)
    })
  }
  const [inputErrors] = useState({})

  const { questionnaireRequestExceptions } = questionnaireRequest

  return (
    <Fragment>
      <div className='specialty-section'>
        <h3>Specialty File
          {/* <i
            className='fal fa-question-circle'
            data-for='specialty-tooltip'
            data-tip='Upload the specialty list using the supported template file provided'
          />
          <ReactToolTip
            id='specialty-tooltip'
            type='light'
            border={true}
            borderColor='#000000'
          /> */}
        </h3>
        <SelectUploadInput
          group='specialty'
          accountId={questionnaireRequest.vendorId}
          value={input.specialtyFile}
          onChange={(value) => handleSpecialtyFileSelection('specialtyFile', value)}
          errors={inputErrors.specialtyFile}
        />
      </div>

      <div className='exception-section'>
        <h3>Exclusions
          <i
            className='fal fa-question-circle'
            data-for='exception-tooltip'
            data-tip='Toggle the corresponding rebates and discount fields based on the exclusions provided'
          />
          <ReactToolTip
            id='exception-tooltip'
            type='light'
            border={true}
            borderColor='#000000'
          />
        </h3>

        <ListView>
          {questionnaireRequestExceptions.map(questionnaireResponseException => (
            <Item key={questionnaireResponseException.id}>
              <Field
                label='Name'
                value={questionnaireResponseException?.questionnaireException?.name}
              />

              <Field
                label='Rebates'
              >
                <Input
                  type='toggle'
                  value={questionnaireResponseException?.questionnaireResponseException?.rebate}
                  disabled={readonly}
                  onChange={(value) => handleToggleException('rebate', questionnaireResponseException, value)}
                />
              </Field>

              <Field
                label='Discount'
              >
                <Input
                  type='toggle'
                  value={questionnaireResponseException?.questionnaireResponseException?.discount}
                  disabled={readonly}
                  onChange={(value) => handleToggleException('discount', questionnaireResponseException, value)}
                />
              </Field>
            </Item>
          ))}
        </ListView>
      </div>
    </Fragment>
  )
}

QuestionnaireResponseException.propTypes = {
  questionnaireRequest: PropTypes.object,
  readonly: PropTypes.bool
}

QuestionnaireResponseException.defaultProps = {
  questionnaireRequest: {},
  readonly: true
}

export default QuestionnaireResponseException
