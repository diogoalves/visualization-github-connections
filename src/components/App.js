import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import PrivateRoute from './PrivateRoute';
import Header from './Header';
import Network from './Network';
// import Login from './Login';
import withRoot from './withRoot';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {/* <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={Network} /> */}
        <Route exact path="/" component={Network} />
      </div>
    );
  }
}

export default withRoot(App);
