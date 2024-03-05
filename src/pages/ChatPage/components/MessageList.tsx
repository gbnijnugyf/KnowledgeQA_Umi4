import {
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  LikeOutlined,
  ReloadOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, message } from 'antd';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../index.scss';
import { RecommendationCard } from './RecommendationPreview';

interface MessageListProps {
  messageList: API.MessageType[];
  handleDeleteMessage: (key: number) => void;
  handleReload: (key: number) => Promise<void>;
  handleRecommendationClick: (recommendation: string) => void;
  dialog_key: number;
}

// MessageList 组件
export function MessageList({
  messageList,
  handleDeleteMessage,
  handleReload,
  dialog_key,
  handleRecommendationClick,
}: MessageListProps) {
  console.log('messageList:', messageList);
  const [isHovered, setIsHovered] = useState<{ open: boolean; key: number }>({
    open: false,
    key: -1,
  });

  const messageList_ = messageList;

  const clickLike = () => {
    message.success('感谢你的反馈');
  };

  console.log('messageList:', messageList_);

  return (
    <List<API.MessageType>
      id="dialogList"
      dataSource={messageList_}
      className="dialog-list"
      style={{ overflow: 'auto', paddingRight: '1vw', height: '90%' }}
      renderItem={(item, _index) => {
        console.log('item:', item);
        return (
          <>
            <List.Item
              key={item.key}
              style={{
                display: 'flex',
                // flexDirection: item.sender === 'user' ? 'row-reverse' : 'row',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                borderBottom: 'none',
                alignItems: item.sender === 'bot' ? 'flex-start' : 'flex-end',
              }}
              onMouseEnter={() => setIsHovered({ open: true, key: item.key })}
              onMouseLeave={() => setIsHovered({ open: false, key: item.key })}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: item.sender === 'bot' ? 'row' : 'row-reverse',
                }}
              >
                <Avatar
                  shape="square"
                  style={{ backgroundColor: '#BDD7EE' }}
                  icon={item.sender === 'bot' ? <RobotOutlined /> : <UserOutlined />}
                  className="avatar"
                />
                <div
                  className={`button-hidden ${item.sender}`}
                  style={{ opacity: isHovered.open && isHovered.key === item.key ? 1 : 0 }}
                >
                  <CopyToClipboard text={item.text} onCopy={() => message.success('已复制')}>
                    <Button
                      id="shadow-box"
                      style={{
                        margin: '0 0 0 4%',
                        padding: '5%',
                      }}
                      icon={<CopyOutlined />}
                    />
                  </CopyToClipboard>
                  <Button
                      id="shadow-box"
                    style={{
                      margin: '0 0 0 4%',
                      padding: '5%',
                    }}
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteMessage(item.key)}
                  />
                  {item.sender === 'bot' && (
                    <>
                    <Button
                    id="shadow-box"
                      style={{
                        margin: '0 0 0 4%',
                        padding: '5%',
                      }}
                      onClick={() => clickLike()}
                      icon={<LikeOutlined  />}
                    />
                    <Button
                    id="shadow-box"
                      style={{
                        margin: '0 0 0 4%',
                        padding: '5%',
                      }}
                      onClick={() => clickLike()}
                      icon={<DislikeOutlined />}
                    />
                    </>
                  )}
                  {item.sender === 'user' && (
                    <Button
                    id="shadow-box"

                      style={{
                        margin: '0 0 0 4%',
                        padding: '5%',
                      }}
                      onClick={() => handleReload(item.key)}
                      icon={<ReloadOutlined />}
                    />
                  )}
                </div>
              </div>
              <div style={{ flexDirection: 'column', width: '80%', marginTop: '0.5%' }}>
                <div>
                  <div className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/>
                    {item.text}
                  </div>
                  <div style={{ marginTop: '0.3em' }}>
                    {item.sender === 'bot' && item.recommend && (
                      <div className="recommend-list-box">
                        <RecommendationCard
                          dialog_key={dialog_key}
                          item={item}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          </>
        );
      }}
    />
  );
}
