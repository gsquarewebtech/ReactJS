import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import classNames from 'classnames'

import { Avatar, Badge, Button, swal } from '@lib'
import { Link } from '@shared'
import { Group, Input, Submit, FormError } from '@shared/Form'
import { Action, Search, Buttons } from '@shared/Action'
import { ListView, Item, Field } from '@shared/ListView'
import { array, isPresent } from '@utils'

import vendorGql from '@graphql/queries/vendor'
import updateVendor from '@graphql/mutators/update-vendor'
import destroyAccountUser from '@graphql/mutators/destroy-account-user'

const VendorView = ({ vendorId, clientId, selectedTab, links, fields }) => {
  const [currentTab, setTab] = useState(selectedTab || '#details')
  const [state, setState] = useState({
    mode: 'view',
    input: {},
    errors: {}
  })

  const vendorQuery = useQuery(vendorGql, {
    variables: {
      id: vendorId,
      clientId
    },
    fetchPolicy: 'network-only'
  })

  if (vendorQuery.loading) {
    return null
  }

  console.log('Logger::vendorQueryData', vendorQuery.data)

  const { vendor } = vendorQuery.data
  const { accountUsers } = vendor

  const disableDetails = state.mode === 'view'
  const input = state.input
  const errors = state.errors

  const handleSearchChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      search: value
    }))
  }

  const handleInputChange = (name, value) => {
    setState(prevState => ({
      ...prevState,
      input: {
        ...prevState.input,
        [name]: value
      }
    }))
  }

  const handleInputDetailChange = (name, value) => {
    setState(prevState => ({
      ...prevState,
      input: {
        ...prevState.input,
        vendorDetail: {
          ...prevState.input.vendorDetail,
          [name]: value
        }
      }
    }))
  }

  const handleEditClick = () => {
    if (state.mode === 'edit') {
      updateVendor({
        id: vendor.id,
        ...input
      }).then(({ data, extensions }) => {
        if (data.updateVendor) {
          setState(prevState => ({
            ...prevState,
            mode: 'view',
            errors: {}
          }))

          swal({
            text: 'Vendor updated!',
            icon: 'success',
            buttons: false,
            timer: 1500
          })
        } else if (isPresent(extensions?.errors)) {
          setState(prevState => ({
            ...prevState,
            errors: array.groupBy(extensions.errors, 'path')
          }))
        }
      })
    } else {
      setState(prevState => ({
        ...prevState,
        mode: state.mode === 'view' ? 'edit' : 'view'
      }))
    }
  }

  const handleDeleteUser = (accountUser) => {
    if (accountUser.isMain) {
      swal({
        text: 'You cannot delete primary account',
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
          destroyAccountUser(accountUser.id, 'vendor', clientId).then(({ data, extensions }) => {
            if (data.destroyAccountUser) {
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
                timer: 3500
              })
              console.log('Logger::extesions.errorsDeleteVendorUser', extensions.errors)
            }
          })
        }
      })
    }
  }

  return (
    <div className='tab-view'>
      <ul className='tab-navs'>
        <li className={classNames({ active: currentTab === '#details' })}>
          <Link
            text='Details'
            to='#details'
            onClick={() => setTab('#details')}
          />
        </li>
        <li className={classNames({ active: currentTab === '#users' })}>
          <Link
            text='Users'
            to='#users'
            onClick={() => setTab('#users')}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#details' && (
          <div className='tab-pane'>
            <FormError errors={state.errors} />

            <Group>
              {fields?.details?.code?.show && (
                <Input
                  label='Vendor Code'
                  type='text'
                  value={vendor?.vendorDetail?.code}
                  disabled={true}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.name?.show && (
                <Input
                  label='Name'
                  type='text'
                  value={vendor.name}
                  disabled={disableDetails}
                  onChange={value => handleInputChange('name', value)}
                  errors={errors.name}
                />
              )}

              {fields?.details?.phone?.show && (
                <Input
                  label='Phone'
                  type='text'
                  value={vendor?.vendorDetail?.phone}
                  onChange={value => handleInputDetailChange('phone', value)}
                  disabled={disableDetails}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.address?.show && (
                <Input
                  label='Address'
                  type='textarea'
                  value={vendor?.vendorDetail?.address}
                  onChange={value => handleInputDetailChange('address', value)}
                  disabled={disableDetails}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.description?.show && (
                <Input
                  label='Description'
                  type='textarea'
                  value={vendor?.vendorDetail?.description}
                  onChange={value => handleInputDetailChange('description', value)}
                  disabled={disableDetails}
                />
              )}
            </Group>

            {fields?.details?.actions?.edit && (
              <Submit className='right'>
                <Button
                  className='circle icon-left'
                  text={state.mode === 'view' ? 'Edit' : 'Update'}
                  onClick={handleEditClick}
                />
              </Submit>
            )}
          </div>
        )}

        {currentTab === '#users' && (
          <div className='tab-pane'>
            <Action>
              {fields.users.search && (
                <Search
                  placeholder='Search User ...'
                  value={state.search || ''}
                  onChange={(value) => handleSearchChange(value)}
                />
              )}

              {fields.users.new && (
                <Buttons className='right'>
                  <Link
                    className='button circle icon-left'
                    to={links.newUser}
                    icon='fal fa-user-plus'
                    text='New User'
                  />
                </Buttons>
              )}
            </Action>

            <ListView>
              {accountUsers.map(accountUser => (
                <Item key={accountUser.id}>
                  {fields.users.avatar && (
                    <Field
                      className='item-avatar'
                      noLabel
                    >
                      <Avatar
                        className='circle'
                        url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${accountUser.user.firstName} ${accountUser.user.lastName}`}
                      />
                    </Field>
                  )}

                  {fields.users.email && (
                    <Field label='Email'>
                      {accountUser.user.email}
                    </Field>
                  )}

                  {fields.users.title && (
                    <Field label='Title'>
                      {accountUser.title}
                    </Field>
                  )}

                  {fields.users.name && (
                    <Field
                      label='Name'
                      value={`${accountUser.user.firstName} ${accountUser.user.lastName}`}
                    />
                  )}

                  {fields.users.isMain && (
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

                  {fields.users.actions && (
                    <Field
                      className='item-action'
                      noLabel
                    >
                      {fields.users.actions.edit && (
                        <Link
                          className='button blue'
                          to={`${links.users.edit}/${accountUser.id}`}
                          icon='fal fa-pencil-alt'
                        />
                      )}

                      {fields.users.actions.delete && (
                        <Button
                          className='red'
                          onClick={() => handleDeleteUser(accountUser)}
                          icon='fal fa-trash'
                        />
                      )}
                    </Field>
                  )}
                </Item>
              ))}
            </ListView>
          </div>
        )}
      </div>
    </div>
  )
}

VendorView.propTypes = {
  showEdit: PropTypes.bool,
  vendorId: PropTypes.string,
  clientId: PropTypes.string,
  selectedTab: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object
}

VendorView.defaultProps = {
  links: {
    edit: '',
    newUser: ''
  },
  fields: {
    edit: true,
    details: {
      code: {
        show: false,
        enable: false
      },
      name: {
        show: false,
        enable: false
      },
      phone: {
        show: false,
        enable: false
      },
      address: {
        show: false,
        enable: false
      },
      description: {
        show: false,
        enable: false
      },
      actions: {
        edit: false
      }
    },
    users: {
      avatar: true,
      email: true,
      name: true,
      isMain: true,
      actions: {
        edit: true,
        delete: true
      }
    }
  }
}

export default VendorView
