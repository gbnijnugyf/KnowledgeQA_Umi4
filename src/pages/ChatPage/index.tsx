import {
  deleteMessage,
  getHistoryMessage,
  myGetDialogs,
  myGetRecommendedInput,
  sendMessage,
} from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, message } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { DelDialogModal } from './components/DelDialog';
import { DialogList } from './components/DialogList';
import { EditDialogModal } from './components/EditDialog';
import { MessageInput } from './components/MessageInput';
import { MessageList } from './components/MessageList';
import { NewDialogPage } from './components/NewDialogPage';
import { RecommendationPreview } from './components/RecommendationPreview';
import './index.css';

const messageInit: API.MessageType = {
  key: -1,
  sender: 'user',
  text: '',
};
// 在 ChatPage 组件中使用这些子组件
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<API.MessageType[]>([]);
  const [inputValue, setInputValue] = useState<API.MessageType>(messageInit);
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

  // 发送消息
  const handleSend = async () => {
    if (currentDialogKey === null || currentDialogKey === -1) {
      message.warning('请选择知识库');
      return;
    }
    if (inputValue.text !== '') {
      //TODO: 有bug，加入message的消息(inputValue)需要有真实的key，而不是-1
      setMessages([...messages, inputValue, { key: -1, sender: 'bot', text: '正在生成回复...' }]);
      try {
        const res = await Promise.race([
          sendMessage({ key: currentDialogKey, text: inputValue.text }) as Promise<
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
            setInputValue(() => inputValue || messageInit);
            setMessages((prevMessages) => {
              // 删除最后两条消息
              return prevMessages.slice(0, -2);
            });
          }, 1000)();
          message.error('发送失败,请重试！');
        }
      } catch (error) {
        console.error(error);
        debounce(() => {
          setInputValue(() =>inputValue || messageInit);
          setMessages((prevMessages) => {
            // 删除最后两条消息
            return prevMessages.slice(0, -2);
          });
        }, 1000)();
        message.error('发送失败，请重试');
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
        }}
      >
        {' '}
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 对话框列表 */}
          <div style={{ width: '20%', marginRight: '0.5%', overflowY: 'auto', maxHeight: '71vh' }}>
            <DialogList
              dialogs={dialogs}
              currentDialogKey={currentDialogKey}
              handleDialogClick={handleDialogClick}
              handleDeleteDialog={handleDeleteDialog}
              handleEditDialog={handleEditDialog}
            />
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
                  <MessageList
                    messageList={messages}
                    handleDeleteMessage={handleDeleteMessage}
                    handleRecommendationClick={handleRecommendationClick}
                  />
                  {currentDialogKey !== -1 && currentDialogKey !== null ? (
                    <div
                      style={{
                        // marginTop: '10vh',
                        height: '7vh',
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
