import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button } from '@lib'
import { Link } from '@shared'
import { Group, Input, Submit } from '@shared/Form'
import QuestionItem from '@shared/QuestionItem'

import QuestionnaireResponseRates from './questionnaire-response-rates'
import QuestionnaireResponseExceptions from './questionnaire-response-exceptions'
import QuestionnaireResponseSummary from './questionnaire-response-summary'

import authGql from '@graphql/queries/auth'
import questionnaireRequestGql from '@graphql/queries/questionnaire-request'
import updateQuestionnaireResponseRateDate from '@graphql/mutators/update-questionnaire-response-rate-date'

const QuestionnaireRequestView = ({
  questionnaireRequestId,
  selectedTab,
  readonly,
  showTotalScore,
  editScore
}) => {
  const authQuery = useQuery(authGql)
  const loggedInuser = authQuery.data.auth
  const questionnaireRequestQuery = useQuery(questionnaireRequestGql, {
    variables: {
      id: questionnaireRequestId
    }
  })

  const [currentTab, setCurrentTab] = useState(selectedTab || '#questionnaire')
  const [rateTabState, setRateTabState] = useState({})

  const history = useHistory()

  const handleTabChange = (tab) => {
    history.push(`${tab}`)
    setCurrentTab(tab)
  }

  useEffect(() => {
    if (rateTabState.beginDate && rateTabState.endDate) {
      updateQuestionnaireResponseRateDate({
        questionnaireRequestId,
        beginDate: rateTabState.beginDate,
        endDate: rateTabState.endDate
      })
    }
  }, [rateTabState])

  if (questionnaireRequestQuery.loading) {
    return null
  }

  const handleChangeAnswer = () => {
    console.log('Logger::changed answer')
  }

  const handleSetRateState = (name, value) => {
    setRateTabState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const { questionnaireRequest } = questionnaireRequestQuery.data
  const { questionnaireRequestGroup } = questionnaireRequest
  const { questionnaire } = questionnaireRequest
  const { questionnaireResponses } = questionnaireRequest
  const { questionnaireResponseRates } = questionnaireRequest

  let isReadOnly = readonly

  if (loggedInuser.userType.name === 'vendor') {
    isReadOnly = questionnaireRequest.completed
  }

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#questionnaire' })}>
          <Link
            text='Questionnaire'
            to='#questionnaire'
            onClick={() => { handleTabChange('#questionnaire') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#rates' })}>
          <Link
            text='Rates'
            to='#rates'
            onClick={() => { handleTabChange('#rates') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#exclusions' })}>
          <Link
            text='Specialty & Exclusions'
            to='#exclusions'
            onClick={() => { handleTabChange('#exclusions') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#summary' })}>
          <Link
            text='Summary'
            to='#summary'
            onClick={() => { handleTabChange('#summary') }}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#questionnaire' && (
          <div className='tab-pane'>
            <div className='questionnaire-info'>
              <Group>
                <Input
                  label='RFP Request Name'
                  type='text'
                  value={questionnaire.name}
                  disabled={true}
                />

                {showTotalScore && (
                  <div className='questionnaire-total-score'>
                    <div className='score-box'>
                      <span className='text'>
                        Total Score
                      </span>
                      <span className='value'>
                        {questionnaireRequest.totalScore || 0}
                      </span>
                    </div>
                  </div>
                )}
              </Group>

              <Group>
                <Input
                  label='Client'
                  type='text'
                  value={questionnaireRequestGroup?.client}
                  disabled={true}
                />
              </Group>

              <Group>
                <Input
                  label='Source'
                  type='text'
                  value={questionnaire?.client?.name}
                  disabled={true}
                />
              </Group>

              <Group>
                <Input
                  label='Notes'
                  type='textarea'
                  value={questionnaire.description}
                  disabled={true}
                />
              </Group>
            </div>

            {questionnaireResponses.map(response => (
              <QuestionItem
                key={response.id}
                question={response.question}
                response={response}
                onChangeAnswer={handleChangeAnswer}
                readonly={isReadOnly}
                editScore={editScore}
              />
            ))}

            <Submit className='right'>
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#rates')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#rates' && (
          <div className='tab-pane'>
            <QuestionnaireResponseRates
              rates={questionnaireResponseRates}
              readonly={isReadOnly}
              state={rateTabState}
              onChangeState={handleSetRateState}
            />
            <Submit className='space-between'>
              <Button
                className='circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#questionnaire')}
              />
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#exclusions')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#exclusions' && (
          <div className='tab-pane'>
            <QuestionnaireResponseExceptions
              questionnaireRequest={questionnaireRequest}
              readonly={isReadOnly}
            />
            <Submit className='space-between'>
              <Button
                className='circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#rates')}
              />
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#summary')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#summary' && (
          <div className='tab-pane'>
            <QuestionnaireResponseSummary
              questionnaireRequest={questionnaireRequest}
              readonly={isReadOnly}
            />

            {isReadOnly && (
              <Submit>
                <Button
                  className='circle icon-left'
                  icon='fal fa-arrow-left'
                  text='Back'
                  onClick={() => handleTabChange('#exclusions')}
                />
              </Submit>
            )}

            {!isReadOnly && (
              <Submit className='summary-button-editable'>
                <Button
                  className='circle icon-left'
                  icon='fal fa-arrow-left'
                  text='Back'
                  onClick={() => handleTabChange('#exclusions')}
                />
              </Submit>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

QuestionnaireRequestView.propTypes = {
  questionnaireRequestId: PropTypes.string.isRequired,
  selectedTab: PropTypes.string,
  readonly: PropTypes.bool,
  editScore: PropTypes.bool,
  showTotalScore: PropTypes.bool
}

QuestionnaireRequestView.defaultProps = {
  selectedTab: '#questionnaire',
  readonly: true,
  editScore: false,
  showTotalScore: false
}

export default QuestionnaireRequestView
