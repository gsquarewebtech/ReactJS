import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Avatar, Button, Badge, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import authGql from '@graphql/queries/auth'
import accountUsersGql from '@graphql/queries/account-users'
import destroyAccountUser from '@graphql/mutators/destroy-account-user'

const AccountUserList = ({ accountId, fields, links, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedUserCount, setShowedUserCount] = useState(5)

  // get logged in user info
  const authQuery = useQuery(authGql)
  const loggedInuser = authQuery.data.auth

  if (!accountId) {
    return null
  }

  // set search
  const variables = { accountId }

  if (filters.search) {
    variables.search = filters.search
  }

  if (filters.clientId) {
    variables.clientId = filters.clientId
  }

  // accountUsers query

  const accountUsersQuery = useQuery(accountUsersGql, { variables })

  if (accountUsersQuery.loading || accountUsersQuery.error) {
    return null
  }

  const handleDelete = (accountUser) => {
    swal({
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      buttons: {
        delete: {
          text: 'Yes',
          value: 'delete'
        },
        cancel: 'Cancel'
      }
    }).then((value) => {
      if (value === 'delete') {
        destroyAccountUser(accountUser.id).then(({ data, extensions }) => {
          if (data.destroyAccountUser) {
            onDelete()
            swal({
              text: 'User deleted!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })
          } else if (extensions && extensions.errors) {
            swal({
              text: extensions?.errors[0].message,
              icon: 'error',
              buttons: false,
              timer: 2500
            })
            console.log('Logger::extesions.errorsTest', extensions.errors)
          }
        })
      }
    })
  }

  const handleNoDelete = () => {
    swal({
      text: 'You cannot delete your own account',
      icon: 'error',
      buttons: false,
      timer: 2500
    })
  }

  const { accountUsers } = accountUsersQuery.data

  if (!accountUsers) {
    return null
  }

  // pagination
  const usersLength = accountUsers.length
  const pages = Math.ceil(usersLength / showedUserCount)

  const currentUsers = []
  const startUserIndex = (currentPage - 1) * showedUserCount
  let endUserIndex = startUserIndex + (showedUserCount - 1)
  if (endUserIndex > (usersLength - 1)) {
    endUserIndex = usersLength - 1
  }

  for (let i = startUserIndex; i <= endUserIndex; i++) {
    const user = accountUsers[i]
    currentUsers.push(
      user
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedUserCount(size)
  }
  // end

  return (
    <Fragment>
      <ListView>
        {currentUsers.map(accountUser => (
          <Item
            key={accountUser.id}
            className='border-bottom background-white'
          >
            {fields.avatar && (
              <Field
                className='item-avatar'
                noLabel
              >
                <Avatar
                  className='circle'
                  url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${accountUser.user.fullName}`}
                />
              </Field>
            )}

            {fields.email && (
              <Field label='Email'>
                <Link to={`${links.view}/${accountUser.id}`}>
                  {accountUser.user.email}
                </Link>
              </Field>
            )}

            {fields.title && (
              <Field
                label='Title'
                value={accountUser.title}
              />
            )}

            {fields.name && (
              <Field
                label='Name'
                value={accountUser.user.fullName}
              />
            )}

            {fields.phone && (
              <Field
                label='Phone'
                value={accountUser.phone}
              />
            )}

            {fields.isMain && (
              <Field
                label='Primary'
                className='flex-none center width-120'
                noLabel
              >
                {accountUser.isMain && (
                  <Badge
                    text='Primary'
                    className='circle green'
                  />
                )}

              </Field>
            )}

            {fields.actions && (
              <Field
                className='item-action'
                noLabel
              >
                {fields.actions.edit && (
                  <Link
                    className='button blue'
                    to={`${links.edit}/${accountUser.id}`}
                    icon='fal fa-pencil-alt'
                  />
                )}

                {fields.actions.delete && (
                  <Button
                    className={`${loggedInuser.id === accountUser.user.id ? 'disabled' : 'red'}`}
                    onClick={() => `${loggedInuser.id === accountUser.user.id ? handleNoDelete() : handleDelete(accountUser)}`}
                    icon='fal fa-trash'
                  />
                )}
              </Field>
            )}
          </Item>
        ))}

        <Pagination
          className='centered'
          pages={pages}
          limit={10}
          currentPage={currentPage}
          onPageClick={handlePageClick}
          sizes={[5, 10, 25, 50, 100]}
          selectedSize={showedUserCount}
          onSizeChange={handlePaginationSizeChange}
        />
      </ListView>
    </Fragment>

  )
}

AccountUserList.propTypes = {
  accountId: PropTypes.string,
  fields: PropTypes.object,
  links: PropTypes.object,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

AccountUserList.defaultProps = {
  fields: {
    avatar: true,
    title: false,
    name: true,
    email: true,
    phone: false,
    isMain: true,
    actions: {
      edit: true,
      delete: true
    }
  },
  links: {
    view: '',
    edit: ''
  },
  onDelete: () => {},
  filters: {}
}

export default AccountUserList
