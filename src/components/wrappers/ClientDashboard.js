import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { Page } from '@lib'
import { Sidebar, Board, Loader } from '@shared'

import authGql from '@graphql/queries/auth'

const menus = [
  // {
  //   url: '/client',
  //   text: 'Dashboard',
  //   icon: 'fal fa-home'
  // },
  {
    url: '/client/rfp-logic',
    text: 'RFPLogic',
    icon: 'fal fa-list-alt'
  },
  {
    url: '/client/data-logic',
    text: 'DataLogic',
    icon: 'fal fa-folders'
  },
  {
    url: '/client/price-logic',
    text: 'PriceLogic',
    icon: 'fal fa-chart-line'
  },
  // {
  //   url: '/client/quote-logic',
  //   text: 'QuoteLogic',
  //   icon: 'fal fa-chart-bar'
  // },
  {
    url: '/client/users',
    text: 'Users',
    icon: 'fal fa-user-tie'
  },
  {
    url: '/client/customers',
    text: 'Customers',
    icon: 'fal fa-users-class'
  },
  {
    url: '/client/vendors',
    text: 'Vendors',
    icon: 'fal fa-building'
  },
  {
    url: '/client/template-settings',
    text: 'Template Settings',
    icon: 'fal fa-cogs'
  },
  {
    url: '/client/change-password',
    text: 'Change Password',
    icon: 'fal fa-key'
  }
]

const ClientDashboard = ({ children }) => {
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

    if (userType.name !== 'client') {
      return (
        <Redirect to='/login' />
      )
    }
  }

  return (
    <Page
      name='client'
      className='client-dashboard'
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

ClientDashboard.propTypes = {
  children: PropTypes.node
}

export default ClientDashboard
