import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './demo-styles.css';
import {
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphLink
} from 'react-vis-force';
import { merge } from '../utils';

class Network extends Component {
  f = async (login, nextFollower, nextFollowing, client) => {
    console.log(`entrou ${login}, ${nextFollower}, ${nextFollowing}}`);
    const ret = await client.query({
      query: MORECONNECTIONS_QUERY,
      variables: { login, nextFollower, nextFollowing }
    });

    // const res = client.readQuery({
    //   query: gql`
    //     query User($login: String!) {
    //       user(login: $login) {
    //         followers {
    //           nodes {
    //             id
    //             name
    //             login
    //             createdAt
    //             avatarUrl
    //           }
    //         }
    //       }
    //     }
    //   `,
    //   variables: {
    //     login,
    //   },
    // });

    console.log(ret);
    // console.log(res)
  };

  cF = (login, nextFollower, nextFollowing, client) => () => {
    this.f(login, nextFollower, nextFollowing, client);
  };

  render() {
    return (
      <Query
        query={NETWORK_QUERY}
        variables={{
          first: 1,
          after: null
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, fetchMore, client }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const others = merge(
            data.viewer.following.nodes,
            data.viewer.followers.nodes
          );
          return (
            <InteractiveForceGraph
              zoom
              zoomOptions={{
                minScale: 1,
                maxScale: 6
              }}
              simulationOptions={{ animate: true }}
            >
              <defs>
                <pattern
                  id={`avatar-${data.viewer.id}`}
                  x="0%"
                  y="0%"
                  height="100%"
                  width="100%"
                  viewBox="0 0 512 512"
                >
                  <image
                    x="0%"
                    y="0%"
                    width="512"
                    height="512"
                    href={data.viewer.avatarUrl}
                  />
                </pattern>
              </defs>

              {others.map(node => (
                <defs key={node.id}>
                  <pattern
                    id={`avatar-${node.id}`}
                    x="0%"
                    y="0%"
                    height="100%"
                    width="100%"
                    viewBox="0 0 512 512"
                  >
                    <image
                      x="0%"
                      y="0%"
                      width="512"
                      height="512"
                      href={node.avatarUrl}
                    />
                  </pattern>
                </defs>
              ))}

              <ForceGraphNode
                key={data.viewer.id}
                fill={`url(#avatar-${data.viewer.id})`}
                node={{ id: data.viewer.login, radius: 10 }}
                onClick={() => {
                  const node = data.viewer;
                  const followersPageInfo = node.followers.pageInfo;
                  const followingPageInfo = node.following.pageInfo;
                  const hasMoreToFecth =
                    followersPageInfo.hasNextPage ||
                    followingPageInfo.hasMoreToFecth;
                  if (hasMoreToFecth) {
                    this.f(
                      node.login,
                      followersPageInfo.endCursor,
                      followingPageInfo.endCursor,
                      client
                    );
                  }
                  // const fetchFollowers = data.viewer.followers.pageInfo.hasNextPage;
                  //const fetchFollowing = data.viewer.following.pageInfo.hasNextPage;
                  // if (fetchFollowers) {
                  //   fetchMore({
                  //     variables: {
                  //       first: 1,
                  //       after: data.viewer.followers.pageInfo.endCursor
                  //     },
                  //     updateQuery: (prev, { fetchMoreResult }) => {
                  //       if (!fetchMoreResult) return prev;
                  //       const ret = Object.assign({}, prev, {
                  //         viewer: {
                  //           ...prev.viewer,
                  //           followers: {
                  //             nodes: [
                  //               ...prev.viewer.followers.nodes,
                  //               ...fetchMoreResult.viewer.followers.nodes
                  //             ],
                  //             pageInfo:
                  //               fetchMoreResult.viewer.followers.pageInfo,
                  //             __typename:
                  //               fetchMoreResult.viewer.followers.__typename
                  //           }
                  //         }
                  //       });
                  //       return ret;
                  //     }
                  //   });
                  // }
                }}
              />

              {others.map(node => (
                <ForceGraphNode
                  key={node.id}
                  fill={`url(#avatar-${node.id})`}
                  node={{ ...node, id: node.login, radius: 5 }}
                  onClick={this.cF(node.login, null, null, client)}
                />
              ))}

              {others.map(link => (
                <ForceGraphLink
                  key={`follwoing:${link.login}`}
                  link={{
                    source: data.viewer.login,
                    target: link.login,
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
  query Network($first: Int, $after: String) {
    viewer {
      id
      login
      name
      avatarUrl
      createdAt
      __typename
      followers(first: $first, after: $after) {
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
      following(first: $first, after: $after) {
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
        }
      }
    }
  }
`;

export default Network;
