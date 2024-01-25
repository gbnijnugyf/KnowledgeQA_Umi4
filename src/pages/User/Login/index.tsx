import { LoginForm } from '@/components/login/loginForm';
import { ILoginForm, ILoginProps, titleName } from '@/services/plugin/globalInter';
import { Service } from '@/services/plugin/globalRequest';
import { LoginFormPage, ProConfigProvider, ProFormCheckbox } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
type LoginType = 'student' | 'teacher';

function Page() {
  const [loginType, setLoginType] = useState<LoginType>('student');

  const handleSubmit: (formData: any) => Promise<boolean | void> = async (values: ILoginForm) => {
    console.log(values, loginType);
    const loginInfo: ILoginProps = {
      userName: values.userName,
      passWord: values.passWord,
      type: loginType === 'student' ? 0 : 1,
    };
    Service.login(loginInfo).then((res) => {
      console.log(res);
      if (res.data.status === 1) {
        history.push('/welcome');
      }
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        logo={<img alt="logo" src="/logo.webp" />}
        title={titleName}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="问你所闻，答你所想"
        onFinish={handleSubmit}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'teacher'} tab={'教师登录'} />
          <Tabs.TabPane key={'student'} tab={'学生登录'} />
        </Tabs>

        <LoginForm />

        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          {/* <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a> */}
        </div>
      </LoginFormPage>
    </div>
  );
}

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};
