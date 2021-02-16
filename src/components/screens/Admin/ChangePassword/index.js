import React, { Fragment, useState } from 'react'
import { useHistory } from 'react-router-dom'

import AdminDashboard from '@wrappers/AdminDashboard'
import { Card, Breadcrumb, Title, Button, swal } from '@lib'
import { Form, Group, Input, FormError, Submit } from '@shared/Form'
import { array, object } from '@utils'
import breadcrumbs from './breadcrumbs'

import updatePasswordChange from '@graphql/mutators/update-password-change'

const Content = () => {
  const history = useHistory()
  const crumbs = [...breadcrumbs.index]

  const [inputErrors, setInputErrors] = useState({})
  const [input, setInput] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (name, value) => {
    const state = { ...input }
    state[name] = value
    setInput(state)
  }

  const handleSubmit = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}

    if (!input.oldPassword) {
      feErrors.oldPassword = [{ message: 'Current password required' }]
    }
    if (!input.password) {
      feErrors.password = [{ message: 'Password required' }]
    }

    if (!input.confirmPassword) {
      feErrors.confirmPassword = [{ message: 'Confirm your password' }]
    }

    if (input.password && input.password !== input.confirmPassword) {
      feErrors.confirmPassword = [{ message: 'Passwords do not match' }]
    }

    if (input.password) {
      const passwordValidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if (!passwordValidation.test(input.password)) {
        feErrors.securedPassword = [{ message: 'Your password needs to be made up of at least 8 characters with combined lowercase and uppercase letters and at least one number and special character' }]
      }
    }

    if (!object.keys(feErrors).length) {
      console.log('LOGGER::handleSubmit::updatePasswordChange')
      updatePasswordChange(input).then(({ data, errors, extensions }) => {
        if (extensions && extensions.errors) {
          setInputErrors(array.groupBy(extensions.errors, 'path'))
        } else if (data.updatePasswordChange) {
          history.push('/admin/rfp-logic')

          swal({
            text: 'Password changed!',
            icon: 'success',
            buttons: false,
            timer: 3000
          })
        }
      })
    } else {
      setInputErrors(feErrors)
    }
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />
      <Title text='Change Password' />
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormError errors={inputErrors} />

          <Group className="half">
            <Input
              state={false}
              label='Current Password'
              type='password'
              onChange={(value) => handleInputChange('oldPassword', value)}
              errors={inputErrors.oldPassword}
            />
          </Group>

          <Group className="half">
            <Input
              state={false}
              label='New Password'
              type='password'
              onChange={ (value) => handleInputChange('password', value) }
              errors={inputErrors.password}
            />
          </Group>

          <Group className="half">
            <Input
              state= {false}
              label='Confirm Password'
              type='password'
              onChange={(value) => handleInputChange('confirmPassword', value)}
              errors={inputErrors.confirmPassword}
            />
          </Group>

          <Submit className='right'>
            <Button
              type='submit'
              className='circle icon-left'
              text='Submit'
            />
          </Submit>
        </Form>
      </Card>
    </Fragment>
  )
}

const ChangePassword = () => {
  return (
    <AdminDashboard>
      <Content />
    </AdminDashboard>
  )
}

export default ChangePassword
