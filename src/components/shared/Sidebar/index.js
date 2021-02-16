import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'

import { Icon, Avatar } from '@lib'
import sideBarLogo from '@images/logo-white-icon-text.png'

import destroySession from '@graphql/mutators/destroy-session'

const Account = ({ loading, user }) => {
  if (loading) {
    return (
      <div className='account loading'></div>
    )
  }
  return (
    <div className='account'>
      <Avatar
        className='small circle'
        url={`https://ui-avatars.com/api/?background=1B5A88&bold=true&color=fff&name=${user.fullName}&size=90`}
      />
      <div className='username'>{user.username}</div>
      <div className='name'>{user.fullName}</div>
      <div className='type'>{user.userType.name}</div>
    </div>
  )
}

Account.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object.isRequired
}

Account.defaultProps = {
  loading: false
}

const Menu = ({ url, text, icon }) => {
  return (
    <li>
      <Link to={url}>
        <Icon className={icon} />
        <span>{text}</span>
      </Link>
    </li>
  )
}

Menu.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}

const Menus = ({ menus, handleLogout }) => {
  return (
    <div className='menu'>
      <ul>
        {menus.map(menu => (
          <Menu
            key={menu.url}
            {...menu}
          />
        ))}
        <li>
          <a
            className='logout'
            onClick={handleLogout}
          >
            <Icon className='fal fa-sign-out-alt' />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

Menus.propTypes = {
  menus: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired,
  handleLogout: PropTypes.func
}

const Sidebar = ({ user, menus }) => {
  const history = useHistory()

  const handleLogout = () => {
    destroySession({
      token: localStorage.getItem('authToken')
    }).then(({ data, extensions }) => {
      if (data.destroySession) {
        localStorage.setItem('authToken', '')
        history.push('/login')
      }
    })
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-logo'>
        <div className='logo'>
          <img src={sideBarLogo} />
        </div>
      </div>

      <div className='sidebar-account'>
        <Account user={user} />
      </div>

      <Scrollbars className='sidebar-menu'>
        <Menus
          menus={menus}
          handleLogout={handleLogout}
        />
      </Scrollbars>
    </div>
  )
}

Sidebar.propTypes = {
  user: PropTypes.object,
  menus: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired
}

export default Sidebar
