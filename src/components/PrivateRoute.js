import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogged } from '../utils';

class PrivateRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={routerProps =>
          isLogged() ? (
            <Component {...routerProps} />
          ) : (
            <Redirect to="/login" {...routerProps} />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
