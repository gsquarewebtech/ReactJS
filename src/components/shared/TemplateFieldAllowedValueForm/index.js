import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card, Button } from '@lib'
import { Form, Group, Input, FormError, Submit } from '@shared/Form'
import { array, object } from '@utils'

import client from '@graphql/client'
import templateFieldAllowedValueGql from '@graphql/queries/template-field-allowed-value'
import clientsGql from '@graphql/queries/clients'
import templatesGql from '@graphql/queries/templates'
import templateFieldsGql from '@graphql/queries/template-fields'
import createTemplateFieldAllowedValue from '@graphql/mutators/create-template-field-allowed-value'
import updateTemplateFieldAllowedValue from '@graphql/mutators/update-template-field-allowed-value'

const TemplateFieldAllowedValueForm = ({ id, clientId, templateId, onSave }) => {
  const [input, setInput] = useState({
    clientId,
    templateId,
    templateFieldId: null,
    allowedValue: '',
    equivalentValue: ''
  })

  const [loading, setLoading] = useState(true)
  const [inputErrors, setInputErrors] = useState({})

  const clientsQuery = useQuery(clientsGql)
  const templatesQuery = useQuery(templatesGql)
  const templateFieldsQuery = useQuery(templateFieldsGql, {
    variables: {
      templateId,
      isValidate: true
    },
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (id && loading) {
      const variables = { id, templateId }

      if (clientId) {
        variables.clientId = clientId
      }

      client.query({
        query: templateFieldAllowedValueGql,
        variables
      }).then(({ data }) => {
        if (data.templateFieldAllowedValue) {
          setInput({
            id: data.templateFieldAllowedValue.id,
            clientId,
            templateId: data.templateFieldAllowedValue.templateField?.templateId,
            templateFieldId: data.templateFieldAllowedValue.templateFieldId,
            allowedValue: data.templateFieldAllowedValue?.allowedValue,
            equivalentValue: data.templateFieldAllowedValue?.equivalentValue
          })
          setLoading(false)
        }
      })
    }
  }, [loading])

  if (clientsQuery.loading || templatesQuery.loading || templateFieldsQuery.loading) {
    return null
  }

  if (id && loading) {
    return null
  }

  const { clients } = clientsQuery.data
  const { templates } = templatesQuery.data
  const { templateFields } = templateFieldsQuery.data

  const handleInputChange = (name, value) => {
    const newInput = { ...input }
    newInput[name] = value
    setInput(newInput)
  }

  const handleSave = (evt) => {
    if (evt) {
      evt.preventDefault()
    }

    const feErrors = {}
    if (!input.templateId) {
      feErrors.templateId = [{
        message: 'Template is required'
      }]
    }

    if (!input.templateFieldId) {
      feErrors.templateFieldId = [{
        message: 'Template field is required'
      }]
    }

    if (!input.allowedValue) {
      feErrors.allowedValue = [{
        message: 'Allowed value is required'
      }]
    }

    if (!input.equivalentValue) {
      feErrors.equivalentValue = [{
        message: 'Equivalent value is required'
      }]
    }

    if (!object.keys(feErrors).length) {
      if (id) {
        updateTemplateFieldAllowedValue(input).then(({ data, extensions }) => {
          if (data.updateTemplateFieldAllowedValue) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createTemplateFieldAllowedValue(input).then(({ data, extensions }) => {
          if (data.createTemplateFieldAllowedValue) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      }
    } else {
      setInputErrors(feErrors)
    }
  }

  return (
    <Card>
      <Form onSubmit={handleSave}>
        <FormError errors={inputErrors} />

        <Group>
          <Input
            label='Client'
            type='select'
            placeholder='All'
            disabled={!!clientId}
            options={clients.map(option => ({ value: option.id, text: option.name }))}
            value={input.clientId}
            onChange={(value) => handleInputChange('clientId', value)}
            errors={inputErrors.clientId}
          />
        </Group>

        <Group>
          <Input
            label='Template'
            type='select'
            placeholder='Select Template'
            disabled={!!templateId}
            options={templates.map(option => ({ value: option.id, text: option.name }))}
            value={input.templateId}
            onChange={(value) => handleInputChange('templateId', value)}
            errors={inputErrors.templateId}
          />
        </Group>

        <Group>
          <Input
            label='Template Field'
            type='select'
            placeholder='Select Template Field'
            options={templateFields.map(option => ({ value: option.id, text: option.name }))}
            value={input.templateFieldId}
            onChange={(value) => handleInputChange('templateFieldId', value)}
            errors={inputErrors.templateFieldId}
          />
        </Group>

        <Group>
          <Input
            label='Allowed Value'
            type='text'
            value={input.allowedValue}
            onChange={(value) => handleInputChange('allowedValue', value)}
            errors={inputErrors.allowedValue}
          />
        </Group>

        <Group>
          <Input
            label='Equivalent Value'
            type='text'
            value={input.equivalentValue}
            onChange={(value) => handleInputChange('equivalentValue', value)}
            errors={inputErrors.equivalentValue}
          />
        </Group>

        <Submit className='right'>
          <Button
            type='submit'
            className='circle icon-left'
            icon={`${id ? '' : 'fal fa-plus'}`}
            text={`${id ? 'Update' : 'Add'} Allowed Value`}
          />
        </Submit>
      </Form>
    </Card>
  )
}

TemplateFieldAllowedValueForm.propTypes = {
  id: PropTypes.string,
  clientId: PropTypes.string,
  templateId: PropTypes.string,
  onSave: PropTypes.func
}

TemplateFieldAllowedValueForm.defaultProps = {
  id: '',
  clientId: null,
  templateId: null,
  onSave: () => {}
}

export default TemplateFieldAllowedValueForm
