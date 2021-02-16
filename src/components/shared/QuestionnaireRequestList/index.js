import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import { Badge, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'
import { time } from '@utils'

import authGql from '@graphql/queries/auth'
import questionnaireRequestsGql from '@graphql/queries/questionnaire-requests'

const QuestionnaireRequestList = ({ links, fields, itemClass, questionnaireRequestGroupId, role, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedResponseCount, setShowedResponseCount] = useState(5)

  // get logged in user info
  const authQuery = useQuery(authGql)
  const loggedInuser = authQuery.data.auth

  const history = useHistory()

  // set search
  const variables = {}

  if (filters.search) {
    variables.search = filters.search
  }

  if (questionnaireRequestGroupId) {
    variables.questionnaireRequestGroupId = questionnaireRequestGroupId
  }

  const questionnaireRequestsQuery = useQuery(questionnaireRequestsGql, { variables })

  if (questionnaireRequestsQuery.loading) {
    return null
  }

  const { questionnaireRequests } = questionnaireRequestsQuery.data

  // pagination
  const responsesLength = questionnaireRequests.length
  const pages = Math.ceil(responsesLength / showedResponseCount)

  const currentResponses = []
  const startResponseIndex = (currentPage - 1) * showedResponseCount
  let endResponseIndex = startResponseIndex + (showedResponseCount - 1)
  if (endResponseIndex > (responsesLength - 1)) {
    endResponseIndex = responsesLength - 1
  }

  for (let i = startResponseIndex; i <= endResponseIndex; i++) {
    const response = questionnaireRequests[i]
    currentResponses.push(
      response
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedResponseCount(size)
  }
  // end

  const handleExpired = (request) => {
    if (role === 'admin' || role === 'client') {
      history.push(`${links.view}/${request.id}`)
    } else {
      if (request.isExpired) {
        swal({
          text: 'This RFP request has already expired',
          icon: 'error',
          buttons: false,
          timer: 2500
        })
      } else {
        history.push(`${links.view}/${request.id}`)
      }
    }
  }

  return (
    <ListView className='questionnaire-request-list-view'>
      {currentResponses.map(questionnaireRequest => (
        <Item
          key={questionnaireRequest.id}
          className={itemClass}
        >
          {fields.id && (
            <Field label='Response ID'>
              <a
                onClick={() => handleExpired(questionnaireRequest)}
              >
                {questionnaireRequest.id.toString().padStart(6, '0')}
              </a>
            </Field>
          )}

          {fields.id && (
            <Field
              label='RFP'
              value={questionnaireRequest?.questionnaire?.name}
            />
          )}

          <Field
            label='Client'
            value={questionnaireRequest?.questionnaireRequestGroup?.client}
          />

          {fields.client && (
            <Field
              label='Source'
              value={questionnaireRequest?.questionnaire?.client?.name}
            />
          )}

          {fields.vendor && (
            <Field
              label='Vendor'
              value={questionnaireRequest?.vendor?.name}
            />
          )}

          {fields.status && (
            <Field
              label='Status'
            >
              {questionnaireRequest.status === 'disqualified' && loggedInuser.userType.name === 'vendor' && (
                <Badge className={classNames('circle status-badge', 'completed')}>
                  {'completed'}
                </Badge>
              )}

              {questionnaireRequest.status !== 'disqualified' && (
                <Badge className={classNames('circle status-badge', questionnaireRequest.status)}>
                  {questionnaireRequest.status}
                </Badge>
              )}
            </Field>
          )}

          {fields.expiration && (
            <Field
              label='Expiration'
              value={time.utc(questionnaireRequest.expiresAt).local().format('MMM. DD, YYYY hh:mm A')}
            />
          )}

          {fields.actions && (
            fields.vendor && (
              <Field
                className='item-action'
                noLabel
              >
                <Link
                  className='button blue circle with-text'
                  text='View Response'
                  to={`${links.view}/${questionnaireRequest.id}`}
                />
              </Field>
            )
          )}

          {fields.actions && !fields.vendor && !questionnaireRequest.completed && (
            <Field
              className='item-action vendor-action'
              noLabel
            >
              {!questionnaireRequest.isExpired && (
                <Link
                  className='button blue circle with-text'
                  text='Respond'
                  to={`${links.view}/${questionnaireRequest.id}`}
                />
              )}
            </Field>
          )}

          {fields.actions && !fields.vendor && questionnaireRequest.completed && (
            <Field
              className='item-action vendor-action'
              noLabel
            >
              {!questionnaireRequest.isExpired && (
                <Link
                  className='button blue circle with-text'
                  text='View'
                  to={`${links.view}/${questionnaireRequest.id}`}
                />
              )}
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
        selectedSize={showedResponseCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

QuestionnaireRequestList.propTypes = {
  links: PropTypes.object,
  itemClass: PropTypes.string,
  fields: PropTypes.object,
  questionnaireRequestGroupId: PropTypes.string,
  role: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

QuestionnaireRequestList.defaultProps = {
  links: {
    view: '',
    edit: ''
  },
  fields: {
    id: true,
    vendor: false,
    client: false,
    status: true,
    expiration: false,
    actions: true
  },
  questionnaireRequestGroupId: null,
  role: null,
  onDelete: () => {},
  filters: {}
}

export default QuestionnaireRequestList
