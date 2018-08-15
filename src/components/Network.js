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

              {data.viewer.following.nodes.map(node => {
                if (node.following && node.following.nodes) {
                  return node.following.nodes.map(subNode => (
                    <Avatar
                      key={subNode.id}
                      id={subNode.id}
                      url={subNode.avatarUrl}
                    />
                  ));
                } else {
                  return <div key={`avatar-${node.id}`}>{null}</div>;
                }
              })}

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
                  onClick={async () => {
                    // const { data } = await client.query({
                    //   query: MORECONNECTIONS_QUERY,
                    //   variables: { login: node.login }
                    // });

                    // const ret = client.readFragment({
                    //   id: `User:${node.id}`,
                    //   fragment: gql`
                    //     fragment myUser on User2 {
                    //       id
                    //       login
                    //       name
                    //       avatarUrl
                    //       createdAt
                    //       __typename
                    //       following {
                    //         nodes
                    //       }
                    //     }
                    //   `,
                    // });

                    // client.writeFragment({
                    //   id: `User:${node.id}`,
                    //   fragment: gql`
                    //     fragment myUser on User2 {
                    //       id
                    //       login
                    //       name
                    //       avatarUrl
                    //       createdAt
                    //       __typename
                    //     }
                    //   `,
                    //   data: { ...ret,
                    //     name: "zezim",
                    //     following: { ...data.user.following }
                    //   },
                    // });

                    const newQuery = gql`
                      {
                        viewer {
                          id
                          login
                          name
                          avatarUrl
                          createdAt
                          __typename
                          following(first: 10) {
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

                    client.query({
                      query: newQuery
                    });

                    //following: { ...data.user.following },
                    console.log(data);
                  }}
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

              {data.viewer.following.nodes.map(node => {
                if (node.following && node.following.nodes) {
                  return node.following.nodes.map(subNode => (
                    <ForceGraphNode
                      key={subNode.id}
                      fill={`url(#avatar-${subNode.id})`}
                      node={{ ...subNode, id: subNode.login, radius: 5 }}
                    />
                  ));
                } else {
                  return <div key={`subnodes-${node.id}`}>{null}</div>;
                }
              })}

              {data.viewer.following.nodes.map(node => {
                if (node.following && node.following.nodes) {
                  return node.following.nodes.map(subNode => (
                    <ForceGraphLink
                      key={`follwoing:${node.login}-${subNode.login}`}
                      link={{
                        source: node.login,
                        target: subNode.login,
                        value: 1
                      }}
                    />
                  ));
                } else {
                  return <div key={`sublinks-${node.id}`}>{null}</div>;
                }
              })}
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
  query MoreConnections($login: String!) {
    user(login: $login) {
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
`;

export default Network;
