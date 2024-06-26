import {
  deleteMessage,
  getHistoryMessage,
  myGetDialogs,
  myGetRecommendTags,
  myGetRecommendedInput,
  reloadMessage,
  sendMessage,
} from '@/services/ant-design-pro/api';
import { BASEURL, IReturn } from '@/services/plugin/globalInter';
import { debounce } from '@/services/plugin/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Breadcrumb, Button, Card, Modal, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { DelDialogModal } from './components/DelDialog';
import { DialogList } from './components/DialogList';
import { DifMode } from './components/DifMode';
import { EditDialogModal } from './components/EditDialog';
import { MessageInput } from './components/MessageInput';
import { MessageList } from './components/MessageList';
import { NewDialogPage } from './components/NewDialogPage';
import { RecommendationPreview } from './components/RecommendationPreview';
import './index.scss';

const messageInit: API.MessageType = {
  key: -1,
  sender: 'user',
  text: '',
};
// 在 ChatPage 组件中使用这些子组件
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<API.MessageType[]>([]);
  const [inputValue, setInputValue] = useState<API.MessageType>(messageInit);
  const [focusInput, setFocusInput] = useState<boolean>(true);
  const [modeValue, setModeValue] = useState<number>(0);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const [flush, setFlush] = useState<boolean>(false);
  const [dialogs, setDialogs] = useState<API.DialogListItem[]>([]);
  const [currentDialogKey, setCurrentDialogKey] = useState<number | null>(null);
  const [deleteDialogModal, setDeleteDialogModal] = useState<boolean>(false);
  const [editDialogModal, setEditDialogModal] = useState<boolean>(false);
  const [menuDisplay, setMenuDisplay] = useState<boolean>(false);
  const [operateDialogKey, setOperateDialogKey] = useState<{ key: number; name: string }>({
    key: -1,
    name: '',
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectMsg, setSelectMsg] = useState<number>(-1);
  const [sseMsg, setSseMsg] = useState<string>('');
  const [breadItems, setBreadItems] = useState<Array<{ title: string; path?: string }>>([
    {
      path: '/chat',
      title: '问答',
    },
  ]);
  const msgButtomKey = useRef<number>(-1); //记录最底部信息，查看是否有修改
  const access = useAccess();
  //滚动到最底部
  const scrollToBottom = (direct: boolean) => {
    let chatBox = document.getElementById('dialogList');
    if (chatBox && direct) {
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      if (messages.length > 0) {
        // 当底部信息没有被修改时，滚动到底部
        if (chatBox && messages[messages.length - 1]?.key !== msgButtomKey.current) {
          chatBox.scrollTop = chatBox.scrollHeight;
          msgButtomKey.current = messages[messages.length - 1].key;
        }
      }
    }
  };

  useEffect(() => scrollToBottom(false), [messages]); // 当 messages 发生变化时，滚动到底部

  // 删除对话框
  const handleDeleteDialog = (key: number, name: string) => {
    setOperateDialogKey({ key, name });
    setDeleteDialogModal(true);
  };
  //获取推荐输入
  useEffect(() => {
    // console.log(currentDialogKey)
    if (focusInput === true && currentDialogKey !== null) {
      myGetRecommendedInput({ text: inputValue.text, key: currentDialogKey || -1 }).then((res) => {
        // console.log(res);
        setRecommendations(res.data);
      });
      setFocusInput(false);
    }
  }, [focusInput, currentDialogKey]);
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
      const hide = message.loading('正在获取历史记录');
      getHistoryMessage({ key: currentDialogKey }).then((res) => {
        hide();
        if (res.status === 1) {
          setMessages(res.data);
          if (res.data.length > 0) {
            msgButtomKey.current = res.data[res.data.length - 1].key;
          }
          setTimeout(() => scrollToBottom(true));
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
  const handleGetRecommend = (key: number) => {
    const hide = message.loading('正在获取相关推荐');
    // console.log(key);
    myGetRecommendTags({ key: key })
      .then((res) => {
        hide();
        if (res.status === 1) {
          const msgList = [...messages];
          msgList.forEach((e) => {
            if (e.key === key) {
              e.recommend = res.data;
            }
          });
          setMessages(msgList);
        } else [message.error('获取失败')];
      })
      .catch(() => message.error('获取失败'));
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

  // 焦点在输入框时
  const handleFocus = (e: any) => {
    const input = e.target.value;
    if (input === '') {
      setFocusInput(true);
    } else {
      setFocusInput(false);
    }
  };
  // 输入框改变时的处理函数
  const handleChange = (e: string) => {
    // console.log(e);
    const value: API.MessageType = { key: -2, sender: 'user', text: e };
    setInputValue(value);
  };
  //模式选择处理函数
  const handleModeChange = (value: number) => {
    setModeValue(value);
  };

  //重新加载信息
  const handleReload = async (key: number) => {
    const hide = message.loading('正在重新加载信息');
    // const res = await reloadMessage({ key: key })
    reloadMessage(key).then((res) => {
      if (res.status === 1 && res.data.replyKey !== undefined) {
        const evtSource = new EventSource(BASEURL + '/sendMsgSSE');

        // console.log(res);
        const newMessages = [...messages];
        const index = newMessages.findIndex((message) => message.key === res.data.replyKey);
        let msg = '';
        evtSource.onmessage = (event) => {
          msg = msg + (event.data !== '---Key---' ? event.data : '');
          const newMsg: API.MessageType = {
            key: res.data.replyKey,
            sender: 'assistant',
            text: msg,
          };
          if (index !== -1) {
            // 如果找到了具有相同键的消息，替换它
            newMessages[index] = newMsg;
            hide();
          } else {
            // 如果没有找到具有相同键的消息，找到请求key那个元素的位置并在其后面插入响应消息
            const requestKeyIndex = newMessages.findIndex((message) => message.key === key);
            if (requestKeyIndex !== -1) {
              newMessages.splice(requestKeyIndex + 1, 0, newMsg);
            }
          }
          setMessages(newMessages);

          if (event.data === '---Key---') {
            evtSource.close();
          }
        };

        message.success('加载成功');
      } else {
        message.error('重新加载失败');
      }
    });
  };

  // 发送消息
  const handleSend = async () => {
    if (currentDialogKey === null || currentDialogKey === -1) {
      message.warning('请选择对话');
      return;
    }
    if (inputValue.text !== '') {
      // const evtSource = new EventSource('http://10.83.35.12:5000/sendMsgSSE');
      // const evtSource = new EventSource(BASEURL + '/sendMsgSSE');
      // evtSource.onmessage = (event) => {
      //   console.log('event data:', event);
      //   evtSource.close();
      // };

      setMessages([
        ...messages,
        inputValue,
        { key: -1, sender: 'assistant', text: '正在生成回复...' },
      ]);
      try {
        const res = await Promise.race([
          sendMessage({ key: currentDialogKey, text: inputValue.text, mode: modeValue }) as Promise<
            IReturn<API.msgKey>
          >,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error('请求超时')), 30000), // 30秒超时
          ) as Promise<any>,
        ]);
        if (res.status === 1) {
          const evtSource = new EventSource(BASEURL + '/sendMsgSSE');
          //监听消息
          let msg = '';
          evtSource.onmessage = (event) => {
            // console.log('event data:', event);
            msg = msg + (event.data !== '---Key---' ? event.data : '');
            setSseMsg(msg);
            // console.log('msg:', msg);
            const prevMessages = [...messages];
            prevMessages.slice(0, -2);
            prevMessages.push({
              key: res.data.userMsgKey,
              sender: 'user',
              text: inputValue.text,
            });
            // 替换最后一条消息
            prevMessages.push({
              key: res.data.replyKey,
              sender: 'assistant',
              text: msg,
              recommend: [],
            });
            scrollToBottom(true);
            setMessages(prevMessages);

            if (event.data === '---Key---') {
              evtSource.close();
            }
            // evtSource.close();
          };
          // console.log(res);
          // const setMessageBackFunc = debounce(() => {
          //   const prevMessages = [...messages];
          //   prevMessages.slice(0, -2);
          //   prevMessages.push({
          //     key: res.data,
          //     sender: 'user',
          //     text: inputValue.text,
          //   });
          //   // 替换最后一条消息
          //   prevMessages.push({
          //     key: res.data.reply.key,
          //     sender: 'assistant',
          //     text: res.data.reply.text,
          //     recommend: res.data.reply.recommend,
          //   });
          //   setMessages(prevMessages);
          // }, 0);
          // await setMessageBackFunc();
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
            <div style={{ marginRight: '1%' }}>
              <Breadcrumb style={{}} items={breadItems} />
            </div>
            <div>
              {selectedRecommendation !== '' && (
                <Button onClick={handleHidePreview}>关闭预览</Button>
              )}
              {access.isMobile() && (
                <Button onClick={() => setMenuDisplay(true)}>查看对话列表</Button>
              )}
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
        <div style={{ display: 'flex', height: `${CardHeight - 12}vh`, justifyContent: 'center' }}>
          <DifMode
            dialogComponent={{
              dialogs: dialogs,
              currentDialogKey: currentDialogKey,
              handleDialogClick: handleDialogClick,
              handleDeleteDialog: handleDeleteDialog,
              handleEditDialog: handleEditDialog,
            }}
            setMenuDisplay={{ value: menuDisplay, set: setMenuDisplay }}
          >
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
                      handleGetRecommend={handleGetRecommend}
                      handleReload={handleReload}
                      dialog_key={currentDialogKey}
                      dialogs={dialogs}
                    />
                    {currentDialogKey !== -1 && currentDialogKey !== null ? (
                      <div
                        style={{
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
                          handleFocus={handleFocus}
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
          </DifMode>
        </div>
      </Card>
      <DelDialogModal
        key_id={operateDialogKey.key}
        name={operateDialogKey.name}
        open={{ set: setDeleteDialogModal, value: deleteDialogModal }}
        flush={{ set: setFlush, value: flush }}
      />
      <EditDialogModal
        dialogs={dialogs}
        key_id={operateDialogKey.key}
        name={operateDialogKey.name}
        open={{ set: setEditDialogModal, value: editDialogModal }}
        flush={{ set: setFlush, value: flush }}
      />
      {access.isMobile() && (
        <Modal open={menuDisplay} onCancel={() => setMenuDisplay(false)} footer={[]}>
          <DialogList
            dialogs={dialogs}
            currentDialogKey={currentDialogKey}
            handleDialogClick={handleDialogClick}
            handleDeleteDialog={handleDeleteDialog}
            handleEditDialog={handleEditDialog}
          />
        </Modal>
      )}
    </PageContainer>
  );
};

export default ChatPage;

/**
 * useEffect(() => {
  // 创建一个新的 WebSocket 连接
  const socket = new WebSocket("ws://your-server.com/path");

  // 监听 open 事件来确认连接已经打开
  socket.addEventListener("open", (event) => {
    // 连接打开后，发送一个消息到服务端
    socket.send("Hello Server!");
  });

  // 监听 message 事件来接收服务端发送过来的消息
  socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
    // 这里你可以更新你的状态来显示新的消息
    // setMessages((prevMessages) => [...prevMessages, event.data]);
  });

  // 在组件卸载时关闭 WebSocket 连接
  return () => {
    socket.close();
  };
}, []);

 */
