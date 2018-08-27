import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Header from './Header';
import Demo from './Demo';
import Network from './Network';
import withRoot from './withRoot';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Route exact path="/login" component={Demo} />
        <PrivateRoute exact path="/" component={Network} />
        {/* <Route exact path="/" component={Network} /> */}
      </div>
    );
  }
}

export default withRoot(App);
