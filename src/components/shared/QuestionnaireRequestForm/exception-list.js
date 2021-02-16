import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { ListView, Item, Field } from '@shared/ListView'

import questionnaireExceptionsGql from '@graphql/queries/questionnaire-exceptions'

const ExceptionList = ({ selected, onChange }) => {
  const questionnaireExceptionsQuery = useQuery(questionnaireExceptionsGql)

  if (questionnaireExceptionsQuery.loading) {
    return null
  }

  const handleCheckChange = (evt, questionnaireException) => {
    onChange({
      id: questionnaireException.id,
      checked: evt.target.checked
    })
  }

  const { questionnaireExceptions } = questionnaireExceptionsQuery.data

  return (
    <ListView>
      {questionnaireExceptions.map(questionnaireException => (
        <Item key={questionnaireException.id}>
          <Field
            className='flex-none'
            label='Add'
          >
            <input
              type='checkbox'
              checked={selected.includes(questionnaireException.id)}
              onChange={(evt) => handleCheckChange(evt, questionnaireException)}
            />
          </Field>

          <Field
            label='Name'
            value={questionnaireException.name}
          />
        </Item>
      ))}
    </ListView>
  )
}

ExceptionList.propTypes = {
  selected: PropTypes.array,
  onChange: PropTypes.func
}

ExceptionList.defaultProps = {
  selected: [],
  onChange: () => null
}

export default ExceptionList
