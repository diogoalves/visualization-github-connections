import React, { Component } from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import { scaleCategory20 } from 'd3-scale';

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

const merge = (a, b, key = 'id') => a.filter( elem => !b.find( subElem => subElem[key] === elem[key])).concat(b);

// TODO ux add photos in circles
// TODO adds graphql
// TODO adds simple query
// TODO adds input do change user
class App extends Component {
  render() {
    const scale = scaleCategory20();
    const others = merge(graphql.data.viewer.following.nodes, graphql.data.viewer.followers.nodes);
    console.log(others)
    return (
      <InteractiveForceGraph  zoom
      zoomOptions={{minScale: 1, maxScale: 6, onZoom: () => console.log('zoomed'), onPan: () => console.log('panned')}}
        highlightDependencies
        simulationOptions={{ animate: true }}
        onSelectNode={() => console.log('node selected')}
        onDeselectNode={() => console.log('node deselected')}
      >
        <defs>
          <filter id="image">
            <feImage href="https://avatars2.githubusercontent.com/u/326518?v=4"/>
          </filter>
        </defs>

    <defs>
        <clipPath id="circleView">
            <circle cx="250" cy="125" r="125" fill="#FFFFFF" />            
        </clipPath>
    </defs>
<image width="500" height="250" href="https://avatars2.githubusercontent.com/u/326518?v=4" clipPath="url(#circleView)" />
    

        <ForceGraphNode
          key={graphql.data.viewer.id}
          fill={scale(1)}
          node={{  id: graphql.data.viewer.login, radius: 10, style: 'filter:url(#image);' }}
        />

        {
         others.map( node => (
            <ForceGraphNode
              key={node.id}
              fill={scale(3)}
              node={{ ...node, id: node.login , radius: 5 }}
            />
          ))
        }

        {
          others.map( link => (
            <ForceGraphLink
              key={`follwoing:${link.login}`}
              link={{ source: graphql.data.viewer.login, target: link.login , value: 1 }}
            />
          ))
        }

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
