import React, { Fragment, useState } from 'react'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import { Action, Search, Buttons } from '@shared/Action'
import ClientList from '@shared/ClientList'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const [state, setState] = useState({})

  const handleSearchChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      search: value
    }))
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={breadcrumbs.index} />
      <Title text='Client Management' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to='/admin/lists'
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <Action className='background-white padded'>
        <Search
          placeholder='Search Client ...'
          value={state.search || ''}
          onChange={(value) => handleSearchChange(value)}
        />
        <Buttons className='right'>
          <Link
            className='button circle icon-left'
            icon='fal fa-plus'
            text='New Client'
            to='/admin/client/new'
          />
        </Buttons>
      </Action>

      <ClientList
        filters={{
          search: state.search
        }}
        itemClass='background-white'
        links={{
          view: '/admin/client',
          edit: '/admin/client/edit'
        }}
      />
    </Fragment>
  )
}

const Clients = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default Clients
