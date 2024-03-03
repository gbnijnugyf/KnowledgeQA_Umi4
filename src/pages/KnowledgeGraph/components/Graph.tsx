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

export function Graph(props: IGraphProps) {
  // console.log('Graph render start:', props.nodes);
  const ref = useRef();
  const containerRef = useRef();
  const currentScale = useRef(1);
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
  // 创建一个新的Set来存储隐藏的节点
  let hiddenNodes = new Set<number>();
  // 创建一个新的Set来存储隐藏的边
  let hiddenLinks = new Set<string>();
  // 初始化隐藏的节点和边
  props.nodes.forEach((d: dNode) => {
    if (d.group > 1) {
      hiddenNodes.add(d.id);
    }
  });
  props.links.forEach((l: dLink_) => {
    if (hiddenNodes.has(l.source_id) || hiddenNodes.has(l.target_id)) {
      // buildLinkString(l);
      // console.log('hiddenLinks:', JSON.stringify(l));
      hiddenLinks.add(JSON.stringify(l));
    }
  });

  function deleteLink(l: dLink) {
    const link_1: string = buildLinkString(l);
    const link_2: string = buildLinkString(l, true);
    if (hiddenLinks.has(link_1)) {
      hiddenLinks.delete(link_1);
    } else if (hiddenLinks.has(link_2)) {
      hiddenLinks.delete(link_2);
    }
  }
  // 构建边的字符串
  function buildLinkString(l: dLink, reverse: boolean = false) {
    const link_string: dLink_ = {
      source_id: reverse ? l.target.id : l.source.id,
      target_id: reverse ? l.source.id : l.target.id,
      weight: l.weight,
      name: l.name,
    };
    return JSON.stringify(link_string);
  }
  useEffect(() => {
    const nodeHandle = props.nodes;
    // console.log('Graph render start:', nodeHandle);
    const linkHandle: dLink[] = props.links.map((link) => {
      return {
        source: nodeHandle.find((d: dNode) => d.id === link.source_id) ?? initNode,
        target: nodeHandle.find((d: dNode) => d.id === link.target_id) ?? initNode,
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
    // function updateGraphByZoom(scaleLevel: number) {
    //   currentScale.current = scaleLevel; // 更新当前的缩放级别
    //   // 根据缩放级别决定显示或隐藏节点和边,组别从1开始
    //   node
    //     .style('display', (d: dNode) => {
    //       // TODO: 更新隐藏的节点和边——通过Zoom显示的结点和边也要从hidden集合中删除
    //       if (d.group <= scaleLevel) {
    //         if (hiddenNodes.has(d.id)) {
    //           hiddenNodes.delete(node);
    //         }
    //         return 'inline';
    //       } else {
    //         hiddenNodes.add(node);
    //         return 'none';
    //       }
    //     })
    //     .attr('r', (d: dNode) => d.weight * (2 / scaleLevel));
    //   // 更新 forceManyBody 力的强度
    //   simulation.force('charge', d3.forceManyBody().strength(-30 * scaleLevel));
    //   nodeText
    //     .style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'))
    //     .style('font-size', (d: dNode) => `${d.weight * (1 / scaleLevel)}px`);

    //   // nodeFold.style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'));
    //   link
    //     .style('display', (l: dLink) => {
    //       if (l.source.group <= scaleLevel && l.target.group <= scaleLevel) {
    //         // deleteLink(l);
    //         return 'inline';
    //       } else {
    //         return 'none';
    //       }
    //     })
    //     .attr('stroke-width', (d: dLink) => Math.sqrt(1 / scaleLevel));
    // }
    // 更新图形的函数
    function updateGraphByZoom(scaleLevel: number) {
      // 更新当前的缩放级别
      currentScale.current = scaleLevel;
      // 更新 forceManyBody 力的强度
      // 这里我们使用 1/scaleLevel 作为比例因子，因此当 scaleLevel 增大时，力的强度（即节点间的距离）会减小
      simulation.force('charge', d3.forceManyBody().strength(-50 / scaleLevel));
      // 更新箭头大小，使用 1/scaleLevel 作为比例因子
      d3.selectAll('marker')
        .attr('markerWidth', 15 / scaleLevel)
        .attr('markerHeight', 15 / scaleLevel);
      // 根据缩放级别决定显示或隐藏节点和边,组别从1开始
      node
        .style('display', (d: dNode) => {
          // TODO: 更新隐藏的节点和边——通过Zoom显示的结点和边也要从hidden集合中删除
          if (d.group <= scaleLevel) {
            if (hiddenNodes.has(d.id)) {
              hiddenNodes.delete(node);
            }
            return 'inline';
          } else {
            hiddenNodes.add(node);
            return 'none';
          }
        })
        // 更新节点大小，使用 1/scaleLevel 作为比例因子
        .attr('r', (d: dNode) => d.weight * (3 / scaleLevel));

      nodeText
        .style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'))
        // 更新字体大小，使用 1/scaleLevel 作为比例因子
        .style('font-size', (d: dNode) => `${d.weight * (3 / scaleLevel)}px`);

      // nodeFold.style('display', (d: dNode) => (d.group <= scaleLevel ? 'inline' : 'none'));
      link
        .style('display', (l: dLink) => {
          if (l.source.group <= scaleLevel && l.target.group <= scaleLevel) {
            // deleteLink(l);
            return 'inline';
          } else {
            return 'none';
          }
        })
        // 更新边的粗细，使用 1/scaleLevel 作为比例因子
        .attr('stroke-width', (d: dLink) => {
          return scaleLevel > 8 ? 0 : scaleLevel > 3 ? 0.3 : 0.5;
        });
    }

    function updateGraphByClick() {
      // nodeFold.style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline'));
      nodeText.style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline'));
      node.style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline'));
      link.style('display', (l: dLink) => {
        const link_1: string = buildLinkString(l);
        const link_2: string = buildLinkString(l, true);
        console.log('hiddenLinks:', hiddenLinks);
        console.log('link_1:', link_1);
        return hiddenLinks.has(link_1) || hiddenLinks.has(link_2) ? 'none' : 'inline';
      }); // 根据隐藏的边设置显示或隐藏
    }
    // 创建一个缩放行为
    const zoom = d3
      .zoom()
      .scaleExtent([0.25, 2.5])
      .on('zoom', (event: any) => {
        container_.attr('transform', event.transform);

        // 当用户放大或缩小时，调用自定义函数
        // let scaleLevel = Math.floor(event.transform.k);
        let scaleLevel = event.transform.k * 4;
        currentScale.current === scaleLevel ? null : updateGraphByZoom(scaleLevel);
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
      .style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline')) // 根据隐藏的节点设置显示或隐藏
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
      // .attr('stroke-width', (d: dLink) => Math.sqrt(d.weight))
      .attr('marker-end', 'url(#end)')
      .style('display', (l: dLink) => {
        const link_1: string = buildLinkString(l);
        const link_2: string = buildLinkString(l, true);
        return hiddenLinks.has(link_1) || hiddenLinks.has(link_2) ? 'none' : 'inline';
      }); // 根据隐藏的边设置显示或隐藏

    const nodeText = container_
      .append('g')
      .selectAll('text')
      .data(nodeHandle)
      .join('text')
      // .call(drag(simulation))
      .text((d: dNode) => d.name)
      .attr('fill', () => props.color)
      .style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline'))
      .style('font-size', (d: dNode) => `${d.weight}px`)
      .on('click', function (_event: any, d: dNode) {
        // 在这里处理点击事件
        // console.log(event, d)
        console.log(`Node ${d.id} was clicked.`);
      });

    // const nodeFold = container_
    //   .append('g')
    //   .selectAll('text')
    //   .data(nodeHandle)
    //   .join('text')
    //   .text(() => '...')
    //   .attr('fill', () => props.color)
    //   .style('display', (d: dNode) => (hiddenNodes.has(d.id) ? 'none' : 'inline')) // 根据隐藏的节点设置显示或隐藏
    //   // 在点击图标时，更新节点和边的显示状态
    //   .on('click', function (this: any, _event: any, d: dNode) {
    //     // 找出所有邻接点
    //     const adjacentNodes = linkHandle
    //       .filter((l: dLink) => l.source === d || l.target === d)
    //       .map((l: dLink) => (l.source === d ? l.target : l.source));

    //     console.log('adjacentNodes:', adjacentNodes);
    //     if (d3.select(this).text() === '...') {
    //       adjacentNodes.forEach((node: dNode) => {
    //         if (hiddenNodes.has(node.id)) {
    //           hiddenNodes.delete(node.id);
    //         }
    //         if (hiddenNodes.has(d.id)) {
    //           hiddenNodes.delete(d.id);
    //         }
    //       });
    //       linkHandle.forEach((l: dLink) => {
    //         if (l.source === d || l.target === d) {
    //           deleteLink(l);
    //         }
    //       });
    //       d3.select(this).text(() => 'fold');
    //     } else {
    //       adjacentNodes.forEach((node: dNode) => {
    //         if (!hiddenNodes.has(node.id)) {
    //           hiddenNodes.add(node.id);
    //         }
    //       });
    //       linkHandle.forEach((l: dLink) => {
    //         if (l.source === d || l.target === d) {
    //           const link_: string = buildLinkString(l)
    //           hiddenLinks.add(link_);
    //         }
    //       });
    //       d3.select(this).text(() => '...');
    //     }
    //     updateGraphByClick();
    //   })
    //   .on('mouseover', function (this: any, _event: any, _d: dNode) {
    //     d3.select(this).style('cursor', 'pointer');
    //   });

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
      // nodeFold.attr('x', (d: dNode) => (d.x || 0) - 10).attr('y', (d: dNode) => (d.y || 0) + 14);
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
