// import { Footer } from '@/components';
// import { myLogin } from '@/services/ant-design-pro/api';
// import { getFakeCaptcha } from '@/services/ant-design-pro/login';
// import {
//   AlipayCircleOutlined,
//   LockOutlined,
//   MobileOutlined,
//   TaobaoCircleOutlined,
//   UserOutlined,
//   WeiboCircleOutlined,
// } from '@ant-design/icons';
// import {
//   LoginForm,
//   ProFormCaptcha,
//   ProFormCheckbox,
//   ProFormText,
// } from '@ant-design/pro-components';
// import { FormattedMessage, Helmet, SelectLang, history, useIntl, useModel } from '@umijs/max';
// import { Alert, Tabs, message } from 'antd';
// import { createStyles } from 'antd-style';
// import React, { useState } from 'react';
// import { flushSync } from 'react-dom';
// import Settings from '../../../../config/defaultSettings';

// const useStyles = createStyles(({ token }) => {
//   return {
//     action: {
//       marginLeft: '8px',
//       color: 'rgba(0, 0, 0, 0.2)',
//       fontSize: '24px',
//       verticalAlign: 'middle',
//       cursor: 'pointer',
//       transition: 'color 0.3s',
//       '&:hover': {
//         color: token.colorPrimaryActive,
//       },
//     },
//     lang: {
//       width: 42,
//       height: 42,
//       lineHeight: '42px',
//       position: 'fixed',
//       right: 16,
//       borderRadius: token.borderRadius,
//       ':hover': {
//         backgroundColor: token.colorBgTextHover,
//       },
//     },
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       overflow: 'auto',
//       backgroundImage:
//         "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
//       backgroundSize: '100% 100%',
//     },
//   };
// });

// const ActionIcons = () => {
//   const { styles } = useStyles();

//   return (
//     <>
//       <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
//       <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
//       <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
//     </>
//   );
// };

// const Lang = () => {
//   const { styles } = useStyles();

//   return (
//     <div className={styles.lang} data-lang>
//       {SelectLang && <SelectLang />}
//     </div>
//   );
// };

// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => {
//   return (
//     <Alert
//       style={{
//         marginBottom: 24,
//       }}
//       message={content}
//       type="error"
//       showIcon
//     />
//   );
// };

// const Login: React.FC = () => {
//   const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
//   const [type, setType] = useState<string>('account');
//   const { initialState, setInitialState } = useModel('@@initialState');
//   const { styles } = useStyles();
//   const intl = useIntl();

//   const fetchUserInfo = async () => {
//     const userInfo = await initialState?.fetchUserInfo?.();
//     console.log(userInfo);
//     if (userInfo) {
//       flushSync(() => {
//         setInitialState((s) => ({
//           ...s,
//           currentUser: userInfo,
//         }));
//       });
//     }
//   };

//   const handleSubmit = async (values: API.LoginParams) => {
//     try {
//       // 登录
//       const userInfo = await initialState?.fetchUserInfo?.();
//       console.log(userInfo);
//       const msg = await myLogin({ ...values, type });
//       console.log(msg);
//       if (msg.status === 1) {
//         // if (msg.status === 'ok') {
//         const defaultLoginSuccessMessage = intl.formatMessage({
//           id: 'pages.login.success',
//           defaultMessage: '登录成功！',
//         });
//         message.success(defaultLoginSuccessMessage);

//         await fetchUserInfo();
//         const urlParams = new URL(window.location.href).searchParams;
//         history.push(urlParams.get('redirect') || '/');
//         return;
//       }
//       console.log(msg);
//       // 如果失败去设置用户错误信息
//       setUserLoginState(msg);

//       // 登录
//       // const msg = await Service.login({
//       //   userName: values.username === undefined ? '' : values.username,
//       //   passWord: values.password === undefined ? '' : values.password,
//       //   type: 0,
//       // });
//       // if (msg.data.status === 1) {
//       //   const defaultLoginSuccessMessage = intl.formatMessage({
//       //     id: 'pages.login.success',
//       //     defaultMessage: '登录成功！',
//       //   });
//       //   message.success(defaultLoginSuccessMessage);
//       //   await fetchUserInfo();
//       //   const urlParams = new URL(window.location.href).searchParams;
//       //   history.push(urlParams.get('redirect') || '/');
//       //   return;
//       // }
//       // console.log(msg);
//       // // 如果失败去设置用户错误信息
//       // setUserLoginState({ status: msg.data.status.toString() });
//     } catch (error) {
//       const defaultLoginFailureMessage = intl.formatMessage({
//         id: 'pages.login.failure',
//         defaultMessage: '登录失败，请重试！',
//       });
//       console.log(error);
//       message.error(defaultLoginFailureMessage);
//     }
//   };
//   const { status, type: loginType } = userLoginState;

//   return (
//     <div className={styles.container}>
//       <Helmet>
//         <title>
//           {intl.formatMessage({
//             id: 'menu.login',
//             defaultMessage: '登录页',
//           })}
//           - {Settings.title}
//         </title>
//       </Helmet>
//       <Lang />
//       <div
//         style={{
//           flex: '1',
//           padding: '32px 0',
//         }}
//       >
//         <LoginForm
//           contentStyle={{
//             minWidth: 280,
//             maxWidth: '75vw',
//           }}
//           logo={<img alt="logo" src="/logo.svg" />}
//           title="Ant Design"
//           subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
//           initialValues={{
//             autoLogin: true,
//           }}
//           actions={[
//             <FormattedMessage
//               key="loginWith"
//               id="pages.login.loginWith"
//               defaultMessage="其他登录方式"
//             />,
//             <ActionIcons key="icons" />,
//           ]}
//           onFinish={async (values) => {
//             await handleSubmit(values as API.LoginParams);
//           }}
//         >
//           <Tabs
//             activeKey={type}
//             onChange={setType}
//             centered
//             items={[
//               {
//                 key: 'account',
//                 label: intl.formatMessage({
//                   id: 'pages.login.accountLogin.tab',
//                   defaultMessage: '账户密码登录',
//                 }),
//               },
//               {
//                 key: 'mobile',
//                 label: intl.formatMessage({
//                   id: 'pages.login.phoneLogin.tab',
//                   defaultMessage: '手机号登录',
//                 }),
//               },
//             ]}
//           />

