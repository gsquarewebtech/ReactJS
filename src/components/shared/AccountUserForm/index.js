import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Card, Button } from '@lib'
import { Form, Group, Input, Submit, FormError } from '@shared/Form'
import { array, object, validateEmail } from '@utils'

import client from '@graphql/client'
import accountUserGql from '@graphql/queries/account-user'
import createAccountUser from '@graphql/mutators/create-account-user'
import updateAccountUser from '@graphql/mutators/update-account-user'

const AccountUserForm = ({ mode, accountType, accountId, clientId, userId, fields, onSave }) => {
  const [input, setInput] = useState({
    accountType,
    clientId,
    accountId,
    phone: '',
    title: '',
    isMain: false,
    notes: '',
    user: {
      email: '',
      firstName: '',
      lastName: ''
    }
  })

  const [loading, setLoading] = useState(true)
  const [inputErrors, setInputErrors] = useState({})

  useEffect(() => {
    if (userId && loading) {
      const variables = { id: userId }

      if (clientId) {
        variables.clientId = clientId
      }

      client.query({
        query: accountUserGql,
        variables
      }).then(({ data }) => {
        if (data.accountUser) {
          setInput({
            id: data.accountUser.id,
            title: data.accountUser.title,
            phone: data.accountUser.phone,
            notes: data.accountUser.notes,
            isMain: data.accountUser.isMain,
            user: {
              email: data.accountUser?.user?.email,
              firstName: data.accountUser?.user?.firstName,
              lastName: data.accountUser?.user?.lastName
            }
          })
          setLoading(false)
        }
      })
    }
  }, [loading])

  if (userId && loading) {
    return null
  }

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleUserInputChange = (name, value) => {
    const newInput = { ...input }
    newInput.user[name] = value
    setInput(newInput)
  }

  const handleSave = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}

    if (!input.user?.email) {
      feErrors.email = [{ message: 'email is required' }]
    }

    if (input.user?.email) {
      const checkEmail = validateEmail(input.user?.email)
      if (!checkEmail.ok) {
        if (!checkEmail.message) {
          feErrors.email = [{ message: 'Invalid email supplied' }]
        } else {
          feErrors.email = [{ message: checkEmail.message }]
        }
      }
    }

    if (!input.phone) {
      feErrors.phone = [{ message: 'phone is required' }]
    }

    if (!input.title) {
      feErrors.title = [{ message: 'title is required' }]
    }

    if (!input.user?.firstName) {
      feErrors.firstName = [{ message: 'first name is required' }]
    }

    if (!input.user?.lastName) {
      feErrors.lastName = [{ message: 'last name is required' }]
    }

    if (!object.keys(feErrors).length) {
      if (userId) {
        updateAccountUser(
          {
            ...input,
            clientId
          },
          accountType,
          clientId
        ).then(({ data, extensions }) => {
          if (data.updateAccountUser) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createAccountUser(
          {
            ...input,
            clientId
          },
          accountType,
          clientId
        ).then(({ data, extensions }) => {
          if (data.createAccountUser) {
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

  return (
    <Card>
      <Form onSubmit={handleSave}>
        <FormError errors={inputErrors} />

        <Group>
          {fields?.email?.show && (
            <Input
              label='Email'
              type='text'
              value={input?.user?.email}
              disabled={!fields?.email?.enable}
              onChange={(value) => handleUserInputChange('email', value)}
              errors={inputErrors.email}
            />
          )}

          {fields?.phone?.show && (
            <Input
              label='Phone'
              type='text'
              value={input?.phone}
              disabled={!fields?.phone?.enable}
              onChange={(value) => handleInputChange('phone', value)}
              errors={inputErrors.phone}
            />
          )}
        </Group>

        <Group>
          {fields?.title?.show && (
            <Input
              label='Title'
              type='text'
              value={input?.title}
              disabled={!fields?.title?.enable}
              onChange={(value) => handleInputChange('title', value)}
              errors={inputErrors.title}
            />
          )}
        </Group>

        <Group>
          {fields?.firstName?.show && (
            <Input
              label='First Name'
              type='text'
              value={input?.user?.firstName}
              disabled={!fields?.firstName?.enable}
              onChange={(value) => handleUserInputChange('firstName', value)}
              errors={inputErrors.firstName}
            />
          )}

          {fields?.lastName?.show && (
            <Input
              label='Last Name'
              type='text'
              value={input?.user?.lastName}
              disabled={!fields?.lastName?.enable}
              onChange={(value) => handleUserInputChange('lastName', value)}
              errors={inputErrors.lastName}
            />
          )}
        </Group>

        <Group>
          {fields?.notes?.show && (
            <Input
              label='Notes'
              type='textarea'
              value={input?.notes}
              disabled={!fields?.notes?.enable}
              onChange={(value) => handleInputChange('notes', value)}
              errors={inputErrors.notes}
            />
          )}
        </Group>

        <Group>
          {fields?.isMain?.show && (
            <Input
              label='Primary Contact'
              type='toggle'
              value={input.isMain}
              disabled={!fields?.isMain?.enable}
              onChange={(value) => handleInputChange('isMain', value)}
              errors={inputErrors.isMain}
            />
          )}
        </Group>

        <Submit className='right'>
          {fields?.saveButton && (
            <Button
              type='submit'
              className='circle icon-left'
              icon={`${userId ? '' : 'fal fa-user-plus'}`}
              text={`${userId ? 'Update' : 'Add'} User`}
            />
          )}
        </Submit>
      </Form>
    </Card>
  )
}

AccountUserForm.propTypes = {
  mode: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
  clientId: PropTypes.string,
  userId: PropTypes.string,
  fields: PropTypes.object,
  onSave: PropTypes.func
}

AccountUserForm.defaultProps = {
  mode: 'admin',
  clientId: null,
  fields: {
    email: {
      show: false,
      enable: false
    },
    phone: {
      show: false,
      enable: false
    },
    title: {
      show: false,
      enable: false
    },
    firstName: {
      show: false,
      enable: false
    },
    lastName: {
      show: false,
      enable: false
    },
    notes: {
      show: false,
      enable: false
    },
    isMain: {
      show: false,
      enable: false
    },
    saveButton: false
  },
  onSave: () => {}
}

export default AccountUserForm
