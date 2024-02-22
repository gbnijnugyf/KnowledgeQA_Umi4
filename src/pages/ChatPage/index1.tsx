import {
  deleteMessage,
  getHistoryMessage,
  myGetDialogs,
  myGetRecommendedInput,
  sendMessage,
} from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import { debounce } from '@/services/plugin/utils';
import {
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { AutoComplete, Avatar, Button, Card, Dropdown, List, Menu, Tooltip, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { DelDialogModal } from './components/DelDialog';
import { EditDialogModal } from './components/EditDialog';
import { NewDialogPage } from './components/NewDialogPage';
import './index.css';
type IMessage = API.MessageType;
const messageInit: IMessage = {
  key: -1,
  sender: 'user',
  text: '',
};
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState<IMessage>(messageInit);
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
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const scrollToBottom = () => {
    let chatBox = document.getElementById('dialogList');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  useEffect(scrollToBottom, [messages]); // 当 messages 发生变化时，滚动到底部

  useEffect(() => {
    // 这是一个假设的函数，你应该替换为你的实际函数
    myGetRecommendedInput({ text: inputValue.text }).then((res) => {
      console.log(res);
      setRecommendations(res.data);
    });
  }, [inputValue]);

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
    const hide = message.loading('正在获取对话列表...');
    myGetDialogs({}).then((res) => {
      hide();
      if (res.status === 1) {
        const newItem: API.DialogListItem = {
          key: -1,
          name: '新建对话',
          updatedAt: '',
          Kbase: [],
        };
        res.data.push(newItem);
        setDialogs(res.data);
        message.success('获取对话列表成功');

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

  // 删除某条消息
  const handleDeleteMessage = (key: number) => {
    deleteMessage(key).then((res) => {
      if (res.status === 1) {
        setMessages((prevMessages) => {
          return prevMessages.filter((i) => i.key !== key);
        });
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
  };

  // 输入框改变时的处理函数
  const handleChange = (e: string) => {
    console.log(e);
    const value: IMessage = { key: -1, sender: 'user', text: e };
    setInputValue(value);
  };

  // 发送消息
  const handleSend = async () => {
    if (currentDialogKey === -1 || currentDialogKey === null) {
      message.warning('请选择知识库');
      return;
    }
    if (inputValue.text !== '') {
      setMessages([...messages, inputValue, { key: -1, sender: 'bot', text: '正在生成回复...' }]);
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
          const setMessageBackFunc = debounce(
            () =>
              setMessages((prevMessages) => {
                // 替换最后一条消息
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = {
                  key: res.data.key,
                  sender: 'bot',
                  text: res.data.text,
                  recommend: res.data.recommend,
                };
                return newMessages;
              }),
            1000,
          );
          setMessageBackFunc();
          // setMessages((prevMessages) => {
          //   // 替换最后一条消息
          //   const newMessages = [...prevMessages];
          //   newMessages[newMessages.length - 1] = {
          //     key: res.data.key,
          //     sender: 'bot',
          //     text: res.data.text,
          //     recommend: res.data.recommend,
          //   };
          //   return newMessages;
          // });
          setInputValue(messageInit);
        } else {
          setMessages((prevMessages) => {
            // 删除最后两条消息
            return prevMessages.slice(0, -2);
          });
          message.error('发送失败,请重试！');
        }
      } catch (error) {
        console.error(error);
        setMessages((prevMessages) => {
          // 删除最后一条消息
          return prevMessages.slice(0, -1);
        });
        message.error('获取回复失败');
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
          height: '71vh',
          display: 'flex',
          flexDirection: 'column',
          // overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 对话框列表 */}
          <div style={{ width: '20%', marginRight: '0.5%', overflowY: 'auto', maxHeight: '71vh' }}>
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
          {currentDialogKey !== -1 && currentDialogKey !== null ? (
            <>
              <div
                style={{
                  position: 'relative',
                  flex: selectedRecommendation ? 1 : 2,
                  overflowY: 'auto',
                  height: '59vh',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    height: '59vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <List
                    dataSource={messages}
                    id="dialogList"
                    className="dialog-list"
                    style={{ overflow: 'auto', paddingRight: '1vw' }}
                    renderItem={(item) => (
                      <Tooltip
                        title={
                          <div>
                            <CopyToClipboard
                              text={item.text}
                              onCopy={() => message.success('已复制')}
                            >
                              <Button icon={<CopyOutlined />} />
                            </CopyToClipboard>
                            <Button
                              style={{ marginLeft: '0.5vw' }}
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteMessage(item.key)}
                            />
                          </div>
                        }
                        placement="top"
                        overlayStyle={{ margin: '-1vh' }}
                      >
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
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                              }}
                            >
                              <div
                                className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/
                              >
                                {item.text}
                              </div>
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
                      </Tooltip>
                    )}
                  />
                  {currentDialogKey !== -1 && currentDialogKey !== null ? (
                    <div
                      style={{
                        // marginTop: '10vh',
                        top: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <AutoComplete
                        placeholder="ctrl+enter发送"
                        options={recommendations?.map((rec) => ({ value: rec }))}
                        value={inputValue.text}
                        onChange={handleChange}
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                          if (event.key === 'Enter' && event.ctrlKey) {
                            handleSend();
                          }
                        }}
                        style={{ marginRight: '8px', flex: 1 }}
                      />
                      <Button type="primary" onClick={handleSend} >
                        发送
                      </Button>
                    </div>
                  ) : null}
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
              style={{
                height: '100%',
                width: '80%',
                justifyContent: 'center',
                display: 'flex',
                overflow: 'hidden',
              }}
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
