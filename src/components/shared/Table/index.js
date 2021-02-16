import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Table = ({ className, children }) => {
  return (
    <div className={classNames('table-view', className)}>
      <table>
        {children}
      </table>
    </div>
  )
}

const Head = ({ children }) => {
  return (
    <thead>
      {children}
    </thead>
  )
}

const Body = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  )
}

const Row = ({ className, children }) => {
  return (
    <tr className={classNames(className)}>
      {children}
    </tr>
  )
}

const Column = ({ value, className, children }) => {
  return (
    <td className={classNames(className)}>
      {value || children}
    </td>
  )
}

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Head.propTypes = {
  children: PropTypes.node
}

Body.propTypes = {
  children: PropTypes.node
}

Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Column.propTypes = {
  value: PropTypes.any,
  className: PropTypes.string,
  children: PropTypes.node
}

export {
  Table,
  Head,
  Body,
  Row,
  Column
}
