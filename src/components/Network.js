import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Graph from 'react-graph-vis';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: '#000000'
  }
};

class Network extends Component {
  state = {
    nodes: [],
    edges: [],
    initialized: false
  };

  init = data => {
    this.setState(state => ({
      ...state,
      nodes: [
        {
          id: data.viewer.login,
          label: data.viewer.name,
          shape: 'circularImage',
          image: data.viewer.avatarUrl
        }
      ],
      initialized: true
    }));
  };

  handleClick = async (id, client) => {
    const { nodes } = this.state;
    const data = await client.query({
      query: USER_QUERY,
      variables: { login: id }
    });
    const user = data.data.user;
    if (user && user.following && user.following.nodes) {
      const nodesToAdd = user.following.nodes
        .filter(e => !nodes.find(se => se.id === e.id))
        .map(node => ({
          id: node.login,
          label: node.name,
          shape: 'circularImage',
          image: node.avatarUrl
        }));
      const linksToAdd = user.following.nodes.map(node => ({
        from: id,
        to: node.login
      }));
      this.setState(state => ({
        nodes: [...state.nodes, ...nodesToAdd],
        edges: [...state.edges, ...linksToAdd]
      }));
    }
  };

  render() {
    const createEvents = client => ({
      click: ({ nodes }) =>
        nodes[0] ? this.handleClick(nodes[0], client) : false
    });

    return (
      <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
        {({ loading, error, data, fetchMore, client }) => {
          if (loading) return 'Loading...1';
          if (error) return `Error1! ${error.message}`;
          if (!this.state.initialized) {
            this.init(data);
            return false;
          }

          return (
            <Graph
              graph={this.state}
              options={options}
              events={createEvents(client)}
              style={{ height: '640px' }}
            />
          );
        }}
      </Query>
    );
  }
}

const ROOT_QUERY = gql`
  query {
    viewer {
      id
      name
      avatarUrl
      login
    }
  }
`;

export const USER_QUERY = gql`
  query node($login: String!) {
    user(login: $login) {
      following(first: 2) {
        nodes {
          id
          name
          login
          avatarUrl
        }
      }
    }
  }
`;

export default Network;
