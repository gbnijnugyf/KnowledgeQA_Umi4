import { CopyOutlined, DeleteOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Tooltip, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../index.css';

interface MessageListProps {
  messageList: API.MessageType[];
  handleDeleteMessage: (key: number) => void;
  handleRecommendationClick: (recommendation: string) => void;
}

// MessageList 组件
export function MessageList({
  messageList,
  handleDeleteMessage,
  handleRecommendationClick,
}: MessageListProps) {
  console.log('messageList:', messageList);
  const messageList_ = messageList
  // .filter((item, index) => {
  //   return !(
  //     (item.key < 0 && item.sender === 'user' && index !== messageList.length - 2) ||
  //     (item.key < 0 && item.sender === 'bot' && index !== messageList.length - 1)
  //   );
  // });
  console.log('messageList:', messageList_);

  return (
    <List<API.MessageType>
      dataSource={messageList_}
      id="dialogList"
      className="dialog-list"
      style={{ overflow: 'auto', paddingRight: '1vw' }}
      renderItem={(item, index) => {
        console.log('item:', item);
        return (
          <>
            <Tooltip
              title={
                item.key >= 0 &&
                item.key !== null && (
                  <div>
                    <CopyToClipboard text={item.text} onCopy={() => message.success('已复制')}>
                      <Button icon={<CopyOutlined />} />
                    </CopyToClipboard>
                    <Button
                      style={{ marginLeft: '0.5vw' }}
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteMessage(item.key)}
                    />
                  </div>
                )
              }
              placement={item.sender === 'user' ? 'topRight' : 'topLeft'}
              overlayStyle={{ margin: '-1vh' }}
            >
              <List.Item
                key={item.key}
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
                    <div className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/>
                      {item.text}
                    </div>
                  </div>
                  <div>
                    {item.recommend && (
                      <ul>
                        {/* TODO: 可用多选卡片CheckCard优化样式 */}
                        {item.recommend.map((recommendation: string) => (
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
          </>
        );
      }}
    />
  );
}
