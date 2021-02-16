import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Page, Button, Link } from '@lib'
import { Loader } from '@shared'
import { Group, Input, Submit, FormError } from '@shared/Form'
import { array, object } from '@utils'

import createSession from '@graphql/mutators/create-session'
import authGql from '@graphql/queries/auth'
// import createSessionMutation from '@graphql/mutations/create-session'

import logoImage from '@images/logo-white-icon-text.png'

const getRedirectUrl = (role) => {
  let redirectUrl = `/${role}/rfp-logic`
  if (role === 'root') {
    redirectUrl = '/admin/rfp-logic'
  }

  return redirectUrl
}

const Login = () => {
  const [inputErrors, setInputErrors] = useState({})
  const [input, setInput] = useState({
    username: '',
    password: ''
  })

  const authQuery = useQuery(authGql)

  if (authQuery.loading) {
    return (
      <Loader />
    )
  }

  const user = authQuery.data.auth

  if (user && user.userType) {
    if (user.isRequiredToChangePassword) {
      return (
        <Redirect to='/change-password' />
      )
    } else {
      return (
        <Redirect to={getRedirectUrl(user.userType.name)}/>
      )
    }
  }

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleLogin = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}

    if (!input.username) {
      feErrors.username = [{
        message: 'email is required'
      }]
    }

    if (!input.password) {
      feErrors.password = [{
        message: 'password required'
      }]
    }

    if (!object.keys(feErrors).length) {
      createSession(input).then(({ data, errors, extensions }) => {
        if (extensions && extensions.errors) {
          setInputErrors(array.groupBy(extensions.errors, 'path'))
        }
      })
    } else {
      setInputErrors(feErrors)
    }
  }

  return (
    <Page
      name='login'
      className='login'
    >
      <div className='content'>
        <div className="header">
          <h1>
            Login
          </h1>
        </div>

        <div className='middle'>
          <div className='message'>
            <p>
              Welcome back.<br />
              We missed you!
            </p>
          </div>

          <div className='form'>
            <form
              onSubmit={handleLogin}
              noValidate
            >
              <FormError errors={inputErrors} />

              <Group>
                <Input
                  type='text'
                  icon='fal fa-envelope'
                  placeholder='Username'
                  value={input.username}
                  onChange={(value) => handleInputChange('username', value)}
                  errors={inputErrors.username}
                />
              </Group>

              <Group>
                <Input
                  type='password'
                  icon='fal fa-lock'
                  placeholder='Password'
                  value={input.password}
                  onChange={(value) => handleInputChange('password', value)}
                  errors={inputErrors.password}
                />
              </Group>

              <Submit className='right'>
                <Button
                  type='submit'
                  className='circle'
                  text='Log In'
                />
              </Submit>
            </form>
            <p className='form-bottom'>
              Forgot your password? <Link to='/forgot-password'>Click here.</Link>
            </p>
          </div>
        </div>

        <div className='footer'>
          <div className='login-logo'>
            <div className='logo'>
              <img src={logoImage} />
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Login
