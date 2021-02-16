import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

import { Flex } from '@lib'
import { Directory } from '@shared'

import templatesGql from '@graphql/queries/templates'

const TemplateList = ({ links, itemClass }) => {
  const templatesQuery = useQuery(templatesGql)

  if (templatesQuery.loading) {
    return null
  }

  const { templates } = templatesQuery.data

  return (
    <Flex>
      <div className='directories'>
        {templates.map(template => (
          <Directory
            key={template.id}
            link={`${links.view}${template.id}`}
            text={`${template.name}`}
          />
        ))}
      </div>
    </Flex>
  )
}

TemplateList.propTypes = {
  links: PropTypes.object,
  itemClass: PropTypes.string
}

TemplateList.defaultProps = {
  links: {
    view: ''
  }
}

export default TemplateList
