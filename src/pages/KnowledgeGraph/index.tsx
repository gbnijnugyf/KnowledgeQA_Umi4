import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import { useState } from 'react';
import { SelectTtile } from '../ChatPage/components/SelectTitle';
import { Graph, dLink, dNode } from './components/Graph';

const KnowledgeGraph: React.FC = () => {
  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<number>(-1);

  const nodes: dNode[] = [
    { id: 'node1', name: '知识点1', group: 1 },
    { id: 'node2', name: '知识点2', group: 1 },
    { id: 'node3', name: '知识点3', group: 2 },
    // 更多节点...
  ];

  const links: dLink[] = [
    { source: nodes[0], target: nodes[1], value: 1, type: '知识关联', name: '知识关联' },
    { source: nodes[1], target: nodes[2], value: 1, type: '知识关联', name: '知识关联' },
    // 更多链接...
  ];
  // const nodes = [];
  // const links = [];

  // 创建50个节点
  for (let i = 1; i <= 50; i++) {
    nodes.push({ id: `node${i}`, name: `知识点${i}`, group: (i % 8) + 1 });
  }

  // 创建100个链接
  for (let i = 0; i < 100; i++) {
    const sourceIndex = i % nodes.length;
    const targetIndex = (i + 1) % nodes.length;
    links.push({
      source: nodes[sourceIndex],
      target: nodes[targetIndex],
      value: 1,
      type: '知识关联',
      name: '知识关联',
    });
  }

  return (
    <PageContainer>
      <Card
        title={<SelectTtile setKey={setKnowledgeBaseKey} />}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Graph nodes={nodes} links={links} />
      </Card>
    </PageContainer>
  );
};

export default KnowledgeGraph;
