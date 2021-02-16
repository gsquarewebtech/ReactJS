import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '@lib'
import { Link } from '@shared'
import { Form, Group, Input, Info, Submit, FormError } from '@shared/Form'
import SelectUploadInput from '@shared/SelectUploadInput'
import QuestionnairePreviewExcel from '@shared/QuestionnairePreviewExcel'
import { array, object, time } from '@utils'

import client from '@graphql/client'
import excelFileGql from '@graphql/queries/excel-file'
import clientVendorsGql from '@graphql/queries/client-vendors'
import createQuestionnaireRequestGroup from '@graphql/mutators/create-questionnaire-request-group'

import ExceptionList from './exception-list'

const QuestionnaireRequestForm = ({ questionnaireFileId, selectedTab, onSave }) => {
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState(selectedTab || '#request')
  const [state, setState] = useState({
    excelFile: {},
    vendors: []
  })

  const history = useHistory()

  const handleTabChange = (tab) => {
    history.push(`${tab}`)
    setCurrentTab(tab)
  }

  const [input, setInput] = useState({
    vendorIds: [],
    exceptionIds: [],
    expiresAt: ''
  })
  const [inputErrors, setInputErrors] = useState({})

  useEffect(() => {
    if (loading) {
      client.query({
        query: excelFileGql,
        variables: {
          id: questionnaireFileId
        }
      }).then((excelFileQuery) => {
        const { excelFile } = excelFileQuery.data

        client.query({
          query: clientVendorsGql,
          variables: {
            clientId: excelFile.accountId
          }
        }).then(clientVendorsQuery => {
          const vendors = clientVendorsQuery.data.clientVendors
          setLoading(false)
          setState((prevState) => ({
            ...prevState,
            excelFile,
            vendors
          }))
        })
      })
    }
  }, [loading])

  const handleInputChange = (name, value) => {
    setInput((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSend = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}

    if (!input.client) {
      feErrors.client = [{ path: 'client', message: 'Client is required' }]
    }

    if (!input.name) {
      feErrors.name = [{ path: 'name', message: 'RFP Request Name is required' }]
    }

    if (!input.claimFile) {
      feErrors.claimFile = [{ path: 'claimFile', message: 'claim file is required' }]
    }

    if (!input.vendorIds.length) {
      feErrors.vendor = [{ path: 'vendor', message: 'vendor is required' }]
    }

    if (!input.expiresAt) {
      feErrors.expiresAt = [{ path: 'expiresAt', message: 'Expiration date is required' }]
    }

    // validate exceptions here ...

    if (!object.keys(feErrors).length) {
      const dataInput = {
        client: input.client,
        name: input.name,
        notes: input.notes,
        questionnaireFileId,
        vendorIds: input.vendorIds,
        exceptionIds: input.exceptionIds,
        expiresAt: input.expiresAt
      }

      if (input.claimFile?.constructor === File) {
        dataInput.claimFile = input.claimFile
      } else if (input.claimFile?.id) {
        dataInput.claimFileId = input.claimFile.id
      }

      setLoading(true)
      createQuestionnaireRequestGroup(dataInput).then(({ data, extensions }) => {
        setLoading(false)

        if (data.createQuestionnaireRequestGroup) {
          onSave()
        } else if (extensions && extensions.errors) {
          setInputErrors(array.groupBy(extensions.errors, 'path'))
        }
      }).catch(error => {
        setLoading(false)
        console.log('Logger::error::createQuestionnaireRequestGroup', error)
      })
    } else {
      setInputErrors(feErrors)
    }
  }

  const handleExceptionChange = (exception) => {
    let exceptionIds = [...input.exceptionIds]
    if (exception.checked) {
      exceptionIds.push(exception.id)
    } else {
      exceptionIds = exceptionIds.filter(id => id !== exception.id)
    }
    setInput((prevState) => ({ ...prevState, exceptionIds: exceptionIds }))
  }

  const excelFile = state.excelFile
  const vendors = state.vendors.map(data => ({ value: data.id, text: data.name }))

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#request' })}>
          <Link
            text='Request'
            to='#request'
            onClick={() => { setCurrentTab('#request') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#exclusions' })}>
          <Link
            text='Exclusions'
            to='#exclusions'
            onClick={() => { setCurrentTab('#exclusions') }}
          />
        </li>
        {/* <li className={classNames({ active: currentTab === '#questions' })}>
          <Link
            text='Preview Questions'
            to='#questions'
            onClick={() => { setCurrentTab('#questions') }}
          />
        </li> */}
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#request' && (
          <div className='tab-pane rfp-form'>
            <Form>
              <FormError errors={inputErrors} />

              <Group>
                <Info
                  label='Questionnaire File'
                  value={excelFile.upload?.name}
                />
              </Group>

              <Group>
                <Input
                  label='Client'
                  type='text'
                  value={input.client}
                  onChange={(value) => handleInputChange('client', value)}
                  errors={inputErrors.client}
                />
              </Group>

              <Group>
                <Input
                  label='RFP Request Name'
                  type='text'
                  value={input.name}
                  onChange={(value) => handleInputChange('name', value)}
                  errors={inputErrors.name}
                />
              </Group>

              <Group>
                <Input
                  label='Notes'
                  type='textarea'
                  value={input.notes}
                  onChange={(value) => handleInputChange('notes', value)}
                  errors={inputErrors.notes}
                />
              </Group>

              <Group>
                <SelectUploadInput
                  label='Claim File'
                  group='claims'
                  accountId={excelFile.accountId}
                  value={input.claimFile}
                  onChange={(value) => handleInputChange('claimFile', value)}
                  errors={inputErrors.claimFile}
                />
              </Group>

              <Group>
                <Input
                  label='Vendor'
                  type='multiselect'
                  options={vendors}
                  value={input.vendorIds}
                  onChange={(value) => handleInputChange('vendorIds', value)}
                  errors={inputErrors.vendor}
                />
              </Group>

              <Group>
                <Input
                  label='Expiration'
                  type='datepicker'
                  value={input.expiresAt}
                  settings={{
                    minDate: 'today',
                    dateFormat: 'M. d, Y G:i K',
                    enableTime: true
                  }}
                  onChange={(value) => handleInputChange('expiresAt', time.utc(value).format())}
                  errors={inputErrors.expiresAt}
                />
              </Group>

              <Submit className='right'>
                <Button
                  className='circle icon-right'
                  icon='fal fa-arrow-right'
                  iconAlign='right'
                  text='Next'
                  onClick={() => handleTabChange('#exclusions')}
                />
              </Submit>
            </Form>
          </div>
        )}

        {currentTab === '#exclusions' && (
          <div className='tab-pane'>
            <FormError errors={inputErrors} />

            <ExceptionList
              selected={input.exceptionIds}
              onChange={handleExceptionChange}
            />
            <Submit className='space-between'>
              <Button
                className='circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#request')}
              />
              <Button
                className='circle icon-right'
                icon='fal fa-paper-plane'
                iconAlign='right'
                text='Send Request'
                onClick={handleSend}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#questions' && (
          <div className='tab-pane'>
            <QuestionnairePreviewExcel
              table={excelFile.excel}
            />
          </div>
        )}
      </div>
    </div>
  )
}

QuestionnaireRequestForm.propTypes = {
  questionnaireFileId: PropTypes.string.isRequired,
  selectedTab: PropTypes.string,
  onSave: PropTypes.func
}

QuestionnaireRequestForm.defaultProps = {
  onSave: () => {}
}

export default QuestionnaireRequestForm
