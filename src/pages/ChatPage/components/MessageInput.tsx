import { AutoComplete, Button, Select } from 'antd';

// 定义 MessageInput 组件的 props 类型
interface MessageInputProps {
  inputValue: API.MessageType;
  recommendations: string[];
  handleChange: (e: string) => void;
  handleSend: () => void;
  handleModeChange: (e: number) => void;
}

// MessageInput 组件
export function MessageInput({
  inputValue,
  recommendations,
  handleChange,
  handleSend,
  handleModeChange,
}: MessageInputProps) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Select
        defaultValue={0}
        // style={{ width: 120 }}
        onChange={handleModeChange}
        options={[
          { value: 0, label: '普通模式' },
          { value: 1, label: '预习模式' },
          { value: 2, label: '复习模式' },
        ]}
      />
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
