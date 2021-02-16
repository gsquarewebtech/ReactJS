import React, { Fragment } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title, swal } from '@lib'
import { Link } from '@shared'
import { Action, Buttons } from '@shared/Action'
import VendorForm from '@shared/VendorForm'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId } = useParams()
  const { hash } = useLocation()
  const history = useHistory()

  const crumbs = [...breadcrumbs.index,
    {
      text: 'Client Info',
      link: `/admin/client/${clientId}#users`
    },
    {
      text: 'New Vendor',
      link: `/admin/client/${clientId}/vendor/new`
    }
  ]

  const handleSave = () => {
    swal({
      text: 'Client Vendor added!',
      icon: 'success',
      buttons: false,
      timer: 1500
    })

    history.push(`/admin/client/${clientId}#vendors`)
  }

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />

      <Title text='New Vendor' />

      <Action>
        <Buttons className='flex'>
          <Link
            className='button small circle red icon-left'
            to={`/admin/client/${clientId}#vendors`}
            icon='fal fa-arrow-left'
            text='Back'
          />
        </Buttons>
      </Action>

      <VendorForm
        clientId={clientId}
        selectedTab={hash}
        onSave={handleSave}
      />
    </Fragment>
  )
}

const NewVendor = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default NewVendor
