import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Button, swal } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import questionnairesGql from '@graphql/queries/questionnaires'
import destroyQuestionnaire from '@graphql/mutators/destroy-questionnaire'

const QuestionnaireList = ({ itemClass, links, fields, onDelete }) => {
  const questionnairesQuery = useQuery(questionnairesGql)

  if (questionnairesQuery.loading) {
    return null
  }

  const { questionnaires } = questionnairesQuery.data

  const handleDelete = (questionnaire) => {
    swal({
      text: 'Are you sure you want to delete this questionnaire?',
      icon: 'warning',
      buttons: {
        delete: {
          text: 'Yes',
          value: 'delete'
        },
        cancel: 'Cancel'
      }
    }).then((value) => {
      if (value === 'delete') {
        destroyQuestionnaire(questionnaire.id).then(() => {
          onDelete(questionnaire)
          swal({
            text: 'Questionnaire deleted!',
            icon: 'success',
            buttons: false,
            timer: 1500
          })
        })
      }
    })
  }

  return (
    <ListView>
      {questionnaires.map(questionnaire => (
        <Item
          key={questionnaire.id}
          className={itemClass}
        >
          {fields.name && (
            <Field label='Name'>
              <Link
                to={`${links.view}/${questionnaire.id}`}
                text={questionnaire.name}
              />
            </Field>

          )}

          {fields.client && (
            <Field
              label='Client'
              value={questionnaire.client?.name}
            />
          )}

          {fields.questions && (
            <Field
              label='Questions'
              data=''
            />
          )}

          {fields.requests && (
            <Field
              label='Requests'
              data=''
            />
          )}

          {fields.actions && (
            <Field
              className='item-action'
              noLabel
            >
              <Link
                className='button blue circle with-text'
                text='New RFP Request'
                to={`${links.createRequest}/${questionnaire.id}/request/new`}
              />
              <Button
                className='red circle'
                onClick={() => handleDelete(questionnaire)}
                icon='fal fa-trash'
              />
            </Field>
          )}

        </Item>
      ))}
    </ListView>
  )
}

QuestionnaireList.propTypes = {
  questionnaires: PropTypes.array,
  links: PropTypes.object,
  itemClass: PropTypes.string,
  fields: PropTypes.object,
  onDelete: PropTypes.func
}

QuestionnaireList.defaultProps = {
  questionnaires: [],
  links: {
    view: '',
    edit: '',
    createRequest: ''
  },
  fields: {
    name: true,
    client: false,
    questions: false,
    requests: false,
    actions: true
  },
  onDelete: () => {}
}

export default QuestionnaireList
