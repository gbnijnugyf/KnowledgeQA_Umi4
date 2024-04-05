import echarts from 'echarts';
import { useEffect, useRef } from 'react';
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

export function GraphEcharts(props: IGraphProps) {
  const chartRef = useRef(null);
  const initNode: dNode = { id: -1, name: '', group: 0, weight: 15 };

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const nodes = props.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      group: node.group,
      symbolSize: node.weight,
      itemStyle: { color: node.group > 1 ? 'hidden' : null },
      label: {
        show: true, // show labels
        formatter: node.name, // use node's name as label
      },
    }));

    const links = props.links.map((link) => ({
      // source: props.nodes.find((d: dNode) => d.id === link.source_id) ?? initNode,
      // target: props.nodes.find((d: dNode) => d.id === link.target_id) ?? initNode,
      source: link.source_id,
      target: link.target_id,
      name: link.name,
      lineStyle: { width: link.weight },
    }));

    const option = {
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          data: nodes,
          links: links,
          roam: true,
          force: {
            // initLayout: 'circular',
            // gravity: 0,
            repulsion: 100,
            edgeLength: 5,
          },
          edgeLabel: {
            show: true,
            formatter: function (params:any) {
              // console.log('params:', params);
              // console.log('params.data:', params);
              return params.data.name;
            },
          },
        },
      ],
    };
    // Add zoom event listener
    // chartInstance.on('graphRoam', function (params:any) {
    //   const zoomLevel = params.zoom;
    //   console.log('zoomLevel:', zoomLevel);
    //   // const newNodes = nodes.map((node) => {
    //   //   // Modify the color or visibility of the node based on the zoom level and the node's group
    //   //   if (node.group <= zoomLevel) {
    //   //     return { ...node, itemStyle: { color: null }, label: { show: true, formatter: node.name } };
    //   //   } else {
    //   //     return { ...node, symbolSize:0, label: { show: false } };
    //   //   }
    //   // });
    //   // chartInstance.setOption({ series: [{ data: newNodes }] });
    // });
    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [props.nodes, props.links]);

  return <div ref={chartRef} style={{ width: props.width, height: props.height }}></div>;
}

export default GraphEcharts;
