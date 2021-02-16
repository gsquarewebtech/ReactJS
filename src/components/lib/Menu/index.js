import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router-dom'

const Menu = ({ location, links }) => {
  return (
    <div className={classNames('menu')}>
      <ul>
        {
          links.map(({ text, url }) => (
            <li key={`key-menu-${url}`}>
              <Link
                to={url}
                className={classNames('menu-link', { active: url === location.pathname })}
              >
                {text}
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

Menu.propTypes = {
  location: PropTypes.object,
  links: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string
  }))
}

export default withRouter(Menu)
