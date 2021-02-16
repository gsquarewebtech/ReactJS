import React from 'react'
import faker from 'faker'
import { Table, Row, Column, Avatar, Link, Icon } from '@lib'

const dummyData = []
for (let i = 0; i < 10; i++) {
  dummyData.push({
    username: faker.internet.userName(),
    name: faker.company.companyName(),
    primaryContact: faker.name.findName(),
    email: faker.internet.email().toLowerCase()
  })
}

const TableData = () => {
  return (
    <Table>
      {dummyData.map(data => (
        <Row key={data.username}>
          <Column className='avatar-column flex-none'>
            <Avatar
              className='circle'
              url={`https://api.adorable.io/avatars/90/${data.username}.png`}
            />
          </Column>
          <Column
            className='bold'
            label='Vendor Name'
          >
            <Link to='/admin/vendors/1'>
              {data.name}
            </Link>
          </Column>
          <Column
            label='Primary Contact'
            value={data.primaryContact}
          />
          <Column
            label='Email'
            value={data.email}
          />
          <Column className='action'>
            <Link
              className='blue'
              to='/admin/vendors/edit/1'
            >
              <Icon className='fal fa-pencil-alt' />
            </Link>
            <Link
              className='red'
              to='/admin/vendors/delete/1'
            >
              <Icon className='fal fa-trash' />
            </Link>
          </Column>
        </Row>
      ))}
    </Table>
  )
}

export default TableData
