import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const PageRoute = ({ authenticated, component: Component, auth, loading, ...rest }) => {
  if (loading) {
    return null
  }

  if (authenticated && auth && !auth.ok) {
    return (
      <Redirect to='/'/>
    )
  }

  return (
    <Route
      render={(props) => (<Component {...props} />)}
      {...rest}
    />
  )
}

PageRoute.propTypes = {
  authenticated: PropTypes.bool,
  component: PropTypes.any,
  auth: PropTypes.object,
  loading: PropTypes.bool
}

PageRoute.defaultProps = {
  authenticated: false,
  loading: false
}

export default PageRoute
