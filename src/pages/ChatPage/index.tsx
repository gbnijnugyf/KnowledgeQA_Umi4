import { getHistoryMessage, sendMessage } from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import { CopyOutlined, MessageOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Input, List, message } from 'antd';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SelectTtile } from './components/SelectTitle';
import { API } from '@/services/ant-design-pro/typings';

import './index.css';
import { flushSync } from 'react-dom';
type IMessage = API.MessageType
const messageInit: IMessage = {
  sender: 'user',
  text: '',
};
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState<IMessage>(messageInit);
  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<number>(-1);
  const [loading, setLoading] = useState(false); // 新的状态变量

  useEffect(() => {
    if (knowledgeBaseKey === -1) {
      return;
    }
    // 获取历史数据
    getHistoryMessage({ key: knowledgeBaseKey }).then((res) => {
      console.log(res);
      flushSync(() => {
        setMessages(res.data);
      });
      // setGraphInfo(res.data);
    });
  }, [knowledgeBaseKey]);
    


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: IMessage = { sender: 'user', text: e.target.value };
    setInputValue(value);
  };

  const handleSend = async () => {
    if (knowledgeBaseKey === -1) {
      message.warning('请选择知识库');
      return;
    }
    if (inputValue.text !== '') {
      setLoading(true); // 开始加载
      try {
        const res = await Promise.race([
          sendMessage({ key: knowledgeBaseKey, text: inputValue.text }) as Promise<IReturn<API.MessageType>>,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000), // 5秒超时
          ) as Promise<any>,
        ]);
        if (res.status === 1) {
          setMessages([...messages, inputValue, { sender: 'bot', text: res.data.text }]);
          setInputValue(messageInit);
        } else {
          message.error('发送失败,请重试！');
        }
      } catch (error) {
        console.error(error);
        message.error('请求失败');
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
              justifyContent: 'flex-start',

              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: '1%' }}>选择知识库:</div>
            <SelectTtile setKey={setKnowledgeBaseKey} />
          </div>
        }
        style={{ width: '80%', margin: '0 auto' }}
      >
        <List
          dataSource={messages}
          style={{ minHeight: '50vh', overflow: 'auto' }}
          renderItem={(item) => (
            <List.Item
              style={{
                display: 'flex',
                justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                borderBottom: 'none',
                color:'black' //避免暗色主题下文字不可见
              }}
            >
              {item.sender === 'bot' ? (
                <Avatar icon={<RobotOutlined />} className="avatar" />
              ) : null}
              <div className={`message-box ${item.sender}`} style={{ margin: '0 1% 0' }}>
                {item.text}
              </div>
              {item.sender === 'user' ? (
                <Avatar icon={<UserOutlined />} className="avatar" />
              ) : null}
              {item.sender === 'bot' ? (
                <CopyToClipboard text={item.text} onCopy={()=>message.success('已复制')}>
                  <Button icon={<CopyOutlined />} />
                </CopyToClipboard>
              ) : null}
            </List.Item>
          )}
        />
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
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
      </Card>
    </PageContainer>
  );
};

export default ChatPage;
