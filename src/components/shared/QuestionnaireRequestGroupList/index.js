import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Pagination, Button, swal } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'
import { time } from '@utils'

import questionnaireRequestGroupsGql from '@graphql/queries/questionnaire-request-groups'

const QuestionnaireRequestGroupList = ({ links, fields, itemClass, filters }) => {
  const history = useHistory()

  const [currentPage, setCurrentPage] = useState(1)
  const [showedRequestCount, setShowedRequestCount] = useState(5)

  // set search
  const variables = {}

  if (filters.search) {
    variables.search = filters.search
  }

  const questionnaireRequestGroupsQuery = useQuery(questionnaireRequestGroupsGql, { variables })

  if (questionnaireRequestGroupsQuery.loading) {
    return null
  }

  const { questionnaireRequestGroups } = questionnaireRequestGroupsQuery.data

  // pagination
  const requestsLength = questionnaireRequestGroups.length
  const pages = Math.ceil(requestsLength / showedRequestCount)

  const currentRequests = []
  const startRequestIndex = (currentPage - 1) * showedRequestCount
  let endRequestIndex = startRequestIndex + (showedRequestCount - 1)
  if (endRequestIndex > (requestsLength - 1)) {
    endRequestIndex = requestsLength - 1
  }

  for (let i = startRequestIndex; i <= endRequestIndex; i++) {
    const request = questionnaireRequestGroups[i]
    currentRequests.push(
      request
    )
  }

  const handleEdit = (questionnaireRequestGroup) => {
    if (questionnaireRequestGroup.isFinalized) {
      swal({
        text: 'RFP has been finalized',
        icon: 'error',
        buttons: false,
        timer: 2500
      })
    } else {
      history.push(`${links.edit}/${questionnaireRequestGroup.id}`)
    }
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedRequestCount(size)
  }
  // end

  return (
    <ListView>
      {currentRequests.map(questionnaireRequestGroup => (
        <Item
          key={questionnaireRequestGroup.id}
          className={itemClass}
        >
          <Field label='RFP Request ID'>
            <Link
              to={`${links.view}/${questionnaireRequestGroup.id}`}
              text={questionnaireRequestGroup.id.toString().padStart(6, '0')}
            />
          </Field>

          {fields.questionnaire && (
            <Field
              label='RFP'
              value={questionnaireRequestGroup.questionnaire.name}
            />
          )}

          <Field
            label='Client'
            value={questionnaireRequestGroup.client}
          />

          {fields.client && (
            <Field
              label='Source'
              value={questionnaireRequestGroup.questionnaire.client.name}
            />
          )}

          {fields.expiration && (
            <Field
              label='Expiration'
              value={time.utc(questionnaireRequestGroup.expiresAt).local().format('MMM. DD, YYYY hh:mm A')}
            />
          )}

          {fields.actions && (
            <Field
              className='item-action'
              noLabel
            >
              <Link
                className='button blue circle with-text'
                text='View Response Summary'
                to={`${links.view}/${questionnaireRequestGroup.id}`}
              />

              <Button
                className={`${questionnaireRequestGroup.isFinalized ? 'disabled' : 'blue'} circle`}
                icon='fa fa-pencil'
                onClick={() => handleEdit(questionnaireRequestGroup)}
              />
            </Field>
          )}
        </Item>
      ))}

      <Pagination
        className='centered'
        pages={pages}
        limit={10}
        currentPage={currentPage}
        onPageClick={handlePageClick}
        sizes={[5, 10, 25, 50, 100]}
        selectedSize={showedRequestCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

QuestionnaireRequestGroupList.propTypes = {
  questionnaireRequestGroups: PropTypes.array,
  links: PropTypes.object,
  itemClass: PropTypes.string,
  fields: PropTypes.object,
  filters: PropTypes.object
}

QuestionnaireRequestGroupList.defaultProps = {
  questionnaireRequestGroups: [],
  links: {
    view: '',
    edit: ''
  },
  fields: {
    source: false,
    client: false,
    questionnaire: false,
    expiration: true,
    actions: {
      view: true,
      edit: false
    }
  },
  filters: {}
}

export default QuestionnaireRequestGroupList
