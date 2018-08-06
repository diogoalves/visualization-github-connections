import React, { Component, cloneElement  } from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import { scaleCategory20 } from 'd3-scale';

import lesMisJSON from './les-miserables.json';
import './demo-styles.css';

function attachEvents(child) {
  return cloneElement(child, {
    onMouseDown: () => console.log(`clicked <${child.type.name} />`),
    onMouseOver: () => console.log(`hovered <${child.type.name} />`),
    onMouseOut: () => console.log(`blurred <${child.type.name} />`),
  });
}


class App extends Component {
  render() {
    const scale = scaleCategory20();

    return (
      <InteractiveForceGraph
        highlightDependencies
        simulationOptions={{ animate: true }}
        onSelectNode={() => console.log('node selected')}
        onDeselectNode={() => console.log('node deselected')}
      >
        {lesMisJSON.nodes.map(node => (
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
        )).map(attachEvents)}
      </InteractiveForceGraph>
    );
  }
}

export default App;
