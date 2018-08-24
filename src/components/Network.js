import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Graph from 'react-graph-vis';

var options = {
  width: '100%',
  height: '700px',
  navigation: true,
  configurePhysics: false,
  smoothCurves: true,
  edges: {
    style: 'arrow',
    color: {
      highlight: 'red'
    }
  },
  hierarchicalLayout: false,
  stabilizationIterations: 5000,
  stabilize: true,
  physics: {
    barnesHut: {
      enabled: true,
      gravitationalConstant: -5000,
      centralGravity: 0,
      springLength: 30,
      springConstant: 0.005,
      damping: 0.09
    }
  },
  keyboard: true
};

const options2 = {
  stabilizationIterations: 5000,
  layout: {
    hierarchical: false
  },
  edges: {
    color: '#000000',
    width: 0.15,
    smooth: {
      type: 'continuous'
    }
  },
  physics: {
    stabilization: true
  },
  interaction: {
    hideEdgesOnDrag: true
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

  fetchAllConnections = async (login, client) => {
    let hasNext = true;
    let after = null;
    let ret = [];
    while (hasNext) {
      const data = await client.query({
        query: USER_QUERY,
        variables: { login, after }
      });
      console.log(data);
      hasNext = data.data.user.following.pageInfo.hasNextPage;
      after = data.data.user.following.pageInfo.endCursor;
      ret = [...ret, ...data.data.user.following.nodes];
    }
    return ret;
  };

  handleClick = async (id, client) => {
    const { nodes } = this.state;
    // const data = await client.query({
    //   query: USER_QUERY,
    //   variables: { login: id, after: null }
    // });
    const data = await this.fetchAllConnections(id, client);

    if (data) {
      const nodesToAdd = data
        .filter(e => !nodes.find(se => se.id === e.id))
        .map(node => ({
          id: node.login,
          label: node.name,
          shape: 'circularImage',
          image: node.avatarUrl
        }));
      const linksToAdd = data.map(node => ({
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
              style={{
                position: 'absolute',
                top: 100,
                bottom: 0,
                left: 0,
                right: 0
              }}
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
  query node($login: String!, $after: String) {
    user(login: $login) {
      following(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
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
