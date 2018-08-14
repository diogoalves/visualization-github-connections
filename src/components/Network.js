import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './demo-styles.css';
import {
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphLink
} from 'react-vis-force';
import Avatar from './Avatar';

class Network extends Component {
  render() {
    return (
      <Query
        query={NETWORK_QUERY}
        variables={{
          first: 1,
          followingAfter: null
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, fetchMore, client }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          console.log(data);

          return (
            <InteractiveForceGraph
              zoom
              zoomOptions={{
                minScale: 1,
                maxScale: 6
              }}
              simulationOptions={{ animate: true }}
            >
              <Avatar id={data.viewer.id} url={data.viewer.avatarUrl} />

              {data.viewer.following.nodes.map(node => (
                <Avatar key={node.id} id={node.id} url={node.avatarUrl} />
              ))}

              <ForceGraphNode
                key={data.viewer.id}
                fill={`url(#avatar-${data.viewer.id})`}
                node={{ id: data.viewer.login, radius: 10 }}
                onClick={() => {
                  if (data.viewer.following.pageInfo.hasNextPage) {
                    fetchMore({
                      variables: {
                        first: 1,
                        followingAfter: data.viewer.following.pageInfo.endCursor
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        const ret = Object.assign({}, prev, {
                          viewer: {
                            ...prev.viewer,
                            following: {
                              nodes: [
                                ...prev.viewer.following.nodes,
                                ...fetchMoreResult.viewer.following.nodes
                              ],
                              pageInfo:
                                fetchMoreResult.viewer.following.pageInfo,
                              __typename:
                                fetchMoreResult.viewer.following.__typename
                            }
                          }
                        });
                        return ret;
                      }
                    });
                  }
                }}
              />

              {data.viewer.following.nodes.map(node => (
                <ForceGraphNode
                  key={node.id}
                  fill={`url(#avatar-${node.id})`}
                  node={{ ...node, id: node.login, radius: 5 }}
                />
              ))}

              {data.viewer.following.nodes.map(node => (
                <ForceGraphLink
                  key={`follwoing:${node.login}`}
                  link={{
                    source: data.viewer.login,
                    target: node.login,
                    value: 1
                  }}
                />
              ))}
            </InteractiveForceGraph>
          );
        }}
      </Query>
    );
  }
}

export const NETWORK_QUERY = gql`
  query Network($first: Int, $followingAfter: String) {
    viewer {
      id
      login
      name
      avatarUrl
      createdAt
      __typename
      following(first: $first, after: $followingAfter) {
        __typename
        pageInfo {
          endCursor
          hasNextPage
          __typename
        }
        nodes {
          id
          login
          name
          avatarUrl
          createdAt
          __typename
        }
      }
    }
  }
`;

export const MORECONNECTIONS_QUERY = gql`
  query MoreConnections(
    $login: String!
    $nextFollower: String
    $nextFollowing: String
  ) {
    user(login: $login) {
      followers(first: 1, after: $nextFollower) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          login
          name
          avatarUrl
          createdAt
          __typename
        }
      }
      following(first: 1, after: $nextFollowing) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          login
          name
          avatarUrl
          createdAt
          __typename
          following(first: 1) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              login
              name
              avatarUrl
              createdAt
              __typename
            }
          }
        }
      }
    }
  }
`;

export default Network;
