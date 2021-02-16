import React from 'react'
import faker from 'faker'
import { Table, Row, Column, Avatar, Link, Icon } from '@lib'

const dummyData = []
for (let i = 0; i < 10; i++) {
  dummyData.push({
    username: faker.internet.userName().toLowerCase(),
    name: faker.company.companyName(),
    mainPerson: faker.name.findName(),
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
            label='Username'
          >
            <Link to='/admin/client/1'>
              {data.username}
            </Link>
          </Column>
          <Column
            label='Name'
            value={data.mainPerson}
          />
          <Column
            label='Email'
            value={data.email}
          />
          <Column
            label='Type'
            value='Client'
          />
          <Column className='action'>
            <Link
              className='blue'
              to='/admin/clients/edit/1'
            >
              <Icon className='fal fa-pencil-alt' />
            </Link>
            <Link
              className='red'
              to='/admin/clients/delete/1'
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
