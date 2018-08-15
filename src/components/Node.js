import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ForceGraphNode } from 'react-vis-force';
import './demo-styles.css';
import Avatar from './Avatar';

class Node extends Component {
  state = {
    first: 1,
    after: null,
    expanded: false
  };

  handleExpand = () => {
    this.setState(state => ({
      ...state,
      expanded: !state.expanded
    }));
  };
  render() {
    const { first, after, expanded } = this.state;
    const { login } = this.props;
    return (
      <Query
        query={NODE_QUERY}
        variables={{ login, first, after }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          return <h1 onClicl={this.handleExpand}>{login}</h1>;
        }}
      </Query>
    );
  }
}

const Node2 = ({ login }) => (
  <Query
    query={NODE_QUERY}
    variables={{ login, first: 1, after: null }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <ForceGraphNode
          key={login}
          // fill={`url(#avatar-${data.viewer.id})`}
          node={{ id: login, radius: 5 }}
        />
      );
    }}
  </Query>
);

export const NODE_QUERY = gql`
  query node($login: String!, $first: Int, $after: String) {
    user(login: $login) {
      avatarUrl
      name
      login
      following(first: $first, after: $after) {
        nodes {
          login
        }
      }
    }
  }
`;

export default Node;
