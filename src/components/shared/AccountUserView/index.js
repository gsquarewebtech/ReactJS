import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card } from '@lib'
import { Link } from '@shared'
import { Group, Info, Input, Submit } from '@shared/Form'
// import AccountUserList from '@shared/AccountUserList'

import accountUserGql from '@graphql/queries/account-user'

const AccountUserView = ({ accountType, accountId, userId, links, fields }) => {
  if (!userId) {
    return null
  }

  const accountUserQuery = useQuery(accountUserGql, {
    variables: {
      id: userId
    }
  })

  if (accountUserQuery.loading || accountUserQuery.error) {
    return null
  }

  const { accountUser } = accountUserQuery.data

  return (
    <Card>
      <Group>
        <Info
          label='Email'
          type='text'
          value={accountUser.user?.email}
        />

        <Info
          label='Phone'
          type='text'
          value={accountUser.phone}
        />
      </Group>

      <Group>
        <Info
          label='Title'
          type='text'
          value={accountUser.title}
        />
      </Group>

      <Group>
        <Info
          label='First Name'
          type='text'
          value={accountUser.user?.firstName}
        />

        <Info
          label='Last Name'
          type='text'
          value={accountUser.user?.lastName}
        />
      </Group>

      <Group>
        <Info
          label='Notes'
          type='textarea'
          value={accountUser?.notes}
        />
      </Group>

      {fields.isMain && (
        <Group>
          <Input
            label='Primary Contact'
            type='toggle'
            disabled={true}
            value={accountUser.isMain}
          />
        </Group>
      )}

      <Submit className='right'>
        <Link
          to={`${links.edit}/${accountUser.id}`}
          className='button circle icon-left'
          icon='fal fa-pencil-alt'
          text='Edit'
        />
      </Submit>
    </Card>
  )
}

AccountUserView.propTypes = {
  accountType: PropTypes.string,
  accountId: PropTypes.string,
  userId: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object
}

AccountUserView.defaultProps = {
  links: {
    edit: '',
    newUser: ''
  },
  fields: {
    isMain: true
  }
}

export default AccountUserView
