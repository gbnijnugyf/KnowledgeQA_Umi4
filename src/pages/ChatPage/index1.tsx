import {
  deleteMessage,
  getHistoryMessage,
  myGetDialogs,
  myGetRecommendedInput,
  reloadMessage,
  sendMessage,
} from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import { debounce } from '@/services/plugin/utils';
import { PageContainer } from '@ant-design/pro-components';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Breadcrumb, Button, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { DelDialogModal } from './components/DelDialog';
import { DialogList } from './components/DialogList';
import { EditDialogModal } from './components/EditDialog';
import { MessageInput } from './components/MessageInput';
import { MessageList } from './components/MessageList';
import { NewDialogPage } from './components/NewDialogPage';
import { RecommendationPreview } from './components/RecommendationPreview';
import './index.scss';
import { useAccess } from '@umijs/max';

const messageInit: API.MessageType = {
  key: -1,
  sender: 'user',
  text: '',
};
// 在 ChatPage 组件中使用这些子组件
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<API.MessageType[]>([]);
  const [inputValue, setInputValue] = useState<API.MessageType>(messageInit);
  const [modeValue, setModeValue] = useState<number>(0);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const [flush, setFlush] = useState<boolean>(false);
  const [dialogs, setDialogs] = useState<API.DialogListItem[]>([]);
  const [currentDialogKey, setCurrentDialogKey] = useState<number | null>(null);
  const [deleteDialogModal, setDeleteDialogModal] = useState<boolean>(false);
  const [editDialogModal, setEditDialogModal] = useState<boolean>(false);
  const [menuDisplay, setMenuDisplay] = useState<boolean>(true);
  const [operateDialogKey, setOperateDialogKey] = useState<{ key: number; name: string }>({
    key: -1,
    name: '',
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [breadItems, setBreadItems] = useState<Array<{ title: string; path?: string }>>([
    {
      path: '/chat',
      title: '问答',
    },
  ]);
  const access = useAccess();//用于改变问答界面布局


  const scrollToBottom = () => {
    let chatBox = document.getElementById('dialogList');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]); // 当 messages 发生变化时，滚动到底部

  useEffect(() => {
    myGetRecommendedInput({ text: inputValue.text, key: currentDialogKey || -1 }).then((res) => {
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
    console.log('currentDialogKey:', currentDialogKey);
    const title = `${
      currentDialogKey === null || currentDialogKey === -1
        ? '新建对话'
        : dialogs.find((i) => i.key === currentDialogKey)?.name
    }`;
    setBreadItems((prev) => [prev[0], { title: title }]);

    if (currentDialogKey !== null && currentDialogKey !== -1) {
      setSelectedRecommendation('');
      setMessages([]);
      setInputValue(messageInit);
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
  // const handleHideMenu = () => {
  //   setMenuDisplay(false);
  // };
  // const handleOpenMenu = () => {
  //   setMenuDisplay(true);
  // };

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
    const value: API.MessageType = { key: -2, sender: 'user', text: e };
    setInputValue(value);
  };
  //模式选择处理函数
  const handleModeChange = (value: number) => {
    setModeValue(value);
  };

  //重新加载信息
  const handleReload = async (key: number) => {
    const res = await reloadMessage({ key: key });
    if (res.status === 1 && res.data.sender === 'bot') {
      console.log(res);
      const newMessages = [...messages];
      const index = newMessages.findIndex((message) => message.key === res.data.key);
      if (index !== -1) {
        // 如果找到了具有相同键的消息，替换它
        newMessages[index] = res.data;
      } else {
        // 如果没有找到具有相同键的消息，找到请求key那个元素的位置并在其后面插入响应消息
        const requestKeyIndex = newMessages.findIndex((message) => message.key === key);
        if (requestKeyIndex !== -1) {
          newMessages.splice(requestKeyIndex + 1, 0, res.data);
        }
      }
      setMessages(newMessages);
    } else {
      message.error('重新加载失败');
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (currentDialogKey === null || currentDialogKey === -1) {
      message.warning('请选择对话');
      return;
    }
    if (inputValue.text !== '') {
      setMessages([...messages, inputValue, { key: -1, sender: 'bot', text: '正在生成回复...' }]);
      try {
        const res = await Promise.race([
          sendMessage({ key: currentDialogKey, text: inputValue.text, mode: modeValue }) as Promise<
            IReturn<API.sendMessageType>
          >,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000), // 5秒超时
          ) as Promise<any>,
        ]);
        if (res.status === 1) {
          const setMessageBackFunc = debounce(() => {
            const prevMessages = [...messages];
            prevMessages.slice(0, -2);
            prevMessages.push({
              key: res.data.userMsgKey,
              sender: 'user',
              text: inputValue.text,
            });
            // 替换最后一条消息
            prevMessages.push({
              key: res.data.reply.key,
              sender: 'bot',
              text: res.data.reply.text,
              recommend: res.data.reply.recommend,
            });
            setMessages(prevMessages);
          }, 500);
          await setMessageBackFunc();
          setInputValue(messageInit);
        } else {
          debounce(() => {
            setInputValue(messageInit);
            // setInputValue(() => inputValue || messageInit);
            setMessages((prevMessages) => {
              // 删除最后一条消息，暂时保存用户发送的，以便重发
              return prevMessages.slice(0, -1);
            });
          }, 1000)();
          message.error('发送失败,请重试！');
        }
      } catch (error) {
        console.error(error);
        debounce(() => {
          setInputValue(messageInit);
          // setInputValue(() => inputValue || messageInit);
          setMessages((prevMessages) => {
            // 删除最后一条消息，暂时保存用户发送的，以便重发
            return prevMessages.slice(0, -1);
          });
        }, 1000)();
        message.error('发送失败，请重试');
      }
    }
  };

  const CardHeight = 80;

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
            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}> */}
            <div style={{ marginRight: '1%' }}>
              <Breadcrumb style={{}} items={breadItems} />
            </div>
            {/* </div> */}
            <div>
              {/* {menuDisplay === true ? (
                <Button onClick={handleHideMenu}>隐藏菜单</Button>
              ) : (
                <Button onClick={handleOpenMenu}>显示菜单</Button>
              )} */}
              {selectedRecommendation !== '' ? (
                <Button onClick={handleHidePreview}>关闭预览</Button>
              ) : null}
            </div>
          </div>
        }
        style={{
          width: '100%',
          margin: '0',
          // height: `${CardHeight}vh`,
          height: 'fit-content',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', height: `${CardHeight - 12}vh` }}>
          <Allotment defaultSizes={[600, 2000]} minSize={0}>
            {/* 对话框列表 */}
            {menuDisplay === true && (
              <DialogList
                dialogs={dialogs}
                currentDialogKey={currentDialogKey}
                handleDialogClick={handleDialogClick}
                handleDeleteDialog={handleDeleteDialog}
                handleEditDialog={handleEditDialog}
              />
            )}
            {currentDialogKey !== -1 && currentDialogKey !== null ? (
              <div
                className="chat-container"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingLeft: '1vw',
                  // background: 'radial-gradient(circle at center, #F2F2F2, white)',
                  background: '#FAFAFA',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    flex: selectedRecommendation ? 1 : 2,
                    overflowY: 'auto',
                    height: '70vh',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflowX: 'hidden',
                    }}
                  >
                    <MessageList
                      messageList={messages}
                      handleDeleteMessage={handleDeleteMessage}
                      handleRecommendationClick={handleRecommendationClick}
                      handleReload={handleReload}
                      dialog_key={currentDialogKey}
                    />
                    {currentDialogKey !== -1 && currentDialogKey !== null ? (
                      <div
                        style={{
                          // marginTop: '10vh',
                          // marginBottom: '2.5%',
                          overflow: 'hidden',
                          height: '10%',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <MessageInput
                          inputValue={inputValue}
                          recommendations={recommendations}
                          handleChange={handleChange}
                          handleSend={handleSend}
                          handleModeChange={handleModeChange}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                {selectedRecommendation && (
                  <div style={{ flex: 1 }}>
                    <RecommendationPreview
                      selectedRecommendation={selectedRecommendation}
                      handleHidePreview={handleHidePreview}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  height: '100%',
                  width: '80%',
                  justifyContent: 'center',
                  display: 'flex',
                  overflowY: 'hidden',
                }}
              >
                <NewDialogPage onFlush={{ set: setFlush, value: flush }} />
              </div>
            )}
          </Allotment>
        </div>
      </Card>
      <DelDialogModal
        key_id={operateDialogKey.key}
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