//           {status === 'error' && loginType === 'account' && (
//             <LoginMessage
//               content={intl.formatMessage({
//                 id: 'pages.login.accountLogin.errorMessage',
//                 defaultMessage: '账户或密码错误(admin/ant.design)',
//               })}
//             />
//           )}
//           {type === 'account' && (
//             <>
//               <ProFormText
//                 name="username"
//                 fieldProps={{
//                   size: 'large',
//                   prefix: <UserOutlined />,
//                 }}
//                 placeholder={intl.formatMessage({
//                   id: 'pages.login.username.placeholder',
//                   defaultMessage: '用户名: admin or user',
//                 })}
//                 rules={[
//                   {
//                     required: true,
//                     message: (
//                       <FormattedMessage
//                         id="pages.login.username.required"
//                         defaultMessage="请输入用户名!"
//                       />
//                     ),
//                   },
//                 ]}
//               />
//               <ProFormText.Password
//                 name="password"
//                 fieldProps={{
//                   size: 'large',
//                   prefix: <LockOutlined />,
//                 }}
//                 placeholder={intl.formatMessage({
//                   id: 'pages.login.password.placeholder',
//                   defaultMessage: '密码: ant.design',
//                 })}
//                 rules={[
//                   {
//                     required: true,
//                     message: (
//                       <FormattedMessage
//                         id="pages.login.password.required"
//                         defaultMessage="请输入密码！"
//                       />
//                     ),
//                   },
//                 ]}
//               />
//             </>
//           )}

//           {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
//           {type === 'mobile' && (
//             <>
//               <ProFormText
//                 fieldProps={{
//                   size: 'large',
//                   prefix: <MobileOutlined />,
//                 }}
//                 name="mobile"
//                 placeholder={intl.formatMessage({
//                   id: 'pages.login.phoneNumber.placeholder',
//                   defaultMessage: '手机号',
//                 })}
//                 rules={[
//                   {
//                     required: true,
//                     message: (
//                       <FormattedMessage
//                         id="pages.login.phoneNumber.required"
//                         defaultMessage="请输入手机号！"
//                       />
//                     ),
//                   },
//                   {
//                     // pattern: /^1\d{10}$/,
//                     message: (
//                       <FormattedMessage
//                         id="pages.login.phoneNumber.invalid"
//                         defaultMessage="手机号格式错误！"
//                       />
//                     ),
//                   },
//                 ]}
//               />
//               <ProFormCaptcha
//                 fieldProps={{
//                   size: 'large',
//                   prefix: <LockOutlined />,
//                 }}
//                 captchaProps={{
//                   size: 'large',
//                 }}
//                 placeholder={intl.formatMessage({
//                   id: 'pages.login.captcha.placeholder',
//                   defaultMessage: '请输入验证码',
//                 })}
//                 captchaTextRender={(timing, count) => {
//                   if (timing) {
//                     return `${count} ${intl.formatMessage({
//                       id: 'pages.getCaptchaSecondText',
//                       defaultMessage: '获取验证码',
//                     })}`;
//                   }
//                   return intl.formatMessage({
//                     id: 'pages.login.phoneLogin.getVerificationCode',
//                     defaultMessage: '获取验证码',
//                   });
//                 }}
//                 name="captcha"
//                 rules={[
//                   {
//                     required: true,
//                     message: (
//                       <FormattedMessage
//                         id="pages.login.captcha.required"
//                         defaultMessage="请输入验证码！"
//                       />
//                     ),
//                   },
//                 ]}
//                 onGetCaptcha={async (phone) => {
//                   const result = await getFakeCaptcha({
//                     phone,
//                   });
//                   if (!result) {
//                     return;
//                   }
//                   message.success('获取验证码成功！验证码为：1234');
//                 }}
//               />
//             </>
//           )}
//           <div
//             style={{
//               marginBottom: 24,
//             }}
//           >
//             <ProFormCheckbox noStyle name="autoLogin">
//               <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
//             </ProFormCheckbox>
//             <a
//               style={{
//                 float: 'right',
//               }}
//             >
//               <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
//             </a>
//           </div>
//         </LoginForm>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Login;

import { LoginForm } from '@/components/login/loginForm';
import { myLogin } from '@/services/ant-design-pro/api';
import { titleName } from '@/services/plugin/globalInter';
import { LoginFormPage, ProConfigProvider, ProFormCheckbox } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs, message } from 'antd';
import { useState } from 'react';
type LoginType = 'student' | 'teacher';

function Page() {
  const [loginTypeS, setLoginTypeS] = useState<LoginType>('teacher');
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

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const userInfo = await initialState?.fetchUserInfo?.();
      console.log(userInfo);
      const type = loginTypeS;
      const msg = await myLogin({ ...values, type });
      console.log(msg);
      if (msg.status === 1) {
        message.success('登录成功！');

        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        console.log(urlParams);
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
