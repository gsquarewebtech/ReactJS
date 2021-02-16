import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'

import { Link } from '@shared'
import { Action, Search, Buttons } from '@shared/Action'
import FileUploadList from '@shared/FileUploadList'
import QuestionnaireList from '@shared/QuestionnaireList'

const RFPQuestionnairesView = ({ selectedTab, role }) => {
  const history = useHistory()
  const [currentTab, setCurrentTab] = useState(selectedTab)

  const handleTabChange = (tab) => {
    history.push(`/${role}/rfp-logic/questionnaires${tab}`)
    setCurrentTab(tab)
  }

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#files' })}>
          <Link
            text='Questionnaires'
            to='#files'
            onClick={() => handleTabChange('#files')}
          />
        </li>
        <li className={classNames({ active: currentTab === '#questionnaires' })}>
          <Link
            text='Questionnaires'
            to='#questionnaires'
            onClick={() => handleTabChange('#questionnaires')}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#files' && (
          <div className='tab-pane'>
            <Action>
              <Search placeholder='Search File Upload ...' />
              <Buttons className='right'>
                <Link
                  className='button circle icon-left'
                  to={`/${role}/rfp-logic/questionnaire/file/new`}
                  icon='fal fa-upload'
                  text='New Upload'
                />
              </Buttons>
            </Action>

            <FileUploadList
              group='questionnaires'
              itemClass='border-bottom'
              links={{
                view: `/${role}/rfp-logic/questionnaire/file`,
                createQuestionnaire: `/${role}/rfp-logic/questionnaire/file`
              }}
              fields={{
                name: true,
                client: role === 'admin',
                actions: true
              }}
              actions={{
                delete: true,
                createQuestionnaire: true
              }}
            />
          </div>
        )}

        {currentTab === '#questionnaires' && (
          <div className='tab-pane'>
            <Action>
              <Search placeholder='Search Questionnaire ...' />
            </Action>

            <QuestionnaireList
              itemClass='border-bottom'
              links={{
                view: `/${role}/rfp-logic/questionnaire`,
                createRequest: `/${role}/rfp-logic/questionnaire`
              }}
              fields={{
                name: true,
                client: role === 'admin',
                questions: false,
                requests: false,
                actions: true
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

RFPQuestionnairesView.propTypes = {
  selectedTab: PropTypes.string,
  fileUploads: PropTypes.array,
  questionnaires: PropTypes.array,
  role: PropTypes.string
}

RFPQuestionnairesView.defaultProps = {
  selectedTab: '#files',
  fileUploads: [],
  questionnaires: [],
  role: ''
}

export default RFPQuestionnairesView
