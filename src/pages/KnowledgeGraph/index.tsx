import { myGetGraph } from '@/services/ant-design-pro/api';
import { API } from '@/services/ant-design-pro/typings';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import defaultSettings from '../../../config/defaultSettings';
import { SelectTtile } from '../ChatPage/components/SelectTitle';
import { Edit } from './components/Edit';
import { Graph, dLink, dNode } from './components/Graph';

export type SelectNodeType = {
  sNode: dNode;
  links: Array<dLink>;
  tNodes: Array<dNode>;
};

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
  const [color, setColor] = useState<string>('black');
  const { initialState } = useModel('@@initialState');
  const [selectedNode, setSelectedNode] = useState<SelectNodeType | undefined>();
  const handleNodeClick = (node: SelectNodeType) => {
    setSelectedNode(node);
  };
  const handleHideEdit = () => {
    setSelectedNode(undefined);
  };
  const handleAddNode = () => {};
  const handleDeleteNode = () => {};

  useEffect(() => {
    const setting = initialState?.settings || defaultSettings;
    if (setting.navTheme === 'realDark') {
      console.log('dark');
      setColor('white');
    } else {
      setColor('black');
    }
  }, [initialState]);

  // 从后端获取知识图谱数据
  useEffect(() => {
    if (knowledgeBaseKey === -1) {
      return;
    }
    setSelectedNode(undefined);
    // 获取知识图谱数据
    myGetGraph({ key: knowledgeBaseKey }).then((res) => {
      console.log(res);
      setGraphInfo({
        nodes: res.data.nodes,
        links: res.data.links,
      });
      // setGraphInfo(res.data);
    });
  }, [knowledgeBaseKey]);

  return (
    <PageContainer>
      <Card
        title={
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ marginRight: '1%' }}>选择知识库:</div>
              <SelectTtile setKey={setKnowledgeBaseKey} />
            </div>
            <div>
              <Button onClick={handleAddNode}>添加节点</Button>
              <Button onClick={handleDeleteNode}>删除节点</Button>
              {selectedNode !== undefined ? (
                <Button onClick={handleHideEdit}>关闭编辑</Button>
              ) : null}
            </div>
          </div>
        }
        style={{ width: '100%', margin: '0', minHeight: '70vh', overflowY: 'hidden' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="graphOutter" style={{ flex: selectedNode ? 2 : 2 }}>
            <Graph
              color={color}
              nodes={graphInfo.nodes}
              links={graphInfo.links}
              select={handleNodeClick}
              width={800}
              height={580}
            />
          </div>
          {selectedNode && (
            <div style={{ flex: 1 }}>
              <Edit node={selectedNode} />
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default KnowledgeGraph;
