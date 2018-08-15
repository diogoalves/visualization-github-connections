import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './demo-styles.css';
import { InteractiveForceGraph, ForceGraphNode } from 'react-vis-force';
import Node from './Node';

class Network extends Component {
  render() {
    return (
      <Query query={ME_QUERY} fetchPolicy="cache-and-network">
        {({ loading, error, data, fetchMore, client }) => {
          if (loading) return 'Loading...1';
          if (error) return `Error1! ${error.message}`;

          return <Node login={data.viewer.login} />;
        }}
      </Query>
    );
  }
}

const ME_QUERY = gql`
  query {
    viewer {
      login
    }
  }
`;

export default Network;
