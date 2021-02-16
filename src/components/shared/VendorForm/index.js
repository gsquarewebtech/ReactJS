import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '@lib'
import { Link } from '@shared'
import { Group, Input, FormError, Submit } from '@shared/Form'
import { array, object, validateEmail } from '@utils'

import client from '@graphql/client'
import vendorGql from '@graphql/queries/vendor'
import userAutoCompleteGql from '@graphql/queries/user-auto-complete'
import createClientVendor from '@graphql/mutators/create-client-vendor'

const getSelectedTab = (id, selectedTab) => {
  if (!id && selectedTab) {
    return selectedTab
  }

  return '#form'
}

const getType = (id, selectedTab) => {
  if (!id && selectedTab === '#invite-code') {
    return 'code'
  }

  return 'form'
}

const VendorForm = ({ id, clientId, tabs, selectedTab, onSave }) => {
  const [loading, setLoading] = useState(true)

  const [state, setState] = useState({
    tab: getSelectedTab(id, selectedTab),
    input: {
      type: getType(id, selectedTab),
      code: '',
      name: '',
      phone: '',
      vendorPhone: '',
      address: '',
      description: '',
      email: '',
      title: '',
      firstName: '',
      lastName: ''
    },
    codeFormInput: {},
    userAutoComplete: false,
    errors: {}
  })

  const loadVendor = () => {
    if (id && loading) {
      client.query({
        query: vendorGql,
        variables: {
          id
        }
      }).then(({ data }) => {
        if (data.vendor) {
          setState(prevState => ({
            ...prevState,
            input: {
              ...prevState.input,
              id: data.vendor.id,
              code: data.vendor?.vendorDetail?.code,
              name: data.vendor.name,
              phone: data.vendor?.vendorDetail?.phone,
              address: data.vendor?.vendorDetail?.address,
              description: data.vendor?.vendorDetail?.description
            }
          }))
          setLoading(false)
        }
      })
    }
  }

  useEffect(() => {
    loadVendor()
  }, [loading])

  if (id && loading) {
    return null
  }

  const autoCompleteUserInfo = (email) => {
    client.query({
      query: userAutoCompleteGql,
      variables: {
        search: email
      }
    }).then(userAutoCompleteQuery => {
      if (userAutoCompleteQuery.data.userAutoComplete) {
        setState(prevState => ({
          ...prevState,
          input: {
            ...prevState.input,
            phone: userAutoCompleteQuery.data?.userAutoComplete?.accountUser?.phone,
            title: userAutoCompleteQuery.data?.userAutoComplete?.accountUser?.title,
            firstName: userAutoCompleteQuery.data?.userAutoComplete?.firstName,
            lastName: userAutoCompleteQuery.data?.userAutoComplete?.lastName
          },
          userAutoComplete: !!userAutoCompleteQuery.data?.userAutoComplete?.email
        }))
      } else {
        setState(prevState => ({
          ...prevState,
          input: {
            ...prevState.input,
            phone: '',
            title: '',
            firstName: '',
            lastName: ''
          },
          userAutoComplete: false
        }))
      }
    })
  }

  const handleInputChange = (name, value, autoComplete) => {
    if (name === 'email' && autoComplete) {
      autoCompleteUserInfo(value)
    }

    setState(prevState => ({
      ...prevState,
      input: {
        ...prevState.input,
        [name]: value
      }
    }))
  }

  const handleSave = () => {
    const feErrors = {}
    const { tab } = state

    // start: validation for create

    if (tab === '#form') {
      if (!input.name) {
        feErrors.name = [{
          message: 'vendor name is required'
        }]
      }
    } else if (tab === '#invite-code') {
      if (!input.code) {
        feErrors.code = [{
          message: 'invite code is required'
        }]
      }
    }

    if (!id) {
      if (!input.email) {
        feErrors.email = [{
          message: 'email is required'
        }]
      }

      if (!input.title) {
        feErrors.title = [{
          message: 'title is required'
        }]
      }

      if (!input.firstName) {
        feErrors.firstName = [{
          message: 'first name is required'
        }]
      }

      if (!input.lastName) {
        feErrors.lastName = [{
          message: 'last name is required'
        }]
      }

      if (input.email) {
        const checkEmail = validateEmail(input.email)

        if (!checkEmail.ok) {
          if (!checkEmail.message) {
            feErrors.email = [{ message: 'Invalid email supplied' }]
          } else {
            feErrors.email = [{ message: checkEmail.message }]
          }
        }
      }
    }

    // end: validation for create

    if (!object.keys(feErrors).length) {
      if (!id) {
        const type = getType(id, selectedTab)
        const createData = {
          type,
          clientId,
          email: input.email,
          title: input.title,
          phone: input.phone,
          firstName: input.firstName,
          lastName: input.lastName
        }

        if (type === 'form') {
          createData.name = input.name
          createData.address = input.address
          createData.vendorPhone = input.vendorPhone
          createData.description = input.description
        } else {
          createData.code = input.code
        }

        createClientVendor(createData, 'client', clientId).then(({ data, extensions }) => {
          if (data.createClientVendor) {
            setState(prevState => ({
              ...prevState,
              errors: {}
            }))
            onSave()
          } else if (extensions && extensions.errors) {
            setState(prevState => ({
              ...prevState,
              errors: array.groupBy(extensions.errors, 'path')
            }))
          }
        })
      }
    } else {
      setState(prevState => ({
        ...prevState,
        errors: feErrors
      }))
    }
  }

  const { tab, input, errors, userAutoComplete } = state

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        {tabs.includes('form') && (
          <li className={classNames({ active: tab === '#form' })}>
            <Link
              text='Vendor Form'
              to='#form'
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  tab: '#form',
                  input: {
                    ...prevState.input,
                    email: '',
                    phone: '',
                    title: '',
                    firstName: '',
                    lastName: ''
                  },
                  codeFormInput: {
                    ...prevState.input
                  }
                }))
              }}
            />
          </li>
        )}

        {!id && tabs.includes('invite-code') && (
          <li className={classNames({ active: tab === '#invite-code' })}>
            <Link
              text='Invite Code'
              to='#invite-code'
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  tab: '#invite-code',
                  input: {
                    ...prevState.input,
                    email: prevState.codeFormInput.email,
                    phone: prevState.codeFormInput.phone,
                    title: prevState.codeFormInput.title,
                    firstName: prevState.codeFormInput.firstName,
                    lastName: prevState.codeFormInput.lastName
                  }
                }))
              }}
            />
          </li>
        )}
      </ul>

      <div className='tab-panes padded'>
        {tab === '#form' && (
          <div className='tab-pane'>
            <FormError errors={errors} />

            {id && (
              <Group>
                <Input
                  label='Vendor Code'
                  type='text'
                  value={input.code}
                  disabled={true}
                />
              </Group>
            )}

            <Group>
              <Input
                label='Vendor Name'
                type='text'
                value={input.name}
                onChange={(value) => handleInputChange('name', value)}
                errors={errors.name}
              />
            </Group>

            <Group>
              <Input
                state={false}
                label='Phone'
                type='text'
                value={input.vendorPhone}
                onChange={(value) => handleInputChange('vendorPhone', value)}
                errors={errors.vendorPhone}
              />
            </Group>

            <Group>
              <Input
                label='Address'
                type='textarea'
                value={input.address}
                onChange={(value) => handleInputChange('address', value)}
                errors={errors.address}
              />
            </Group>

            <Group>
              <Input
                label='Description'
                type='textarea'
                value={input.description}
                onChange={(value) => handleInputChange('description', value)}
                errors={errors.description}
              />
            </Group>

            {!id && (
              <Fragment>
                <h3 className='user-details-title'>User Details</h3>

                <Group>
                  <Input
                    state={false}
                    label='Email'
                    type='text'
                    value={input.email}
                    onChange={(value) => handleInputChange('email', value, false)}
                    errors={errors.email}
                  />

                  <Input
                    state={false}
                    label='Phone'
                    type='text'
                    value={input.phone}
                    disabled={userAutoComplete}
                    onChange={(value) => handleInputChange('phone', value)}
                    errors={errors.phone}
                  />
                </Group>

                <Group>
                  <Input
                    state={false}
                    label='Title'
                    type='text'
                    value={input.title}
                    disabled={userAutoComplete}
                    onChange={(value) => handleInputChange('title', value)}
                    errors={errors.title}
                  />
                </Group>

                <Group>
                  <Input
                    state={false}
                    label='First Name'
                    type='text'
                    value={input.firstName}
                    disabled={userAutoComplete}
                    onChange={(value) => handleInputChange('firstName', value)}
                    errors={errors.firstName}
                  />

                  <Input
                    state={false}
                    label='Last Name'
                    type='text'
                    value={input.lastName}
                    disabled={userAutoComplete}
                    onChange={(value) => handleInputChange('lastName', value)}
                    errors={errors.lastName}
                  />
                </Group>
              </Fragment>
            )}

            <Submit className='right'>
              <Button
                className='circle icon-left'
                icon={`${id ? '' : 'fal fa-plus'}`}
                text={`${id ? 'Update' : 'Add'} Vendor`}
                onClick={handleSave}
              />
            </Submit>
          </div>
        )}

        {tab === '#invite-code' && !id && (
          <div className='tab-pane'>
            <FormError errors={errors} />

            <Group>
              <Input
                label='Vendor Code'
                type='text'
                value={input.code}
                onChange={(value) => handleInputChange('code', value)}
                errors={errors.code}
              />
            </Group>

            <h3 className='user-details-title'>User Details</h3>

            <Group>

            </Group>

            <Group>
              <Input
                state={false}
                label='Email'
                type='text'
                value={input.email}
                onChange={(value) => handleInputChange('email', value, true)}
                errors={errors.email}
              />

              <Input
                state={false}
                label='Phone'
                type='text'
                value={input.phone}
                disabled={userAutoComplete}
                onChange={(value) => handleInputChange('phone', value)}
                errors={errors.phone}
              />
            </Group>

            <Group>
              <Input
                state={false}
                label='Title'
                type='text'
                value={input.title}
                disabled={userAutoComplete}
                onChange={(value) => handleInputChange('title', value)}
                errors={errors.title}
              />
            </Group>

            <Group>
              <Input
                state={false}
                label='First Name'
                type='text'
                value={input.firstName}
                disabled={userAutoComplete}
                onChange={(value) => handleInputChange('firstName', value)}
                errors={errors.firstName}
              />

              <Input
                state={false}
                label='Last Name'
                type='text'
                value={input.lastName}
                disabled={userAutoComplete}
                onChange={(value) => handleInputChange('lastName', value)}
                errors={errors.lastName}
              />
            </Group>

            <Submit className='right'>
              <Button
                className='icon-left circle'
                icon='fal fa-paper-plane'
                text='Send Invite'
                onClick={handleSave}
              />
            </Submit>
          </div>
        )}
      </div>
    </div>
  )
}

VendorForm.propTypes = {
  id: PropTypes.string,
  clientId: PropTypes.string,
  tabs: PropTypes.array,
  selectedTab: PropTypes.string,
  onSave: PropTypes.func
}

VendorForm.defaultProps = {
  id: null,
  clientId: null,
  selectedTab: '#form',
  tabs: ['form', 'invite-code'],
  onSave: () => {}
}

export default VendorForm
