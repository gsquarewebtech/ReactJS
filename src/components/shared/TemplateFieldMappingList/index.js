import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'

import { Button, swal, Pagination } from '@lib'
import { Link } from '@shared'
import { ListView, Item, Field } from '@shared/ListView'

import templateFieldMappingsGql from '@graphql/queries/template-field-mappings'
import destroyTemplateFieldMapping from '@graphql/mutators/destroy-template-field-mapping'

const TemplateFieldMappingList = ({ clientId, templateId, links, fields, itemClass, onDelete, filters }) => {
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
  const templateFieldMappingsQuery = useQuery(templateFieldMappingsGql, {
    variables,
    fetchPolicy: 'network-only'
  })

  if (templateFieldMappingsQuery.loading || templateFieldMappingsQuery.error) {
    return null
  }

  const { templateFieldMappings } = templateFieldMappingsQuery.data

  if (!templateFieldMappings) {
    return null
  }

  // pagination
  const valuesLength = templateFieldMappings.length
  const pages = Math.ceil(valuesLength / showedValueCount)

  const currentValues = []
  const startValueIndex = (currentPage - 1) * showedValueCount
  let endValueIndex = startValueIndex + (showedValueCount - 1)
  if (endValueIndex > (valuesLength - 1)) {
    endValueIndex = valuesLength - 1
  }

  for (let i = startValueIndex; i <= endValueIndex; i++) {
    const templateFieldMapping = templateFieldMappings[i]
    currentValues.push(
      templateFieldMapping
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

  const handleDelete = (mapping) => {
    swal({
      text: 'Are you sure you want to delete this template field mapping?',
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
        destroyTemplateFieldMapping(mapping.id, clientId).then(() => {
          onDelete(mapping)
          swal({
            text: 'Template field mapping deleted!',
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
      {currentValues.map(mapping => (
        <Item
          key={mapping.id}
          className={classNames(itemClass)}
        >
          {fields.client && (
            <Field label='Client'>
              {mapping.client?.name ?? 'All'}
            </Field>
          )}

          {fields.template && (
            <Field label='Template'>
              {mapping.templateField?.template?.name}
            </Field>
          )}

          {fields.templateField && (
            <Field label='Template Field'>
              {mapping.templateField?.name}
            </Field>
          )}

          {fields.name && (
            <Field label='Resolve To'>
              {mapping.name}
            </Field>
          )}

          {fields.isRequired && (
            <Field label='Required'>
              {mapping.isRequired === 1 ? 'true' : 'false'}
            </Field>
          )}

          {fields.action && (
            <Field
              className='item-action'
              noLabel
            >
              {clientId && !mapping.client && (
                <Button
                  className='disabled'
                  onClick={() => handleNoDelete()}
                  icon='fal fa-pencil-alt'
                />
              )}

              {clientId && !mapping.client && (
                <Button
                  className='disabled'
                  onClick={() => handleNoDelete()}
                  icon='fal fa-trash'
                />
              )}

              {clientId && mapping.client && (
                <Link
                  className='button blue'
                  to={`${links.edit}/${mapping.id}`}
                  icon='fal fa-pencil-alt'
                />
              )}

              {clientId && mapping.client && (
                <Button
                  className='red'
                  onClick={() => handleDelete(mapping)}
                  icon='fal fa-trash'
                />
              )}

              {!clientId && (
                <Link
                  className='button blue'
                  to={`${links.edit}/${mapping.id}`}
                  icon='fal fa-pencil-alt'
                />
              )}

              {!clientId && (
                <Button
                  className='red'
                  onClick={() => handleDelete(mapping)}
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

TemplateFieldMappingList.propTypes = {
  clientId: PropTypes.string,
  templateId: PropTypes.string,
  links: PropTypes.object,
  fields: PropTypes.object,
  itemClass: PropTypes.string,
  onDelete: PropTypes.func,
  filters: PropTypes.object
}

TemplateFieldMappingList.defaultProps = {
  clientId: null,
  links: {
    view: '',
    edit: ''
  },
  fields: {
    client: true,
    template: true,
    templateField: true,
    name: true,
    isRequired: false,
    action: true
  },
  onDelete: () => {},
  filters: {}
}

export default TemplateFieldMappingList
