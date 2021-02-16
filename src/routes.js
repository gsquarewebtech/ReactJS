import React from 'react'
import PropTypes from 'prop-types'

import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

import { PageRoute } from '@lib'

// common pages
import { NotFound } from '@screens/Pages'
import LoginScreen from '@screens/Login'
import RegisterScreen from '@screens/Register'
import ForgotPasswordScreen from '@screens/ForgotPassword'
import ForgotPasswordChangeScreen from '@screens/ForgotPassword/change'
import CreatePasswordScreen from '@screens/CreatePassword'
import ChangePasswordScreen from '@screens/ChangePassword'
import TestScreen from '@screens/Test'

//
// admin pages
//
import AdminDashboardScreen from '@screens/Admin/Dashboard'
import AdminChangePasswordScreen from '@screens/Admin/ChangePassword'


// admin - clients
import AdminClientsScreen from '@screens/Admin/Clients'
import AdminViewClientScreen from '@screens/Admin/Clients/view'
import AdminNewClientScreen from '@screens/Admin/Clients/new'
import AdminEditClientScreen from '@screens/Admin/Clients/edit'
import AdminViewClientUserScreen from '@screens/Admin/Clients/view-user'
import AdminNewClientUserScreen from '@screens/Admin/Clients/new-user'
import AdminEditClientUserScreen from '@screens/Admin/Clients/edit-user'
import AdminViewClientCustomerScreen from '@screens/Admin/Clients/view-customer'
import AdminNewClientCustomerScreen from '@screens/Admin/Clients/new-customer'
import AdminEditClientCustomerScreen from '@screens/Admin/Clients/edit-customer'
import AdminClientNewVendorScreen from '@screens/Admin/Clients/new-vendor'
import AdminClientViewVendorScreen from '@screens/Admin/Clients/view-vendor'
import AdminNewClientVendorUserScreen from '@screens/Admin/Clients/new-vendor-user'
import AdminEditClientVendorUserScreen from '@screens/Admin/Clients/edit-vendor-user'


// client - users
import ClientUsersScreen from '@screens/Client/Users'
import ClientViewUserScreen from '@screens/Client/Users/view'
import ClientNewUserScreen from '@screens/Client/Users/new'
import ClientEditUserScreen from '@screens/Client/Users/edit'






const Routes = ({ children }) => {
  return (
    <Router>
      {children}

      <Switch>
        {/* start: public pages */}
        <PageRoute
          path='/'
          component={LoginScreen}
          exact
        />
        <PageRoute
          path='/login'
          component={LoginScreen}
          exact
        />
        <PageRoute
          path='/register'
          component={RegisterScreen}
          exact
        />
        <PageRoute
          path='/forgot-password'
          component={ForgotPasswordScreen}
          exact
        />
        <PageRoute
          path='/forgot-password/change/:token'
          component={ForgotPasswordChangeScreen}
          exact
        />
        <PageRoute
          path='/create-password/:token'
          component={CreatePasswordScreen}
          exact
        />
        <PageRoute
          path='/change-password'
          component={ChangePasswordScreen}
          exact
        />
        <PageRoute
          path='/test'
          component={TestScreen}
          exact
        />

        {/* start: admin pages */}
        <PageRoute
          path='/admin'
          component={AdminDashboardScreen}
          authenticated={true}
          exact
        />

       
        {/* admin - clients */}
        <PageRoute
          path='/admin/clients'
          component={AdminClientsScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/new'
          component={AdminNewClientScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/edit/:id'
          component={AdminEditClientScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:id'
          component={AdminViewClientScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:id/user/new'
          component={AdminNewClientUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/user/:userId'
          component={AdminViewClientUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/user/edit/:userId'
          component={AdminEditClientUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/customer/new'
          component={AdminNewClientCustomerScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/customer/:customerId'
          component={AdminViewClientCustomerScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/customer/edit/:customerId'
          component={AdminEditClientCustomerScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/vendor/new'
          component={AdminClientNewVendorScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/vendor/:vendorId'
          component={AdminClientViewVendorScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/vendor/:vendorId/user/new'
          component={AdminNewClientVendorUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/admin/client/:clientId/vendor/:vendorId/user/edit/:accountUserId'
          component={AdminEditClientVendorUserScreen}
          authenticated={true}
          exact
        />

        {/* start: client pages */}
        <PageRoute
          path='/client'
          component={ClientDashboardScreen}
          authenticated={true}
          exact
        />


        {/* client - users */}
        <PageRoute
          path='/client/users'
          component={ClientUsersScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/client/user/new'
          component={ClientNewUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/client/user/edit/:id'
          component={ClientEditUserScreen}
          authenticated={true}
          exact
        />
        <PageRoute
          path='/client/user/:id'
          component={ClientViewUserScreen}
          authenticated={true}
          exact
        />

        {/* start: fallback page */}
        <PageRoute component={NotFound} />
      </Switch>
    </Router>
  )
}

Routes.propTypes = {
  children: PropTypes.object
}

export default Routes
