import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button } from '@lib'
import { Link } from '@shared'
import { Group, Input, FormError, Submit } from '@shared/Form'
import { array, object, time } from '@utils'

import client from '@graphql/client'
import clientGql from '@graphql/queries/client'
import clientTypesGql from '@graphql/queries/client-types'
import clientIndustriesGql from '@graphql/queries/client-industries'
import clientFormulariesGql from '@graphql/queries/client-formularies'
import createClient from '@graphql/mutators/create-client'
import updateClient from '@graphql/mutators/update-client'

const ClientForm = ({ id, selectedTab, onSave }) => {
  const clientStruct = {
    name: '',
    clientDetail: {
      startDate: null,
      clientTypeId: null,
      totalEmployees: null,
      totalMembers: null,
      totalAnnualRebates: null,
      currentPbm: '',
      industryId: null,
      monthsOfData: null,
      formularyId: null,
      otherInfo: ''
    }
  }

  const [loading, setLoading] = useState(true)
  const [currentTab, setTab] = useState(selectedTab || '#basic')
  const [input, setInput] = useState(clientStruct)
  const [inputErrors, setInputErrors] = useState({})

  const history = useHistory()

  const handleTabChange = (tab) => {
    history.push(`${tab}`)
    setTab(tab)
  }

  const clientTypesQuery = useQuery(clientTypesGql)
  const clientIndustriesQuery = useQuery(clientIndustriesGql)
  const clientFormulariesQuery = useQuery(clientFormulariesGql)

  useEffect(() => {
    if (id && loading) {
      client.query({
        query: clientGql,
        variables: {
          id
        }
      }).then(({ data }) => {
        if (data.client && data.client.clientDetail) {
          let startDate = null
          if (data.client?.clientDetail?.startDate) {
            startDate = time.utc(data.client?.clientDetail?.startDate).local().toDate()
          }

          setInput({
            id: data.client.id,
            name: data.client.name,
            clientDetail: {
              startDate,
              clientTypeId: data.client?.clientDetail?.clientTypeId,
              totalEmployees: data.client?.clientDetail?.totalEmployees,
              totalMembers: data.client?.clientDetail?.totalMembers,
              totalAnnualRebates: data.client?.clientDetail?.totalAnnualRebates,
              currentPbm: data.client?.clientDetail?.currentPbm,
              industryId: data.client?.clientDetail?.industryId,
              monthsOfData: data.client?.clientDetail?.monthsOfData,
              formularyId: data.client?.clientDetail?.formularyId,
              otherInfo: data.client?.clientDetail?.otherInfo
            }
          })
          setLoading(false)
        }
      })
    }
  }, [loading])

  if (clientTypesQuery.loading || clientIndustriesQuery.loading || clientFormulariesQuery.loading) {
    return null
  }

  if (id && loading) {
    return null
  }

  const { clientTypes } = clientTypesQuery.data
  const { clientIndustries } = clientIndustriesQuery.data
  const { clientFormularies } = clientFormulariesQuery.data

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleClientDetailChange = (name, value) => {
    const newInput = { ...input }
    newInput.clientDetail[name] = value
    setInput(newInput)
  }

  const handleSave = () => {
    const feErrors = {}

    if (!input.name) {
      feErrors.name = [{
        message: 'Client Name is required'
      }]
    }

    if (!input.clientDetail.startDate) {
      feErrors.startDate = [{
        message: 'Start Date is required'
      }]
    }

    if (!input.clientDetail.currentPbm) {
      feErrors.currentPbm = [{
        message: 'Current PBM is required'
      }]
    }

    if (!input.clientDetail.clientTypeId) {
      feErrors.clientTypeId = [{
        message: 'Client Type is required'
      }]
    }

    if (!input.clientDetail.industryId) {
      feErrors.industryId = [{
        message: 'Industry is required'
      }]
    }

    if (!input.clientDetail.totalEmployees) {
      feErrors.totalEmployees = [{
        message: 'Total Employees is required'
      }]
    }

    if (!input.clientDetail.totalMembers) {
      feErrors.totalMembers = [{
        message: 'total members is required'
      }]
    }

    if (!input.clientDetail.totalAnnualRebates) {
      feErrors.totalAnnualRebates = [{
        message: 'Total Annual Rebates is required'
      }]
    }

    if (!input.clientDetail.monthsOfData) {
      feErrors.monthsOfData = [{
        message: 'Months of Data is required'
      }]
    }

    if (!object.keys(feErrors).length) {
      input.clientDetail.startDate = time.utc(input.clientDetail.startDate).format()

      if (id) {
        updateClient(input).then(({ data, extensions }) => {
          if (data.updateClient) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createClient(input).then(({ data, extensions }) => {
          if (data.createClient) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      }
    } else {
      setInputErrors(feErrors)
    }
  }

  // set tab errors
  let clientBasicErrors = []
  let keyMetricErrors = []
  let lastTabErrors = []

  // client basics error
  if (inputErrors.name) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.name)
  }

  if (inputErrors.startDate) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.startDate)
  }

  if (inputErrors.currentPbm) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.currentPbm)
  }

  if (inputErrors.clientTypeId) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.clientTypeId)
  }

  if (inputErrors.industryId) {
    clientBasicErrors = clientBasicErrors.concat(inputErrors.industryId)
  }

  // key metric errors
  if (inputErrors.totalEmployees) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalEmployees)
  }

  if (inputErrors.totalMembers) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalMembers)
  }

  if (inputErrors.totalAnnualRebates) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.totalAnnualRebates)
  }

  if (inputErrors.monthsOfData) {
    keyMetricErrors = keyMetricErrors.concat(inputErrors.monthsOfData)
  }

  // last tab errors
  if (clientBasicErrors.length || keyMetricErrors.length) {
    lastTabErrors = [{ message: 'Fill all the required fields' }]
  }

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#basic' })}>
          <Link
            text='Client Basics'
            to='#basic'
            onClick={() => { setTab('#basic') }}
          />
        </li>
        <li className={classNames({ active: currentTab === '#key-metric' })}>
          <Link
            text='Key Metrics'
            to='#key-metric'
            onClick={() => { setTab('#key-metric') }}
          />

        </li>
        <li className={classNames({ active: currentTab === '#other-info' })}>
          <Link
            text='Other Info'
            to='#other-info'
            onClick={() => { setTab('#other-info') }}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#basic' && (
          <div className='tab-pane'>
            <FormError errors={clientBasicErrors} />

            <Group>
              <Input
                label='Client Name'
                type='text'
                value={input.name}
                onChange={(value) => handleInputChange('name', value)}
                errors={inputErrors.name}
              />
            </Group>

            <Group>
              <Input
                label='Start Date'
                type='datepicker'
                value={input.clientDetail.startDate}
                settings={{ dateFormat: 'M. d, Y' }}
                onChange={(value) => handleClientDetailChange('startDate', value)}
                errors={inputErrors.startDate}
              />

              <Input
                label='Current PBM'
                type='text'
                value={input.clientDetail.currentPbm}
                onChange={(value) => handleClientDetailChange('currentPbm', value)}
                errors={inputErrors.currentPbm}
              />
            </Group>

            <Group>
              <Input
                label='Client Type'
                type='select'
                placeholder='Select Client Type'
                options={clientTypes.map(option => ({ value: option.id, text: option.name }))}
                value={input.clientDetail.clientTypeId}
                onChange={(value) => handleClientDetailChange('clientTypeId', value)}
                errors={inputErrors.clientTypeId}
              />

              <Input
                label='Industry'
                type='select'
                placeholder='Select Industry'
                options={clientIndustries.map(option => ({ value: option.id, text: option.name }))}
                value={input.clientDetail.industryId}
                onChange={(value) => handleClientDetailChange('industryId', value)}
                errors={inputErrors.industryId}
              />
            </Group>

            <Submit className='right'>
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#key-metric')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#key-metric' && (
          <div className='tab-pane'>
            <FormError errors={keyMetricErrors} />

            <Group>
              <Input
                label='Total Employees'
                type='number'
                value={input.clientDetail.totalEmployees}
                onChange={(value) => handleClientDetailChange('totalEmployees', parseInt(value))}
                errors={inputErrors.totalEmployees}
              />

              <Input
                label='Total Members'
                type='number'
                value={input.clientDetail.totalMembers}
                onChange={(value) => handleClientDetailChange('totalMembers', parseInt(value))}
                errors={inputErrors.totalMembers}
              />
            </Group>

            <Group>
              <Input
                label='Total Annual Rebates'
                type='number'
                value={input.clientDetail.totalAnnualRebates}
                onChange={(value) => handleClientDetailChange('totalAnnualRebates', parseFloat(value))}
                errors={inputErrors.totalAnnualRebates}
              />

              <Input
                label='Months of Data'
                type='number'
                value={input.clientDetail.monthsOfData}
                onChange={(value) => handleClientDetailChange('monthsOfData', parseInt(value))}
                errors={inputErrors.monthsOfData}
              />
            </Group>

            <Submit className='space-between'>
              <Button
                className='circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#basic')}
              />
              <Button
                className='circle icon-right'
                icon='fal fa-arrow-right'
                iconAlign='right'
                text='Next'
                onClick={() => handleTabChange('#other-info')}
              />
            </Submit>
          </div>
        )}

        {currentTab === '#other-info' && (
          <div className='tab-pane'>
            <FormError errors={lastTabErrors} />

            <Group>
              <Input
                label='Formulary'
                type='select'
                placeholder='Select Formulary'
                options={clientFormularies.map(option => ({ value: option.id, text: option.name }))}
                value={input.clientDetail.formularyId || ''}

                onChange={(value) => handleClientDetailChange('formularyId', value)}
                errors={inputErrors.formularyId}
              />
            </Group>

            <Group>
              <Input
                label='Other Information'
                type='textarea'
                value={input.clientDetail.otherInfo}
                onChange={(value) => handleClientDetailChange('otherInfo', value)}
                errors={inputErrors.otherInfo}
              />
            </Group>

            <Submit className='space-between'>
              <Button
                className='left circle icon-left'
                icon='fal fa-arrow-left'
                text='Back'
                onClick={() => handleTabChange('#key-metric')}
              />
              <Button
                className='right circle'
                text={`${id ? 'Update' : 'Create'} Client`}
                onClick={handleSave}
              />
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

ClientForm.propTypes = {
  id: PropTypes.string,
  selectedTab: PropTypes.string,
  onSave: PropTypes.func
}

ClientForm.defaultProps = {
  id: '',
  onSave: () => {}
}

export default ClientForm
