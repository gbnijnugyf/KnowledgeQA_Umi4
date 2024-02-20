import { getHistoryMessage, sendMessage } from '@/services/ant-design-pro/api';
import { IReturn } from '@/services/plugin/globalInter';
import { CopyOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Input, List, message } from 'antd';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SelectTtile } from './components/SelectTitle';
import { flushSync } from 'react-dom';
import './index.css';
type IMessage = API.MessageType;
const messageInit: IMessage = {
  sender: 'user',
  text: '',
};
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState<IMessage>(messageInit);
  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<number>(-1);
  const [loading, setLoading] = useState(false); // 新的状态变量
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const handleRecommendationClick = (recommendation: string) => {
    setSelectedRecommendation(recommendation);
  };
  const handleHidePreview = () => {
    setSelectedRecommendation('');
  };

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
          sendMessage({ key: knowledgeBaseKey, text: inputValue.text }) as Promise<
            IReturn<API.MessageType>
          >,
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ marginRight: '1%' }}>选择知识库:</div>
              <SelectTtile<number> setKey={setKnowledgeBaseKey} />
            </div>
            {selectedRecommendation !== '' ? <Button onClick={handleHidePreview}>关闭预览</Button> : null}
          </div>
        }
        style={{ width: '100%', margin: '0', minHeight: '80vh' }}
      >
        <div style={{ display: 'flex' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                      <div
                        className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/
                      >
                        {item.text}
                      </div>
                      {item.sender === 'bot' ? (
                        <CopyToClipboard text={item.text} onCopy={() => message.success('已复制')}>
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
            <div style={{ marginTop: '14vh', display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
      </Card>
    </PageContainer>
  );
};

export default ChatPage;
