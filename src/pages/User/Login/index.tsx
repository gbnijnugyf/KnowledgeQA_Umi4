import { LoginForm } from '@/components/login/loginForm';
import { myLogin } from '@/services/ant-design-pro/api';
import { IReturn, titleName } from '@/services/plugin/globalInter';
import token from '@/services/plugin/token';
import { LoginFormPage, ProConfigProvider, ProFormCheckbox } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs, message } from 'antd';
import { useState } from 'react';
import { flushSync } from 'react-dom';
// import loginBg from '../../../../public/loginBg.mp4';
type LoginType = 'student' | 'teacher';

function Page() {
  const [loginTypeS, setLoginTypeS] = useState<LoginType>('teacher');
  const { initialState, setInitialState } = useModel('@@initialState');
  // const location = useLocation();
  const fetchUserInfoHere = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log(userInfo);
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.loginUserParams) => {
    try {
      // 登录
      const userInfo = await initialState?.fetchUserInfo?.();
      console.log(userInfo);
      const type = loginTypeS;
      const msg: IReturn<string> = await myLogin({ ...values, type });
      console.log(msg);
      if (msg.status === 1) {
        message.success('登录成功！');
        token.save(msg.data);
        await fetchUserInfoHere();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      console.log(msg);

      // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
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
        // backgroundVideoUrl='D:/CodeProject/KnowledgeQA/KnowledgeQA/public/loginBg.mp4'
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
          activeKey={loginTypeS}
          onChange={(activeKey) => setLoginTypeS(activeKey as LoginType)}
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
