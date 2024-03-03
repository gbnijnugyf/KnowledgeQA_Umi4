import React, { useEffect } from 'react';
import { D3ForceGraph } from 'd3-force-graph';
import { SelectNodeType } from '..';


export interface dNode {
  id: number;
  name: string;
  group: number;
  weight: number;
  x?: number;
  y?: number;
  // 更多属性...
}
const initNode: dNode = { id: -1, name: '', group: 0, weight: 15 };
export interface dLink {
  source: dNode;
  target: dNode;
  weight: number;
  name?: string;
  // 更多属性...
}
export interface dLink_ {
  source_id: number;
  target_id: number;
  weight: number;
  name?: string;
  // 更多属性...
}
interface IGraphProps {
  nodes: dNode[];
  links: dLink_[];
  color: string;
  select: (node: SelectNodeType) => void;
  width: number;
  height: number;
}

export function GraphPlus1(props: IGraphProps) {
  let chart;
  useEffect(() => {
    let $container = document.getElementById('container');
    let testDataNodes = props.nodes.map((node) => {
      return {
        id: node.id.toString(),
        name: node.name,
        // group: node.group,
        // weight: node.weight,
      };
    });
    let testDataLinks = props.links.map((link) => {
      return {
        source: (link.source_id ||-1).toString(),
        target: (link.target_id||-1).toString(),
      };
    })
    console.log(testDataNodes);
    console.log(testDataLinks);
    let testData = {
      nodes: testDataNodes,
      links: testDataLinks,
    };
    // let testData = {
    //   nodes: [
    //     {
    //       id: 'TestNodeA',
    //       name: 'TestNodeA',
    //     },
    //     {
    //       id: 'TestNodeB',
    //       name: 'TestNodeA',

    //     },
    //   ],
    //   links: [
    //     {
    //       source: 'TestNodeA',
    //       target: 'TestNodeB',
    //     },
    //   ],
    // };
    chart = new D3ForceGraph($container, testData, {
      width: 1200,
      height: 800,
    });
  }, [props]);

  return <div id="container"></div>;
}
