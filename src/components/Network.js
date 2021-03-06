import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ForceGraph2D } from 'react-force-graph';

//TODO cache avatar image object
//TODO button to center on user icon
//TODO variable size/val in order of user totalConnections
//TODO implement shortest path between two nodes in screen
//TODO present some statitics in drawer (#nodes, #links)
class Network extends Component {
  state = {
    nodes: [],
    links: [],
    initialized: false
  };

  init = data => {
    this.setState(state => ({
      ...state,
      nodes: [
        {
          id: data.viewer.login,
          name: data.viewer.name,
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
      hasNext = data.data.user.following.pageInfo.hasNextPage;
      after = data.data.user.following.pageInfo.endCursor;
      ret = [...ret, ...data.data.user.following.nodes];
    }
    return ret;
  };

  handleClick = async (id, client) => {
    const { nodes } = this.state;
    const data = await this.fetchAllConnections(id, client);
    if (data) {
      const nodesToAdd = data
        .filter(e => !nodes.find(se => se.id === e.login))
        .map(node => ({
          id: node.login,
          name: node.name,
          image: node.avatarUrl
        }));
      const linksToAdd = data.map(node => ({
        source: id,
        target: node.login
      }));
      this.setState(state => ({
        nodes: [...state.nodes, ...nodesToAdd],
        links: [...state.links, ...linksToAdd]
      }));
    }
  };

  createAvatar = (node, ctx) => {
    const { x, y, image } = node;
    const img = new Image();
    img.src = image;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 0.3;
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, x - 5, y - 5, 10, 10);
    ctx.restore();
  };

  render() {
    return (
      <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
        {({ loading, error, data, fetchMore, client }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          if (!this.state.initialized) {
            this.init(data);
            return false;
          }
          return (
            <ForceGraph2D
              graphData={this.state}
              onNodeClick={node => this.handleClick(node.id, client)}
              nodeCanvasObject={this.createAvatar}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              cooldownTime={5000}
              d3VelocityDecay={0.1}
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
