import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button, Link, Input } from '@lib'

const TableAction = ({ search, actions }) => {
  const Searchbar = () => (
    <div className='search'>
      <Input
        type='text'
        className='no-border'
        placeholder={search.placeholder}
        icon='fal fa-search'
        onChange={(e) => {}}
      />
    </div>
  )

  const Buttons = () => (
    <div className='buttons'>
      {actions.map((action, index) => {
        if (action.type === 'link') {
          return (
            <Link
              key={index}
              className='button'
              to={action.link}
            >
              {action.text}
            </Link>
          )
        } else if (action.type === 'button') {
          return (
            <Button
              key={index}
              className={classNames(action.class)}
              onClick={action.action}
            >
              {action.text}
            </Button>
          )
        }
      })}
    </div>
  )

  return (
    <div className='table-action'>
      {search.show && (<Searchbar />)}
      {actions.length && (<Buttons />)}
    </div>
  )
}

TableAction.propTypes = {
  search: PropTypes.object,
  actions: PropTypes.array
}

TableAction.defaultProps = {
  search: {
    show: true,
    placeholder: 'Search'
  },
  actions: []
}

export default TableAction
