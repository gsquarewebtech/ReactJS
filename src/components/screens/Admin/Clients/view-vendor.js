import React, { Fragment } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import Dashboard from '@wrappers/AdminDashboard'
import { Breadcrumb, Title } from '@lib'
import { Link } from '@shared'
import VendorView from '@shared/VendorView'
import { Action, Buttons } from '@shared/Action'
import breadcrumbs from './breadcrumbs'

const Content = () => {
  const { clientId, vendorId } = useParams()
  const { hash } = useLocation()

  const crumbs = [...breadcrumbs.index,
    {
      text: 'Client Info',
      link: `/admin/client/${clientId}#vendors`
    },
    {
      text: 'Client Vendor View',
      link: `/admin/client/${clientId}/vendor/${vendorId}`
    }
  ]

  return (
    <Fragment>
      <Breadcrumb crumbs={crumbs} />
      <Title text='Client Vendor View' />

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

      <VendorView
        vendorId={vendorId}
        clientId={clientId}
        selectedTab={hash}
        links={{
          edit: `/admin/client/${clientId}/vendor/${vendorId}/edit`,
          newUser: `/admin/client/${clientId}/vendor/${vendorId}/user/new`,
          users: {
            edit: `/admin/client/${clientId}/vendor/${vendorId}/user/edit`
          }
        }}
        fields={{
          edit: true,
          details: {
            code: {
              show: true
            },
            name: {
              show: true
            },
            phone: {
              show: true
            },
            address: {
              show: true
            },
            description: {
              show: true
            },
            actions: {
              edit: true
            }
          },
          users: {
            search: true,
            new: true,
            avatar: true,
            email: true,
            name: true,
            isMain: true,
            actions: {
              edit: true,
              delete: true
            }
          }
        }}
      />
    </Fragment>
  )
}

const ViewVendor = () => {
  return (
    <Dashboard>
      <Content />
    </Dashboard>
  )
}

export default ViewVendor
