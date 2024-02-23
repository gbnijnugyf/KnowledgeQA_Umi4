import { AutoComplete, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';

// 定义 MessageInput 组件的 props 类型
interface MessageInputProps {
  inputValue: API.MessageType;
  recommendations: string[];
  handleChange: (e: string) => void;
  handleSend: () => void;
}

// MessageInput 组件
export function MessageInput({
  inputValue,
  recommendations,
  handleChange,
  handleSend,
}: MessageInputProps) {
  return (
    <div style={{display:'flex', width:'100%'}}>
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
      >
        {/* <TextArea /> */}
      </AutoComplete>
      <Button type="primary" onClick={handleSend}>
        发送
      </Button>
    </div>
  );
}
