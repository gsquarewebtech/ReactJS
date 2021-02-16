import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Card, Button } from '@lib'
import { Form, Group, Input, Submit, FormError } from '@shared/Form'
import { array, object } from '@utils'

import client from '@graphql/client'
import userGql from '@graphql/queries/user'
import createUser from '@graphql/mutators/create-user'
import updateUser from '@graphql/mutators/update-user'

const UserForm = ({ userTypeId, id, onSave }) => {
  const [input, setInput] = useState({
    username: '',
    userTypeId,
    email: '',
    firstName: '',
    lastName: ''
  })

  const [loading, setLoading] = useState(true)
  const [inputErrors, setInputErrors] = useState({})

  useEffect(() => {
    if (id && loading) {
      client.query({
        query: userGql,
        variables: {
          id: id
        }
      }).then(({ data }) => {
        if (data.user) {
          setInput({
            username: data.user.username,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName
          })
          setLoading(false)
        }
      })
    }
  }, [loading])

  if (id && loading) {
    return null
  }

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleSave = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}

    if (!input.username) {
      feErrors.username = [{ message: 'username is required' }]
    }

    if (!input.email) {
      feErrors.email = [{ message: 'email is required' }]
    } else {
      var userEmail = input.email

      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (re.test(String(userEmail).toLowerCase())) {
        var blacklist = ['yahoo.com', 'gmail.com', 'mail.com', 'hotmail.com']
        var domain = userEmail.substring(userEmail.lastIndexOf('@') + 1)
        if (blacklist.includes(domain)) {
          feErrors.email = [{ message: 'Email addresses from Gmail, Hotmail, Mail and Yahoo domains are not allowed.' }]
        }
      } else {
        feErrors.email = [{ message: 'Invalid email supplied' }]
      }
    }

    if (!input.firstName) {
      feErrors.firstName = [{ message: 'first name is required' }]
    }

    if (!input.lastName) {
      feErrors.lastName = [{ message: 'last name is required' }]
    }

    if (!object.keys(feErrors).length) {
      console.log('Logger::UserForm::save')
    } else {

    }

    if (!object.keys(feErrors).length) {
      if (id) {
        delete input.username
        delete input.email
        input.id = id
        updateUser(input).then(({ data, extensions }) => {
          if (data.updateUser) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createUser(input).then(({ data, extensions }) => {
          if (data.createUser) {
            console.log('Logger::createUser')
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
          <Input
            label='Username'
            type='text'
            value={input.username}
            disabled={!!id}
            onChange={(value) => handleInputChange('username', value)}
            errors={inputErrors.username}
          />

          <Input
            label='Email'
            type='text'
            value={input.email}
            disabled={!!id}
            onChange={(value) => handleInputChange('email', value)}
            errors={inputErrors.email}
          />
        </Group>

        <Group>
          <Input
            label='First Name'
            type='text'
            value={input.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            errors={inputErrors.firstName}
          />

          <Input
            label='Last Name'
            type='text'
            value={input.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            errors={inputErrors.lastName}
          />
        </Group>

        <Submit className='right'>
          <Button
            type='submit'
            className='circle icon-left'
            icon={`${id ? '' : 'fal fa-user-plus'}`}
            text={`${id ? 'Update' : 'Add'} User`}
          />
        </Submit>
      </Form>
    </Card>
  )
}

UserForm.propTypes = {
  userTypeId: PropTypes.string,
  id: PropTypes.string,
  onSave: PropTypes.func
}

UserForm.defaultProps = {
  userTypeId: '2',
  onSave: () => {}
}

export default UserForm
