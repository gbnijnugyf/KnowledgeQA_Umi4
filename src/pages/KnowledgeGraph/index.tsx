import { myGetGraph } from '@/services/ant-design-pro/api';
import { API } from '@/services/ant-design-pro/typings';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { SelectTtile } from '../ChatPage/components/SelectTitle';
import { Graph, dLink, dNode } from './components/Graph';

const nodesInit: dNode[] = [
  { id: 1, name: '请选择知识库', group: 1, weight: 15 },
  { id: 2, name: '', group: 1, weight: 15 },
  { id: 3, name: '', group: 2, weight: 15 },
  // 更多节点...
];

const linksInit: dLink[] = [
  { source: nodesInit[0], target: nodesInit[1], weight: 1, name: '知识关联' },
  { source: nodesInit[1], target: nodesInit[2], weight: 1, name: '知识关联' },
  // 更多链接...
];

const KnowledgeGraph: React.FC = () => {
  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<number>(-1);
  const [graphInfo, setGraphInfo] = useState<API.Graph>({
    nodes: nodesInit,
    links: linksInit,
  });

  // 从后端获取知识图谱数据
  useEffect(() => {
    if (knowledgeBaseKey === -1) {
      return;
    }
    // 获取知识图谱数据
    myGetGraph({ key: knowledgeBaseKey }).then((res) => {
      console.log(res);
      flushSync(() => {
        setGraphInfo({
          nodes: res.data.nodes,
          links: res.data.links,
        });
      });
      // setGraphInfo(res.data);
    });
  }, [knowledgeBaseKey]);

  // // 创建节点
  // for (let i = 1; i <= 50; i++) {
  //   nodes.push({ id: `node${i}`, name: `知识点${i}`, group: (i % 8) + 1 });
  // }

  // // 创建链接，每个节点链接到2-5个随机节点
  // for (let i = 0; i < nodes.length; i++) {
  //   const sourceNode = nodes[i];
  //   // 随机选择2-5个连接
  //   const linkCount = Math.floor(Math.random() * 4) + 2;
  //   for (let j = 0; j < linkCount; j++) {
  //     // 随机选择一个目标节点
  //     const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
  //     // 避免自连接
  //     if (sourceNode !== targetNode) {
  //       links.push({ source: sourceNode, target: targetNode, value: 1, name: '知识关联' });
  //     }
  //   }
  // }

  return (
    <PageContainer>
      <Card
        title={<SelectTtile setKey={setKnowledgeBaseKey} />}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Graph nodes={graphInfo.nodes} links={graphInfo.links} />
      </Card>
    </PageContainer>
  );
};

export default KnowledgeGraph;
