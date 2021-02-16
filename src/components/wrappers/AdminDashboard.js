import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Page } from '@lib'
import { Sidebar, Board, Loader } from '@shared'

import authGql from '@graphql/queries/auth'

const menus = [
  // {
  //   url: '/admin',
  //   text: 'Dashboard',
  //   icon: 'fal fa-home'
  // },
  {
    url: '/admin/rfp-logic',
    text: 'RFPLogic',
    icon: 'fal fa-list-alt'
  },
  {
    url: '/admin/data-logic',
    text: 'DataLogic',
    icon: 'fal fa-folders'
  },
  {
    url: '/admin/price-logic',
    text: 'PriceLogic',
    icon: 'fal fa-chart-line'
  },
  // {
  //   url: '/admin/quote-logic',
  //   text: 'QuoteLogic',
  //   icon: 'fal fa-chart-bar'
  // },
  {
    url: '/admin/lists',
    text: 'Lists',
    icon: 'fal fa-cogs'
  },
  {
    url: '/admin/change-password',
    text: 'Change Password',
    icon: 'fal fa-key'
  }
]

const AdminDashboard = ({ children }) => {
  const authQuery = useQuery(authGql)

  if (authQuery.loading) {
    return (
      <Loader />
    )
  }

  const user = authQuery.data.auth

  if (!user) {
    return (
      <Redirect to='/login' />
    )
  }

  if (user) {
    const { userType } = user

    if (!['root', 'admin'].includes(userType.name)) {
      return (
        <Redirect to='/login' />
      )
    }
  }

  return (
    <Page
      name='admin'
      className='admin-dashboard'
    >
      <Sidebar
        user={user}
        menus={menus}
      />
      <Board>
        {children}
      </Board>
    </Page>
  )
}

AdminDashboard.propTypes = {
  children: PropTypes.node
}

export default AdminDashboard
