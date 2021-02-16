import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Avatar, Button, Badge, swal } from '@lib'
import { Link } from '@shared'
import { Group, Info, Submit } from '@shared/Form'
import { Action, Search, Buttons } from '@shared/Action'
import { ListView, Item, Field } from '@shared/ListView'
import { time } from '@utils'

import clientGql from '@graphql/queries/client'
import destroyAccountUser from '@graphql/mutators/destroy-account-user'
import destroyClientCustomer from '@graphql/mutators/destroy-client-customer'
import destroyClientVendor from '@graphql/mutators/destroy-client-vendor'

const ClientView = ({ clientId, selectedTab, links, fields }) => {
  const [currentTab, setTab] = useState(selectedTab || '#details')
  const [state, setState] = useState({})

  const handleSearchChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      search: value
    }))
  }

  if (!clientId) {
    return null
  }

  const clientQuery = useQuery(clientGql, {
    variables: {
      id: clientId
    }
  })

  if (clientQuery.loading || clientQuery.error) {
    return null
  }

  const handleDeleteAccountUser = (accountUser) => {
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
        destroyAccountUser(accountUser.id, 'client')
      }
    })
  }

  const handleDeleteClientCustomer = (clientCustomer) => {
    swal({
      text: 'Are you sure you want to delete this customer?',
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
        destroyClientCustomer(clientCustomer.id, 'admin').then(({ data, extensions }) => {
          if (data.destroyClientCustomer) {
            swal({
              text: 'Client customer deleted!',
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

  const handleDeleteClientVendor = (clientVendor) => {
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
        destroyClientVendor(clientVendor.id)
      }
    })
  }

  const { client } = clientQuery.data
  const { clientDetail } = client
  const { accountUsers } = client
  const { clientCustomers } = client
  const { clientVendors } = client

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
        <li className={classNames({ active: currentTab === '#customers' })}>
          <Link
            text='Customers'
            to='#customers'
            onClick={() => setTab('#customers')}
          />
        </li>
        <li className={classNames({ active: currentTab === '#vendors' })}>
          <Link
            text='Vendors'
            to='#vendors'
            onClick={() => setTab('#vendors')}
          />
        </li>
      </ul>

      <div className='tab-panes padded'>
        {currentTab === '#details' && (
          <div className='tab-pane'>
            <Group>
              {fields?.details?.name?.show && (
                <Info
                  label='Client Name'
                  value={client.name}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.startDate?.show && (
                <Info
                  label='Start Date'
                  value={time.utc(clientDetail.startDate).local().format('MMM. DD, YYYY')}
                />
              )}

              {fields?.details?.currentPbm?.show && (
                <Info
                  label='Current PBM'
                  value={clientDetail.currentPbm}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.clientType?.show && (
                <Info
                  label='Client Type'
                  value={clientDetail.clientType?.name}
                />
              )}

              {fields?.details?.industry?.show && (
                <Info
                  label='Industry'
                  value={clientDetail.industry?.name}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.totalEmployees?.show && (
                <Info
                  label='Total Employees'
                  value={clientDetail.totalEmployees}
                />
              )}

              {fields?.details?.totalMembers?.show && (
                <Info
                  label='Total Members'
                  value={clientDetail.totalMembers}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.totalAnnualRebates?.show && (
                <Info
                  label='Total Annual Rebates'
                  value={clientDetail.totalAnnualRebates}
                />
              )}

              {fields?.details?.monthsOfData?.show && (
                <Info
                  label='Months of Data'
                  value={clientDetail.monthsOfData}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.formulary?.show && (
                <Info
                  label='Formulary'
                  value={clientDetail.formulary?.name}
                />
              )}
            </Group>

            <Group>
              {fields?.details?.otherInfo?.show && (
                <Info
                  label='Other Information'
                  value={clientDetail.otherInfo}
                />
              )}
            </Group>

            <Submit className='right'>
              <Link
                to={`${links.edit}/${client.id}`}
                className='button circle icon-left'
                icon='fal fa-pencil-alt'
                text='Edit'
              />
            </Submit>
          </div>
        )}

        {currentTab === '#users' && (
          <div className='tab-pane'>
            <Action>
              <Search
                placeholder='Search User ...'
                value={state.search || ''}
                onChange={(value) => handleSearchChange(value)}
              />

              <Buttons className='right'>
                <Link
                  className='button circle icon-left'
                  to={links.newUser}
                  icon='fal fa-user-plus'
                  text='New User'
                />
              </Buttons>
            </Action>

            <ListView>
              {accountUsers.map(accountUser => (
                <Item
                  key={accountUser.id}
                  className='border-bottom'
                >

                  {fields?.users?.avatar?.show && (
                    <Field className='item-avatar'>
                      <Avatar
                        className='circle'
                        url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${accountUser?.user?.firstName} ${accountUser?.user?.lastName}`}
                      />
                    </Field>
                  )}

                  {fields?.users?.email?.show && (
                    <Field
                      label='Email'
                      value={accountUser?.user?.email}
                    />
                  )}

                  {fields?.users?.name?.show && (
                    <Field
                      label='Name'
                      value={`${accountUser?.user?.firstName} ${accountUser?.user?.lastName}`}
                    />
                  )}

                  {fields?.users?.isMain?.show && (
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

                  {fields?.users?.actions && (
                    <Field
                      className='item-action'
                      noLabel
                    >
                      {fields?.users?.actions?.edit && (
                        <Link
                          className='button blue'
                          to={`${links.editUser}/${accountUser.id}`}
                          icon='fal fa-pencil-alt'
                        />
                      )}

                      {fields?.users?.actions?.delete && (
                        <Button
                          className='red'
                          onClick={() => handleDeleteAccountUser(accountUser)}
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

        {currentTab === '#customers' && (
          <div className='tab-pane'>
            <Action>
              <Search
                placeholder='Search Customer ...'
              />
              <Buttons className='right'>
                <Link
                  className='button circle icon-left'
                  to={links.newCustomer}
                  icon='fal fa-user-plus'
                  text='New Customer'
                />
              </Buttons>
            </Action>

            <ListView>
              {clientCustomers.map(clientCustomer => (
                <Item
                  key={clientCustomer.id}
                  className='border-bottom'
                >
                  {fields?.clientCustomers?.avatar.show && (
                    <Field className='item-avatar'>
                      <Avatar
                        className='circle'
                        url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${clientCustomer?.name}`}
                      />
                    </Field>
                  )}

                  {fields?.clientCustomers?.name.show && (
                    <Field label='Name'>
                      <Link to={`/admin/client/${clientId}/customer/${clientCustomer?.id}`}>
                        {clientCustomer?.name}
                      </Link>
                    </Field>
                  )}

                  {fields?.clientCustomers?.actions && (
                    <Field
                      className='item-action'
                      noLabel
                    >
                      {fields?.clientCustomers?.actions?.edit && (
                        <Link
                          className='button blue'
                          to={`/admin/client/${clientId}/customer/edit/${clientCustomer?.id}`}
                          icon='fal fa-pencil-alt'
                        />
                      )}

                      {fields?.clientCustomers?.actions?.delete && (
                        <Button
                          className='red'
                          onClick={() => handleDeleteClientCustomer(clientCustomer)}
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

        {currentTab === '#vendors' && (
          <div className='tab-pane'>
            <Action>
              <Search
                placeholder='Search Vendor ...'
              />
              <Buttons className='right'>
                <Link
                  className='button circle icon-left'
                  to={links.newVendor}
                  icon='fal fa-user-plus'
                  text='New Vendor'
                />
              </Buttons>
            </Action>

            <ListView>
              {clientVendors.map(clientVendor => (
                <Item
                  key={clientVendor.id}
                  className='border-bottom'
                >
                  {fields?.vendors?.avatar.show && (
                    <Field className='item-avatar'>
                      <Avatar
                        className='circle'
                        url={`https://ui-avatars.com/api/?background=288ca7&color=fff&name=${client.name}`}
                      />
                    </Field>
                  )}

                  {fields?.vendors?.name.show && (
                    <Field label='Name'>
                      <Link to={`/admin/client/${clientId}/vendor/${clientVendor?.vendor?.id}`}>
                        {clientVendor?.vendor?.name}
                      </Link>
                    </Field>
                  )}

                  {fields?.vendors?.actions && (
                    <Field
                      className='item-action'
                      noLabel
                    >
                      {fields?.vendors?.actions?.edit && (
                        <Link
                          className='button blue'
                          to={`/admin/client/${clientId}/vendor/${clientVendor?.vendor?.id}`}
                          icon='fal fa-pencil-alt'
                        />
                      )}

                      {fields?.vendors?.actions?.delete && (
                        <Button
                          className='red'
                          onClick={() => handleDeleteClientVendor(clientVendor)}
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

ClientView.propTypes = {
  clientId: PropTypes.string,
  selectedTab: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object
}

ClientView.defaultProps = {
  links: {
    edit: '',
    newUser: ''
  },
  fields: {
    details: {
      name: {
        show: false
      },
      startDate: {
        show: false
      },
      currentPbm: {
        show: false
      },
      clientType: {
        show: false
      },
      industry: {
        show: false
      },
      totalEmployees: {
        show: false
      },
      totalMembers: {
        show: false
      },
      totalAnnualRebates: {
        show: false
      },
      monthsOfData: {
        show: false
      },
      formulary: {
        show: false
      },
      otherInfo: {
        show: false
      }
    },
    users: {
      avatar: {
        show: false
      },
      email: {
        show: false
      },
      name: {
        show: false
      },
      isMain: {
        show: false
      },
      actions: {
        edit: false,
        delete: false
      }
    },
    clientCustomers: {
      avatar: {
        show: false
      },
      name: {
        show: false
      },
      actions: {
        edit: false,
        delete: false
      }
    },
    vendors: {
      avatar: {
        show: false
      },
      name: {
        show: false
      },
      actions: {
        edit: false,
        delete: false
      }
    }
  }
}

export default ClientView
