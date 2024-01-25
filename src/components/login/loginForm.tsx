import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { theme } from 'antd';

export function LoginForm() {
  const { token } = theme.useToken();

  return (
    <>
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: (
            <UserOutlined
              style={{
                color: token.colorText,
              }}
              className={'prefixIcon'}
            />
          ),
        }}
        placeholder={'用户名'}
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: (
            <LockOutlined
              style={{
                color: token.colorText,
              }}
              className={'prefixIcon'}
            />
          ),
        }}
        placeholder={'密码'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
    </>
  );
}
