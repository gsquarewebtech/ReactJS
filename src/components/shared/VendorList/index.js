import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button, Avatar, swal } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import vendorsGql from '@graphql/queries/vendors'
import clientVendorsGql from '@graphql/queries/client-vendors'
import destroyVendor from '@graphql/mutators/destroy-vendor'

const getGql = (mode) => {
  if (mode === 'admin') {
    return vendorsGql
  } else if (mode === 'client') {
    return clientVendorsGql
  }
}

const VendorList = ({ mode, links, fields, itemClass, onDelete, filters }) => {
  let vendors = []

  // set search
  const variables = {}

  if (filters.search) {
    variables.search = filters.search
  }

  const vendorsQuery = useQuery(getGql(mode), { variables })

  if (vendorsQuery.loading) {
    return null
  }

  if (mode === 'admin') {
    vendors = vendorsQuery.data.vendors
  } else if (mode === 'client') {
    vendors = vendorsQuery.data.clientVendors
  }

  const handleDelete = (vendor) => {
    swal({
      text: 'Are you sure you want to delete this vendor?',
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
        destroyVendor(vendor.id).then(({ data, extensions, error }) => {
          if (data.destroyVendor) {
            swal({
              text: 'Vendor deleted!',
              icon: 'success',
              buttons: false,
              timer: 1500
            })

            onDelete(vendor)
          } else if (extensions?.errors) {
            swal({
              text: extensions?.errors[0].message,
              icon: 'error',
              buttons: false,
              timer: 2500
            })
          }
        })
      }
    })
  }

  return (
    <ListView>
      {vendors.map(vendor => (
        <Item
          key={vendor.id}
          className={classNames(itemClass)}
        >
          {fields.avatar && (
            <Field
              className='item-avatar'
              noLabel
            >
              <Avatar
                className='circle'
                url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${vendor.name}`}
              />
            </Field>
          )}

          {fields.name && (
            <Field label='Name'>
              <Link to={`${links.view}/${vendor.id}`}>
                {vendor.name}
              </Link>
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
                  to={`${links.edit}/${vendor.id}`}
                  icon='fal fa-pencil-alt'
                />
              )}

              {fields.actions.delete && (
                <Button
                  className='red'
                  onClick={() => handleDelete(vendor)}
                  icon='fal fa-trash'
                />
              )}
            </Field>
          )}
        </Item>
      ))}
    </ListView>
  )
}

VendorList.propTypes = {
  mode: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object,
  itemClass: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

VendorList.defaultProps = {
  mode: 'admin',
  links: {
    view: '',
    edit: ''
  },
  fields: {
    avatar: true,
    name: true,
    actions: {
      edit: false,
      delete: false
    }
  },
  onDelete: () => {},
  filters: {}
}

export default VendorList
