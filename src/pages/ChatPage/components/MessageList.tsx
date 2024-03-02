import {
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  LikeOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, Popover, Tag, Tooltip, message } from 'antd';
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
  const messageList_ = messageList;
  // .filter((item, index) => {
  //   return !(
  //     (item.key < 0 && item.sender === 'user' && index !== messageList.length - 2) ||
  //     (item.key < 0 && item.sender === 'bot' && index !== messageList.length - 1)
  //   );
  // });

  const clickLile = () => {
    message.success('感谢你的反馈');
  }

  console.log('messageList:', messageList_);
  const tagColors = [
    '#108ee9',
    '#87d068',
    '#2db7f5',
    '#f50',
  ];

  return (
    <List<API.MessageType>
      dataSource={messageList_}
      id="dialogList"
      className="dialog-list"
      style={{ overflow: 'auto', paddingRight: '1vw',minHeight:"90%" }}
      renderItem={(item, _index) => {
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
                    <div>
                      <div
                        className={`message-box ${item.sender}`} /*style={{ margin: '0 3% 0' }}*/
                      >
                        {item.text}
                      </div>
                      <div>
                        {item.sender === 'bot' ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              marginLeft: '2em',
                              alignItems: 'baseline',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                            }}
                            className='recommend-list-box'
                          >
                            <div style={{ display: 'flex', alignItems: 'baseline',flexShrink:'2' }}>
                              {item.recommend && <div style={{width:'7.5em'}}>你可能还想了解:</div>}
                              {item.recommend && (
                                <>
                                  {item.recommend.map((recommendation: string, index) => (
                                    <Popover
                                    content={recommendation}
                                    trigger="click"
                                    placement="bottom"
                                  >
                                    <Tag
                                      className="recommend-list"
                                      // onClick={() => handleRecommendationClick(recommendation)}
                                      color={tagColors[index % tagColors.length]}
                                    >
                                      <div
                                        style={{
                                          // borderRight: '0.5px solid #ccc',
                                          paddingRight: '0.5em',
                                        }}
                                      >
                                        {index + 1}
                                      </div>
                                      {recommendation}
                                    </Tag>
                                    </Popover>
                                  ))}
                                </>
                              )}
                            </div>
                            <div style={{ margin: '0.5em 0', flexShrink:'1' }}>
                              <Button style={{marginRight:'0.2em'}} onClick={clickLile}>
                                <LikeOutlined />
                              </Button>
                              <Button onClick={clickLile} >
                                <DislikeOutlined />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
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
