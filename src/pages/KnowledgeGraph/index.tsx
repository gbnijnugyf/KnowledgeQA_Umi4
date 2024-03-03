import { myGetGraph } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useModel } from '@umijs/max';
import { Button, Card } from 'antd';
import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import defaultSettings from '../../../config/defaultSettings';
import { SelectTtile } from '../ChatPage/components/SelectTitle';
import { Edit } from './components/Edit';
import { Graph, dLink, dLink_, dNode } from './components/Graph';
import GraphEcharts from './components/GraphPlus2';
import { GraphPlus1 } from './components/GraphPlus1';

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

const linksInit: dLink_[] = [
  { source_id: 1, target_id: 2, weight: 1, name: '知识关联' },
  { source_id: 2, target_id: 3, weight: 1, name: '知识关联' },
  // 更多链接...
];

const KnowledgeGraph: React.FC = () => {
  const location = useLocation();
  const record = parse(location.search.substring(1));

  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<number>(
    record.key ? parseInt(record.key as string) : -1,
  );
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
    // myGetCourse({ key: knowledgeBaseKey }).then((res) => {
    //   setBaseTitle(res.data.name);
    // }
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
    <PageContainer
      header={{
        title: null,
      }}
    >
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
              {location.pathname !== '/graph' ? (
                <SelectTtile<number> setKey={setKnowledgeBaseKey} />
              ) : (
                <div>{record.name}</div>
              )}
            </div>
            <div>
              {/* <Button onClick={handleAddNode}>添加节点</Button>
              <Button onClick={handleDeleteNode}>删除节点</Button> */}
              {selectedNode !== undefined ? (
                <Button onClick={handleHideEdit}>关闭描述</Button>
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
              width={location.pathname === '/graph' ? 1300 : 800}
              height={location.pathname === '/graph' ? 700 : 580}
            />
            {/* <GraphEcharts nodes={graphInfo.nodes} links={graphInfo.links} color={color} select={handleNodeClick} width={1300} height={700} /> */}
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
