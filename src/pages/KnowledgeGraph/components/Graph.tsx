import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

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

interface IGraphProps {
  nodes: dNode[];
  links: dLink[];
}

export function Graph(props: IGraphProps) {
  const ref = useRef();
  const containerRef = useRef();
  const radius = 15;
  const width = 1200;
  const height = 600;

  const drag = (simulation: any) => {
    function dragstarted(event: { active: any }, d: { fx: any; x: any; fy: any; y: any }) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: { x: any; y: any }, d: { fx: any; fy: any }) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: { active: any }, d: { fx: null; fy: null }) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  };
  // 创建一个颜色比例尺
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    const nodeHandle = props.nodes;
    console.log('Graph render start:', nodeHandle);
    const linkHandle: dLink[] = props.links.map((link) => {
      return {
        source: nodeHandle.find((d: dNode) => d.id === link.source.id) ?? initNode,
        target: nodeHandle.find((d: dNode) => d.id === link.target.id) ?? initNode,
        weight: link.weight,
        name: link.name,
      };
    });

    // 清除旧的图形元素
    d3.select(ref.current).selectAll('*').remove();
    if (!containerRef.current) {
      return;
    }
    const svg = d3.select(ref.current);
    // 创建一个g元素来包含所有的节点和边
    const container_ = svg.append('g');
    // 创建一个缩放行为
    const zoom = d3.zoom().on('zoom', (event: any) => {
      container_.attr('transform', event.transform);
    });
    svg.call(zoom);
    svg.attr('width', width).attr('height', height);

    const simulation = d3
      .forceSimulation(nodeHandle)
      .force(
        'link',
        d3
          .forceLink(linkHandle)
          .id((d: dNode) => d.name)
          .distance(150),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));


    const node = container_
      .append('g')
      .selectAll('circle')
      .data(nodeHandle)
      .join('circle')
      .attr('r', (d: dNode) => d.weight)
      .attr('fill', '#f00')
      .attr('fill', (d: dNode) => color(d.group)) // 使用比例尺设置颜色
      .call(drag(simulation))
      .on('click', function (_event: any, d: dNode) {
        // 在这里处理点击事件
        // console.log(event, d)
        console.log(`Node ${d.id} was clicked.`);
      });

    const link = container_
      .append('g')
      .selectAll('line')
      .data(linkHandle)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: dLink) => Math.sqrt(d.weight));

    const nodeText = container_
      .append('g')
      .selectAll('text')
      .data(nodeHandle)
      .join('text')
      .call(drag(simulation))
      .text((d: dNode) => d.name)
      .on('click', function (_event: any, d: dNode) {
        // 在这里处理点击事件
        // console.log(event, d)
        console.log(`Node ${d.id} was clicked.`);
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: dLink) => d.source.x)
        .attr('y1', (d: dLink) => d.source.y)
        .attr('x2', (d: dLink) => d.target.x)
        .attr('y2', (d: dLink) => d.target.y);

      // linkText
      //   .attr('x', (d: dLink) => ((d.source.x as number) + (d.target.x as number)) / 2)
      //   .attr('y', (d: dLink) => ((d.source.y as number) + (d.target.y as number)) / 2);

      node.attr('cx', (d: dNode) => d.x).attr('cy', (d: dNode) => d.y);

      nodeText.attr('x', (d: dNode) => d.x).attr('y', (d: dNode) => d.y);
    });
  }, [props.nodes, props.links]);

  return (
    <div ref={containerRef as any} style={{ width: '100%', height: '100%' }}>
      <svg ref={ref as any} />
    </div>
  );
}
