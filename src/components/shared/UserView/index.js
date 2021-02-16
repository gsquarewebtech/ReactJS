import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card } from '@lib'
import { Link } from '@shared'
import { Group, Info, Submit } from '@shared/Form'

import userGql from '@graphql/queries/user'

const UserView = ({ id, links }) => {
  if (!id) {
    return null
  }

  const userQuery = useQuery(userGql, {
    variables: {
      id: id
    }
  })

  if (userQuery.loading || userQuery.error) {
    return null
  }

  const { user } = userQuery.data

  return (
    <Card>
      <Group>
        <Info
          label='Username'
          type='text'
          value={user.username}
        />

        <Info
          label='Email'
          type='text'
          value={user.email}
        />
      </Group>

      <Group>
        <Info
          label='First Name'
          type='text'
          value={user.firstName}
        />

        <Info
          label='Last Name'
          type='text'
          value={user.lastName}
        />
      </Group>

      <Submit className='right'>
        <Link
          to={`${links.edit}`}
          className='button circle icon-left'
          icon='fal fa-pencil-alt'
          text='Edit'
        />
      </Submit>
    </Card>
  )
}

UserView.propTypes = {
  id: PropTypes.string,
  links: PropTypes.object
}

UserView.defaultProps = {
  links: {
    edit: '',
    newUser: ''
  }
}

export default UserView
