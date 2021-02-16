import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Card, Button } from '@lib'
import { Form, Group, Input, FormError, Submit } from '@shared/Form'
import { array, object } from '@utils'

import client from '@graphql/client'
import templateFieldMappingGql from '@graphql/queries/template-field-mapping'
import clientsGql from '@graphql/queries/clients'
import templatesGql from '@graphql/queries/templates'
import templateFieldsGql from '@graphql/queries/template-fields'
import createTemplateFieldMapping from '@graphql/mutators/create-template-field-mapping'
import updateTemplateFieldMapping from '@graphql/mutators/update-template-field-mapping'

const TemplateFieldMappingForm = ({ id, clientId, templateId, onSave }) => {
  const [input, setInput] = useState({
    clientId,
    templateId,
    templateFieldId: null,
    name: ''
  })

  const [loading, setLoading] = useState(true)
  const [inputErrors, setInputErrors] = useState({})

  const clientsQuery = useQuery(clientsGql)
  const templatesQuery = useQuery(templatesGql)
  const templateFieldsQuery = useQuery(templateFieldsGql, {
    variables: {
      templateId
    }
  })

  useEffect(() => {
    if (id && loading) {
      const variables = { id, templateId }

      if (clientId) {
        variables.clientId = clientId
      }

      client.query({
        query: templateFieldMappingGql,
        variables
      }).then(({ data }) => {
        if (data.templateFieldMapping) {
          setInput({
            id: data.templateFieldMapping.id,
            clientId,
            templateId: data.templateFieldMapping.templateField?.templateId,
            templateFieldId: data.templateFieldMapping.templateFieldId,
            name: data.templateFieldMapping?.name
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

    if (!input.name) {
      feErrors.name = [{
        message: 'Name is required'
      }]
    }

    if (!object.keys(feErrors).length) {
      if (id) {
        updateTemplateFieldMapping(input).then(({ data, extensions }) => {
          if (data.updateTemplateFieldMapping) {
            setInputErrors({})
            onSave()
          } else if (extensions && extensions.errors) {
            setInputErrors(array.groupBy(extensions.errors, 'path'))
          }
        })
      } else {
        createTemplateFieldMapping(input).then(({ data, extensions }) => {
          if (data.createTemplateFieldMapping) {
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
            label='Resolve To'
            type='text'
            value={input.name}
            onChange={(value) => handleInputChange('name', value)}
            errors={inputErrors.name}
          />
        </Group>

        <Submit className='right'>
          <Button
            type='submit'
            className='circle icon-left'
            icon={`${id ? '' : 'fal fa-plus'}`}
            text={`${id ? 'Update' : 'Add'} Field Mapping`}
          />
        </Submit>
      </Form>
    </Card>
  )
}

TemplateFieldMappingForm.propTypes = {
  id: PropTypes.string,
  clientId: PropTypes.string,
  templateId: PropTypes.string,
  onSave: PropTypes.func
}

TemplateFieldMappingForm.defaultProps = {
  id: '',
  clientId: null,
  templateId: null,
  onSave: () => {}
}

export default TemplateFieldMappingForm
