import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export interface dNode {
  id: string;
  name: string;
  group: number;
  x?: number;
  y?: number;
  // 更多属性...
}

export interface dLink {
  source: dNode;
  target: dNode;
  value: number;
  type: string;
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
    if (!containerRef.current) {
      return;
    }
    const svg = d3.select(ref.current);
    const container = d3.select(containerRef.current);
    // 创建一个g元素来包含所有的节点和边
    const container_ = svg.append('g');

    // 创建一个缩放行为
    const zoom = d3.zoom().on('zoom', (event:any) => {
      container_.attr('transform', event.transform);
    });

    const width = parseInt(container.style('width'), 10) * 10;
    const height = parseInt(container.style('height'), 10) * 8;
    svg.call(zoom);
    svg.attr('width', width).attr('height', height);
    const simulation = d3
      .forceSimulation(props.nodes)
      .force(
        'link',
        d3
          .forceLink(props.links)
          .id((d: dNode) => d.id)
          .distance(150),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = container_
      .append('g')
      .selectAll('line')
      .data(props.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: dLink) => Math.sqrt(d.value));

    // const linkText = container_
    //   .append('g')
    //   .selectAll('text')
    //   .data(props.links)
    //   .join('text')
    //   .text((d: dLink) => d.name);

    const node = container_
      .append('g')
      .selectAll('circle')
      .data(props.nodes)
      .join('circle')
      .attr('r', radius)
      .attr('fill', '#f00')
      .attr('fill', (d: dNode) => color(d.group)) // 使用比例尺设置颜色
      .call(drag(simulation));

    const nodeText = container_
      .append('g')
      .selectAll('text')
      .data(props.nodes)
      .join('text')
      .call(drag(simulation))
      .text((d: dNode) => d.name);

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
    <div
      ref={containerRef as any}
      style={{ border: '1px solid red', width: '100%', height: '100%' }}
    >
      <svg ref={ref as any} />
    </div>
    // <svg ref={ref} style={{border:'1px solid red'}} />
  );
}
