import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import templateFieldAllowedValuesGql from '@graphql/queries/template-field-allowed-values'
import destroyTemplateFieldAllowedValue from '@graphql/mutators/destroy-template-field-allowed-value'

const TemplateFieldAllowedValueList = ({ clientId, templateId, links, fields, itemClass, onDelete, filters }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showedValueCount, setShowedValueCount] = useState(5)

  // set search
  const variables = {
    templateId,
    clientId
  }

  // if (filters.search) {
  //   variables.search = filters.search
  // }

  // values query
  const templateFieldAllowedValuesQuery = useQuery(templateFieldAllowedValuesGql, { variables, fetchPolicy: 'network-only' })

  if (templateFieldAllowedValuesQuery.loading || templateFieldAllowedValuesQuery.error) {
    return null
  }

  const { templateFieldAllowedValues } = templateFieldAllowedValuesQuery.data

  if (!templateFieldAllowedValues) {
    return null
  }

  // pagination
  const valuesLength = templateFieldAllowedValues.length
  const pages = Math.ceil(valuesLength / showedValueCount)

  const currentValues = []
  const startValueIndex = (currentPage - 1) * showedValueCount
  let endValueIndex = startValueIndex + (showedValueCount - 1)
  if (endValueIndex > (valuesLength - 1)) {
    endValueIndex = valuesLength - 1
  }

  for (let i = startValueIndex; i <= endValueIndex; i++) {
    const templateFieldAllowedValue = templateFieldAllowedValues[i]
    currentValues.push(
      templateFieldAllowedValue
    )
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handlePaginationSizeChange = (size) => {
    setCurrentPage(1)
    setShowedValueCount(size)
  }
  // end

  const handleDelete = (allowedValue) => {
    swal({
      text: 'Are you sure you want to delete this template field value?',
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
        destroyTemplateFieldAllowedValue(allowedValue.id, clientId).then(() => {
          onDelete(allowedValue)
          swal({
            text: 'Template field value deleted!',
            icon: 'success',
            buttons: false,
            timer: 1500
          })
        })
      }
    })
  }

  const handleNoDelete = () => {
    swal({
      text: 'You cannot perform changes to this record',
      icon: 'error',
      buttons: false,
      timer: 2500
    })
  }

  return (
    <ListView>
      {currentValues.map(allowedValue => (
        <Item
          key={allowedValue.id}
          className={classNames(itemClass)}
        >
          {fields.client && (
            <Field label='Client'>
              {allowedValue.client?.name ?? 'All'}
            </Field>
          )}

          {fields.template && (
            <Field label='Template'>
              {allowedValue.templateField?.template?.name}
            </Field>
          )}

          {fields.templateField && (
            <Field label='Template Field'>
              {allowedValue.templateField?.name}
            </Field>
          )}

          {fields.allowedValue && (
            <Field label='Allowed Value'>
              {allowedValue.allowedValue}
            </Field>
          )}

          {fields.equivalentValue && (
            <Field label='Equivalent Value'>
              {allowedValue.equivalentValue}
            </Field>
          )}

          {fields.action && (
            <Field
              className='item-action'
              noLabel
            >
              {clientId && !allowedValue.client && (
                <Button
                  className='disabled'
                  onClick={() => handleNoDelete()}
                  icon='fal fa-pencil-alt'
                />
              )}

              {clientId && !allowedValue.client && (
                <Button
                  className='disabled'
                  onClick={() => handleNoDelete()}
                  icon='fal fa-trash'
                />
              )}

              {clientId && allowedValue.client && (
                <Link
                  className='button blue'
                  to={`${links.edit}/${allowedValue.id}`}
                  icon='fal fa-pencil-alt'
                />
              )}

              {clientId && allowedValue.client && (
                <Button
                  className='red'
                  onClick={() => handleDelete(allowedValue)}
                  icon='fal fa-trash'
                />
              )}

              {!clientId && (
                <Link
                  className='button blue'
                  to={`${links.edit}/${allowedValue.id}`}
                  icon='fal fa-pencil-alt'
                />
              )}

              {!clientId && (
                <Button
                  className='red'
                  onClick={() => handleDelete(allowedValue)}
                  icon='fal fa-trash'
                />
              )}
            </Field>
          )}
        </Item>
      ))}

      <Pagination
        className='centered'
        pages={pages}
        limit={10}
        currentPage={currentPage}
        onPageClick={handlePageClick}
        sizes={[5, 10, 25, 50, 100]}
        selectedSize={showedValueCount}
        onSizeChange={handlePaginationSizeChange}
      />
    </ListView>
  )
}

TemplateFieldAllowedValueList.propTypes = {
  clientId: PropTypes.string,
  templateId: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object,
  itemClass: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

TemplateFieldAllowedValueList.defaultProps = {
  clientId: null,
  links: {
    view: '',
    edit: ''
  },
  fields: {
    client: true,
    template: true,
    templateField: true,
    allowedValue: true,
    equivalentValue: true,
    action: true
  },
  onDelete: () => {},
  filters: {}
}

export default TemplateFieldAllowedValueList
