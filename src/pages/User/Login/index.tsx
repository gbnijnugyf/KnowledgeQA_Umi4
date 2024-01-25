import { LoginForm } from '@/components/login/loginForm';
import { ILoginForm, ILoginProps, titleName } from '@/services/plugin/globalInter';
import { Service } from '@/services/plugin/globalRequest';
import { LoginFormPage, ProConfigProvider, ProFormCheckbox } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs } from 'antd';
import { useState } from 'react';
type LoginType = 'student' | 'teacher';

function Page() {
  const [loginType, setLoginType] = useState<LoginType>('student');
  const { initialState, setInitialState } = useModel('@@initialState');
  // const location = useLocation();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log(userInfo);
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit: (formData: any) => Promise<boolean | void> = async (values: ILoginForm) => {
    console.log(values, loginType);
    const loginInfo: ILoginProps = {
      userName: values.userName,
      passWord: values.passWord,
      type: loginType === 'student' ? 0 : 1,
    };
    const res = await Service.login(loginInfo);

    if (res.data.status === 1) {
      console.log(res);
      localStorage.setItem('token', res.data.data);
      await fetchUserInfo();
      if (!history) return;
      console.log(history);
      history.push(history.location.pathname);
      // const { query } = location;
      // const { redirect } = query as { redirect: string };
      // history.push(redirect || '/');
      return;
    }
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
