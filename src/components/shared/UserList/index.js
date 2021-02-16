import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button, Avatar, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import authGql from '@graphql/queries/auth'
import usersGql from '@graphql/queries/users'
import destroyUser from '@graphql/mutators/destroy-user'

const UserList = ({ links, fields, itemClass, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedUserCount, setShowedUserCount] = useState(5)

  // get logged in user info
  const authQuery = useQuery(authGql)
  const loggedInuser = authQuery.data.auth

  // set search
  const variables = {}

  if (filters.search) {
    variables.search = filters.search
  }

  // users query
  const usersQuery = useQuery(usersGql, { variables })

  if (usersQuery.loading || usersQuery.error) {
    return null
  }

  const { users } = usersQuery.data

  // pagination
  const usersLength = users.length
  const pages = Math.ceil(usersLength / showedUserCount)

  const currentUsers = []
  const startUserIndex = (currentPage - 1) * showedUserCount
  let endUserIndex = startUserIndex + (showedUserCount - 1)
  if (endUserIndex > (usersLength - 1)) {
    endUserIndex = usersLength - 1
  }

  for (let i = startUserIndex; i <= endUserIndex; i++) {
    const user = users[i]
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

  const handleDelete = (user) => {
    if (loggedInuser.id === user.id) {
      swal({
        text: 'You cannot delete your own account',
        icon: 'error',
        buttons: false,
        timer: 2500
      })
    } else {
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
          destroyUser(user.id).then(() => {
            onDelete(user)
            swal({
              text: 'User deleted!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })
          })
        }
      })
    }
  }

  return (
    <ListView>
      {currentUsers.map(user => (
        <Item
          key={user.id}
          className={classNames(itemClass)}
        >
          {fields.avatar && (
            <Field
              className='item-avatar'
              noLabel
            >
              <Avatar
                className='circle'
                url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${user.fullName}`}
              />
            </Field>
          )}

          {fields.username && (
            <Field label='Username'>
              <Link to={`${links.view}/${user.id}`}>
                {user.username}
              </Link>
            </Field>
          )}

          {fields.name && (
            <Field label='Name'>
              {user.fullName}
            </Field>
          )}

          {fields.userType && (
            <Field label='Role'>
              {user.userType?.name}
            </Field>
          )}

          {fields.action && (
            <Field
              className='item-action'
              noLabel
            >
              <Link
                className='button blue'
                to={`${links.edit}/${user.id}`}
                icon='fal fa-pencil-alt'
              />

              <Button
                className={`${loggedInuser.id === user.id ? 'disabled' : 'red'}`}
                onClick={() => handleDelete(user)}
                icon='fal fa-trash'
              />
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
  )
}

UserList.propTypes = {
  links: PropTypes.object,
  fields: PropTypes.object,
  itemClass: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

UserList.defaultProps = {
  links: {
    view: '',
    edit: ''
  },
  fields: {
    avatar: true,
    username: true,
    name: true,
    userType: true,
    action: true
  },
  onDelete: () => {},
  filters: {}
}

export default UserList
