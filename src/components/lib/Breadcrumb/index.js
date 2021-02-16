import React from 'react'
import PropTypes from 'prop-types'

import { Link } from '@shared'

const Breadcrumb = ({ crumbs }) => {
  return (
    <div className='breadcrumb'>
      <ul>
        {crumbs.map((crumb, key) => (
          <li key={key}>
            <Link
              to={crumb.link}
              icon='fal fa-chevron-right'
              text={crumb.text}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

Breadcrumb.propTypes = {
  crumbs: PropTypes.array
}

Breadcrumb.defaultProps = {
  crumbs: []
}

export default Breadcrumb
