import React, { Component } from 'react';
import {
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphLink
} from 'react-vis-force';

// import lesMisJSON from './les-miserables.json';
import graphql from './graphql.json';

import './demo-styles.css';

// function attachEvents(child) {
//   return cloneElement(child, {
//     onMouseDown: () => console.log(`clicked <${child.type.name} />`),
//     onMouseOver: () => console.log(`hovered <${child.type.name} />`),
//     onMouseOut: () => console.log(`blurred <${child.type.name} />`),
//   });
// }

const merge = (a, b, key = 'id') =>
  a.filter(elem => !b.find(subElem => subElem[key] === elem[key])).concat(b);

// TODO ADD MATERIAL.UI
// TODO add a button to login/logout in github
// TODO add login in github
// TODO adds graphql
// TODO adds simple query
// TODO adds input do change user
class App extends Component {
  render() {
    const others = merge(
      graphql.data.viewer.following.nodes,
      graphql.data.viewer.followers.nodes
    );
    return (
      <InteractiveForceGraph
        zoom
        zoomOptions={{
          minScale: 1,
          maxScale: 6,
          onZoom: () => console.log('zoomed'),
          onPan: () => console.log('panned')
        }}
        highlightDependencies
        simulationOptions={{ animate: true }}
        onSelectNode={() => console.log('node selected')}
        onDeselectNode={() => console.log('node deselected')}
      >
        <defs>
          <filter id="image">
            <feImage href="https://avatars2.githubusercontent.com/u/326518?v=4" />
          </filter>
        </defs>

        <defs>
          <pattern
            id={`avatar-${graphql.data.viewer.id}`}
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
              href={graphql.data.viewer.avatarUrl}
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
          key={graphql.data.viewer.id}
          fill={`url(#avatar-${graphql.data.viewer.id})`}
          node={{ id: graphql.data.viewer.login, radius: 10 }}
        />

        {others.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={`url(#avatar-${node.id})`}
            node={{ ...node, id: node.login, radius: 5 }}
          />
        ))}

        {others.map(link => (
          <ForceGraphLink
            key={`follwoing:${link.login}`}
            link={{
              source: graphql.data.viewer.login,
              target: link.login,
              value: 1
            }}
          />
        ))}

        {/* {lesMisJSON.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            fill={scale(node.group)}
            node={{ ...node, radius: 5 }}
          />
        )).map(attachEvents)}
        {lesMisJSON.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        )).map(attachEvents)} */}
      </InteractiveForceGraph>
    );
  }
}

export default App;
