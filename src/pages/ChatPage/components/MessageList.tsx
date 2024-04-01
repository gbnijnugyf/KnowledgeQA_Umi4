import {
  CopyOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  DislikeOutlined,
  LikeOutlined,
  ReloadOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, Popover, message } from 'antd';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../index.scss';
import { RecommendationCard } from './RecommendationPreview';
import { MdPreview } from 'md-editor-rt';

interface MessageListProps {
  messageList: API.MessageType[];
  handleDeleteMessage: (key: number) => void;
  handleReload: (key: number) => Promise<void>;
  handleGetRecommend: (key: number) => void;
  dialog_key: number;
  dialogs:API.DialogListItem[]
}

// MessageList 组件
export function MessageList({
  messageList,
  handleDeleteMessage,
  handleReload,
  dialog_key,
  handleGetRecommend,
  dialogs,
}: MessageListProps) {
  // console.log('messageList:', messageList);
  const [isHovered, setIsHovered] = useState<{ open: boolean; key: number }>({
    open: false,
    key: -1,
  });
  const [currentBaseKey, setCurrentDialogKey] = useState<number[]>([])
  useEffect(()=>{
    const currentDialog = dialogs.find(dialog=>dialog.key===dialog_key)
    const currentKbase = currentDialog?.Kbase.map(kbase=>kbase.key)
    if(currentKbase){
      setCurrentDialogKey(currentKbase)
    }
  },[dialog_key])
  const messageList_ = messageList;

  const clickLike = () => {
    message.success('感谢你的反馈');
  };

  // console.log('messageList:', messageList_);

  // function handleGetRecommend(item: API.MessageType) {
  //   const hide = message.loading('正在获取相关推荐');
  //   myGetRecommendTags({ key: item.key }).then((res) => {
  //     hide();
  //     if (res.status === 1) {
  //       item = {
  //         ...item,
  //         recommend: res.data,
  //       };
  //       console.log(item)
  //     }
  //   });
  //   return item
  // }

  return (
    <List<API.MessageType>
      id="dialogList"
      dataSource={messageList_}
      className="dialog-list"
      style={{ overflow: 'auto', paddingRight: '1vw', height: '90%' }}
      renderItem={(item, _index) => {
        // console.log('item:', item);
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
                alignItems: item.sender === 'assistant' ? 'flex-start' : 'flex-end',
              }}
              onMouseEnter={() => setIsHovered({ open: true, key: item.key })}
              onMouseLeave={() => setIsHovered({ open: false, key: item.key })}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: item.sender === 'assistant' ? 'row' : 'row-reverse',
                }}
              >
                <Avatar
                  shape="square"
                  style={{ backgroundColor: '#BDD7EE' }}
                  icon={item.sender === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                  className="avatar"
                />
                <div
                  className={`button-hidden ${item.sender}`}
                  style={{ opacity: isHovered.open && isHovered.key === item.key ? 1 : 0 }}
                >
                  <CopyToClipboard text={item.text} onCopy={() => message.success('已复制')}>
                    <Button
                      //TODO: 样式代码待调整
                      id="shadow-box"
                      style={{
                        margin: '0 0 0 2.5%',
                        padding: '4%',
                        paddingTop: `${item.sender === 'assistant' ? '3%' : ''}`,
                      }}
                      icon={<CopyOutlined />}
                    />
                  </CopyToClipboard>
                  {item.key > 0 && (
                    <Button
                      id="shadow-box"
                      style={{
                        margin: '0 0 0 2.5%',
                        padding: '4%',
                        paddingTop: `${item.sender === 'assistant' ? '3%' : ''}`,
                      }}
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteMessage(item.key)}
                    />
                  )}
                  {item.sender === 'assistant' && (
                    <>
                      <Popover content="获取推荐">
                        <Button
                          id="shadow-box"
                          style={{
                            margin: '0 0 0 2.5%',
                            padding: '4%',
                            paddingTop: '3%',
                          }}
                          onClick={async () => {
                            // console.log("1:",item);
                            handleGetRecommend(item.key);
                            // console.log("2:",item);
                          }}
                          icon={<DeploymentUnitOutlined />}
                        />
                      </Popover>
                      <Button
                        id="shadow-box"
                        style={{
                          margin: '0 0 0 2.5%',
                          padding: '4%',
                          paddingTop: '3%',
                        }}
                        onClick={() => clickLike()}
                        icon={<LikeOutlined />}
                      />
                      <Button
                        id="shadow-box"
                        style={{
                          margin: '0 0 0 2.5%',
                          padding: '4%',
                          paddingTop: '3%',
                        }}
                        onClick={() => clickLike()}
                        icon={<DislikeOutlined />}
                      />
                    </>
                  )}
                  {item.sender === 'user' && item.key > 0 && (
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
                    <MdPreview modelValue={item.text} />
                    {/* {item.text} */}
                  </div>
                  <div style={{ marginTop: '0.3em' }}>
                    {item.sender === 'assistant' && item.recommend && (
                      <div className="recommend-list-box">
                        <RecommendationCard base_key={currentBaseKey} item={item} />
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
