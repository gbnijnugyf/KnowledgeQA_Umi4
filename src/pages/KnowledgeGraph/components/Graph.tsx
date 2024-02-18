import { selectNode } from '@/action';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
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

interface IGraphProps {
  nodes: dNode[];
  links: dLink[];
  color: string;
  select: (node: SelectNodeType) => void;
  width: number;
  height: number;
}

export function Graph(props: IGraphProps) {
  const ref = useRef();
  const containerRef = useRef();
  const radius = 15;
  // const width = 1000;
  // const height = 600;

  const width = props.width;
  const height = props.height;

  // const drag = (simulation: any) => {
  //   function dragstarted(event: { active: any }, d: { fx: any; x: any; fy: any; y: any }) {
  //     if (!event.active) simulation.alphaTarget(0.3).restart();
  //     d.fx = d.x;
  //     d.fy = d.y;
  //   }

  //   function dragged(event: { x: any; y: any }, d: { fx: any; fy: any }) {
  //     d.fx = event.x;
  //     d.fy = event.y;
  //   }

  //   function dragended(event: { active: any }, d: { fx: null; fy: null }) {
  //     if (!event.active) simulation.alphaTarget(0);
  //     d.fx = null;
  //     d.fy = null;
  //   }

  //   return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  // };
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

    // 更新图形的函数
    function updateGraph(scaleLevel: number) {
      // 根据缩放级别决定显示或隐藏节点和边,组别从1开始
      node.style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'));
      nodeText.style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'));
      link.style('display', (l: dLink) =>
        l.source.group <= scaleLevel && l.target.group <= scaleLevel ? 'inline' : 'none',
      );
    }

    // 创建一个缩放行为
    const zoom = d3
      .zoom()
      .scaleExtent([0.25, 2.5])
      .on('zoom', (event: any) => {
        container_.attr('transform', event.transform);

        // 当用户放大或缩小时，调用自定义函数
        // let scaleLevel = Math.floor(event.transform.k);
        let scaleLevel = event.transform.k*4;
        console.log('scaleLevel:', scaleLevel);
        updateGraph(scaleLevel);
      });

    svg.call(zoom);

    svg.attr('width', width).attr('height', height);

    svg
      .append('defs')
      .selectAll('marker')
      .data(['end']) // Different link/path types can be defined here
      .enter()
      .append('marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    const simulation = d3
      .forceSimulation(nodeHandle)
      .force(
        'link',
        d3
          .forceLink(linkHandle)
          .id((d: dNode) => d.name)
          .distance(80),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collide',
        d3
          .forceCollide()
          .radius(function (d: dNode) {
            return d.weight + 0.5;
          })
          .iterations(2),
      );

    const node = container_
      .append('g')
      .selectAll('circle')
      .data(nodeHandle)
      .join('circle')
      .attr('r', (d: dNode) => d.weight)
      .attr('fill', '#f00')
      .attr('fill', (d: dNode) => color(d.group)) // 使用比例尺设置颜色
      // .call(drag(simulation))
      .on('click', function (_event: any, d: dNode) {
        // 在这里处理点击事件
        let selectedNode: SelectNodeType = {
          sNode: d,
          links: [],
          tNodes: [],
        };
        // 打印节点的数据
        console.log('Node data:', d);
        // 打印与节点直接连接的边的数据，以及与这些边直接连接的其他节点的数据
        link.each(function (l: dLink) {
          if (l.source === d || l.target === d) {
            selectedNode.links.push(l);
            selectedNode.tNodes.push(l.source === d ? l.target : l.source);
            console.log('Connected link data:', l);
            console.log('Connected node data:', l.source === d ? l.target : l.source);
          }
        });
        props.select(selectedNode);
      })
      .on('mouseover', function (this: any, _event: any, d: dNode) {
        // 高亮显示所选节点
        d3.select(this).style('fill', props.color === 'white' ? 'yellow' : 'red');

        // 高亮显示与所选节点直接连接的边
        link.style('stroke', function (l: dLink) {
          if (l.source === d || l.target === d) {
            return props.color === 'white' ? 'yellow' : 'red';
          } else {
            return '#999';
          }
        });
        link.style('stroke-width', function (l: dLink) {
          if (l.source === d || l.target === d) {
            return Math.sqrt(l.weight) * 3;
          } else {
            return Math.sqrt(l.weight);
          }
        });
      })
      .on('mouseout', function (this: any, _event: any, d: dNode) {
        // 恢复所选节点的颜色
        d3.select(this).style('fill', color(d.group));

        // 恢复所有边的颜色
        link.style('stroke', '#999');
        link.style('stroke-width', (l: dLink) => Math.sqrt(l.weight));
      });

    const link = container_
      .append('g')
      .selectAll('line')
      .data(linkHandle)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: dLink) => Math.sqrt(d.weight))
      .attr('marker-end', 'url(#end)');

    const nodeText = container_
      .append('g')
      .selectAll('text')
      .data(nodeHandle)
      .join('text')
      // .call(drag(simulation))
      .text((d: dNode) => d.name)
      .attr('fill', () => props.color)
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
    // 设置初始缩放级别为3
    zoom.scaleTo(svg, 0.25);
    // Clean up event listener on unmount
    // return () => window.removeEventListener('resize', handleResize);
  }, [props.nodes, props.links, props.color, width, height]);

  return (
    <div ref={containerRef as any} style={{ display: 'flex', justifyContent: 'center' }}>
      <svg ref={ref as any} />
    </div>
  );
}

const mapDispatchToProps = {
  select: selectNode,
};

export default connect(null, mapDispatchToProps)(Graph);
