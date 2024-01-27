import { QuestionCircleOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { ProLayoutProps } from '@ant-design/pro-components';
import { SelectLang as UmiSelectLang, useModel } from '@umijs/max';
import { Space, Switch } from 'antd';
import defaultSettings from '../../../config/defaultSettings';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://bing.com');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const SwitchTheme = () => {
  const { setInitialState } = useModel('@@initialState');

  return (
    <Space direction="vertical">
      <Switch
        checkedChildren="亮色"
        unCheckedChildren="暗色"
        defaultChecked
        onChange={(isOpen: boolean) => {
          console.log(isOpen);
          const originalSetting: ProLayoutProps & {
            pwa?: boolean;
            logo?: string;
          } = {
            ...defaultSettings,
          };
          if (isOpen === false) {
            //暗色
            originalSetting.navTheme = 'realDark';
            setInitialState((s) => ({
              ...s,
              settings: originalSetting as Partial<LayoutSettings>,
            }));
          } else {
            //亮色
            //暗色
            originalSetting.navTheme = 'light';
            setInitialState((s) => ({
              ...s,
              settings: originalSetting as Partial<LayoutSettings>,
            }));
          }
        }}
      />
    </Space>
  );
};
