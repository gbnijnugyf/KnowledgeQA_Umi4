import { getHistoryMessage, myGetDialogs, sendMessage } from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import {
  CopyOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Dropdown, Input, List, Menu, message } from 'antd';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { DelDialogModal } from './components/DelDialog';
import { EditDialogModal } from './components/EditDialog';
import { NewDialogPage } from './components/NewDialogPage';
import './index.css';
type IMessage = API.MessageType;
const messageInit: IMessage = {
  sender: 'user',
  text: '',
};
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState<IMessage>(messageInit);
  const [loading, setLoading] = useState(false); // 新的状态变量
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const [flush, setFlush] = useState<boolean>(false);
  const [dialogs, setDialogs] = useState<API.DialogListItem[]>([]);
  const [currentDialogKey, setCurrentDialogKey] = useState<number | null>(null);
  const [deleteDialogModal, setDeleteDialogModal] = useState<boolean>(false);
  const [editDialogModal, setEditDialogModal] = useState<boolean>(false);
  const [operateDialogKey, setOperateDialogKey] = useState<{ key: number; name: string }>({
    key: -1,
    name: '',
  });

  // 删除对话框
  const handleDeleteDialog = (key: number, name: string) => {
    setOperateDialogKey({ key, name });
    setDeleteDialogModal(true);
  };

  // 编辑对话框
  const handleEditDialog = (key: number, name: string) => {
    setOperateDialogKey({ key, name });
    setEditDialogModal(true);
  };

  // 获取所有对话框
  useEffect(() => {
    myGetDialogs({}).then((res) => {
      if (res.status === 1) {
        const newItem: API.DialogListItem = {
          key: -1,
          name: '新建对话',
          updatedAt: '',
          Kbase: [],
        };
        res.data.push(newItem);
        setDialogs(res.data);
        setCurrentDialogKey(null);
        setMessages([]);
      } else {
        message.error('获取对话列表失败,请重试！');
      }
    });
  }, [flush]);

  // 当前对话框改变时，获取对应的对话内容
  useEffect(() => {
    if (currentDialogKey !== null && currentDialogKey !== -1) {
      getHistoryMessage({ key: currentDialogKey }).then((res) => {
        if (res.status === 1) {
          setMessages(res.data);
        } else {
          message.error('获取对话失败,请重试！');
        }
      });
    }
  }, [currentDialogKey]);

  // 点击对话框时的处理函数
  const handleDialogClick = (key: number) => {
    setCurrentDialogKey(key);
  };

  const handleRecommendationClick = (recommendation: string) => {
    setSelectedRecommendation(recommendation);
  };
  const handleHidePreview = () => {
    setSelectedRecommendation('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: IMessage = { sender: 'user', text: e.target.value };
    setInputValue(value);
  };

  const handleSend = async () => {
    if (currentDialogKey === -1 || currentDialogKey === null) {
      message.warning('请选择知识库');
      return;
    }
    if (inputValue.text !== '') {
      setLoading(true); // 开始加载
      setMessages([...messages, inputValue, { sender: 'bot', text: '正在生成回复...' }]);
      try {
        const res = await Promise.race([
          sendMessage({ key: currentDialogKey, text: inputValue.text }) as Promise<
            IReturn<API.MessageType>
          >,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000), // 5秒超时
          ) as Promise<any>,
        ]);
        if (res.status === 1) {
          setMessages((prevMessages) => {
            // 替换最后一条消息
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { sender: 'bot', text: res.data.text };
            return newMessages;
          });
          setInputValue(messageInit);
        } else {
          message.error('发送失败,请重试！');
        }
      } catch (error) {
        console.error(error);
        setMessages((prevMessages) => {
          // 删除最后一条消息
          return prevMessages.slice(0, -1);
        });
        message.error('获取回复失败');
      } finally {
        setLoading(false); // 加载完成
      }
    }
  };

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
              <div style={{ marginRight: '1%' }}>
                {currentDialogKey === null
                  ? '请选择对话'
                  : currentDialogKey === -1
                  ? '新建对话'
                  : dialogs.find((i) => i.key === currentDialogKey)?.name}
              </div>
            </div>
            {selectedRecommendation !== '' ? (
              <Button onClick={handleHidePreview}>关闭预览</Button>
            ) : null}
          </div>
        }
        style={{
          width: '100%',
          margin: '0',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 对话框列表 */}
          <div style={{ width: '20%', marginRight: '0.5%' }}>
            <Menu
              onClick={({ key }) => handleDialogClick(Number(key))}
              style={{ width: '100%' }}
              mode="inline"
            >
              {dialogs.map((dialog) => (
                <Menu.Item
                  key={dialog.key}
                  icon={dialog.key === -1 ? <PlusCircleOutlined /> : undefined}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {dialog.name}
                    {dialog.key !== -1 ? (
                      <Dropdown
                        menu={{
                          onClick: ({ key }) => {
                            switch (key) {
                              case 'delete':
                                handleDeleteDialog(dialog.key, dialog.name);
                                break;
                              case 'edit':
                                handleEditDialog(dialog.key, dialog.name);
                                break;
                              default:
                                break;
                            }
                          },
                          items: [
                            { key: 'delete', label: '删除' },
                            { key: 'edit', label: '编辑' },
                          ],
                        }}
                        trigger={['hover']}
                      >
                        <Button type="link" icon={<EllipsisOutlined />} />
                      </Dropdown>
                    ) : null}
                  </div>
                </Menu.Item>
              ))}
            </Menu>
          </div>
          {currentDialogKey !== -1 ? (
            <>
              <div style={{ flex: selectedRecommendation ? 1 : 2 }}>
                <List
                  dataSource={messages}
                  style={{ minHeight: '50vh', overflow: 'auto' }}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        display: 'flex',
                        justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                        borderBottom: 'none',
                      }}
                    >
                      {item.sender === 'bot' ? (
                        <Avatar icon={<RobotOutlined />} className="avatar" />
                      ) : null}
                      <div style={{ flexDirection: 'column' }}>
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}
                        >
                          <div
                            className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/
                          >
                            {item.text}
                          </div>
                          {item.sender === 'bot' ? (
                            <CopyToClipboard
                              text={item.text}
                              onCopy={() => message.success('已复制')}
                            >
                              <Button icon={<CopyOutlined />} />
                            </CopyToClipboard>
                          ) : null}
                        </div>
                        <div>
                          {item.recommend && (
                            <ul>
                              {item.recommend.map((recommendation) => (
                                <li
                                  className="recommend-list"
                                  onClick={() => handleRecommendationClick(recommendation)}
                                >
                                  {recommendation}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {item.sender === 'user' ? (
                        <Avatar icon={<UserOutlined />} className="avatar" />
                      ) : null}
                    </List.Item>
                  )}
                />
                <div
                  style={{ marginTop: '14vh', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    placeholder="Type a message"
                    value={inputValue.text}
                    onChange={handleChange}
                    onPressEnter={handleSend}
                    style={{ marginRight: '8px', flex: 1 }}
                  />
                  <Button type="primary" onClick={handleSend} loading={loading}>
                    发送
                  </Button>
                </div>
              </div>
              {selectedRecommendation && (
                <div style={{ flex: 1 }}>
                  {/* 在这里展示预览的文件 */}
                  {/* TODO：ifame仅可展示pdf、txt格式，但后端可将ppt转为pdf */}
                  <iframe
                    width="100%"
                    height="100%"
                    src="http://localhost:8001/static/files/知识图谱融合大模型.pdf"
                    // src="http://localhost:8001/static/files/1.pptx"
                    // src="http://localhost:8001/static/files/2.csv"
                    // src="http://localhost:8001/static/files/3.txt"
                    // src="http://localhost:8001/static/files/4.doc"
                    // src="http://localhost:8001/static/files/5.ppt"
                  ></iframe>
                </div>
              )}
            </>
          ) : (
            <div
              style={{ height: '100%', width: '80%', justifyContent: 'center', display: 'flex' }}
            >
              <NewDialogPage onFlush={{ set: setFlush, value: flush }} />
            </div>
          )}
        </div>
      </Card>
      <DelDialogModal
        key={operateDialogKey.key}
        name={operateDialogKey.name}
        open={{ set: setDeleteDialogModal, value: deleteDialogModal }}
        flush={{ set: setFlush, value: flush }}
      />
      <EditDialogModal
        key={operateDialogKey.key}
        name={operateDialogKey.name}
        open={{ set: setEditDialogModal, value: editDialogModal }}
        flush={{ set: setFlush, value: flush }}
      />
    </PageContainer>
  );
};

export default ChatPage;
