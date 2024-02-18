import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import { CrownOutlined, LinkOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { type Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import defaultSettings from '../config/defaultSettings';
import { RouteItem, loginPath } from '../src/services/plugin/globalInter';
import { SwitchTheme } from './components/RightContent';
import { CourseManage } from './pages/CourseManage';
import { errorConfig } from './requestErrorConfig';
import { myGetCourse, myCurrentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { API } from './services/ant-design-pro/typings';
// const isDev = process.env.NODE_ENV === 'development';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      console.log(msg.data);
      return { name: msg.data.name, access: msg.data.access };
      // return msg.data;
    } catch (error) {
      console.log(error);
      history.push(loginPath);
    }
    return undefined;
  };
  console.log(1);
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState /*,setInitialState*/ }) => {
  return {
    actionsRender: () => [<Question key="doc" />, <SwitchTheme key="switchTheme" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [
      <a key="chaoxing" href="https://www.chaoxing.com/" target="_blank" rel="noreferrer">
        <LinkOutlined />
        <span>超星</span>
      </a>,
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
    // defaultSettings
  };
};

// export async function patchRoutes(routesConfig: any) {

//   const res = await myGetCourse({
//     option: 2
//   });  // 获取课程列表
//   if(res.status !== 1) {
//     message.error('获取课程列表失败');
//     return;
//   }
//   const courses = res.data;
//   console.log(courses)
//   const routes:IRoute[] = Object.values(routesConfig.routes);
//   console.log(routes)
//   // 找到 "课程管理" 的路由
//   const adminRoute = routes.find(route => route.path === '/admin');
//   console.log(adminRoute);

//   // 如果找到了 "课程管理" 的路由
//   if (adminRoute) {
//     // 如果 "课程管理" 的路由还没有子路由，那么添加一个空数组作为子路由
//     if (!adminRoute.routes) {
//       adminRoute.routes = [];
//     }

//     // 为每个课程添加一个路由
//     courses.forEach(course => {
//       adminRoute.routes.push({
//         path: `/admin/${course.key}`,
//         name: course.name,
//         component: './Course',
//       });
//     });
//   }
// }

let extraRoutes: any;

export async function patchClientRoutes({ routes }: { routes: any }) {
  // 根据 extraRoutes 对 routes 做一些修改
  const routerIndex = routes.findIndex((item: RouteItem) => item.path === '/');
  const adminIndex = routes[routerIndex]['routes'].findIndex(
    (item: RouteItem) => item.path === '/admin',
  );
  // console.log(routes[routerIndex]['routes'][adminIndex].routes);
  console.log(routes, extraRoutes);

  if (extraRoutes) {
    extraRoutes = extraRoutes.map((item: any) => {
      return {
        path: `/admin/course${item.key}`,
        name: item.name,
        element: <CourseManage v={item.key} />,
      };
    });
  }
  extraRoutes = [
    ...extraRoutes,
    {
      path: '/admin/course',
      name: <a /*onClick={ }*/ ><PlusCircleOutlined />  新增课程</a>,
    },
  ];
  // 将构造好的子路由添加到 routes 中
  routes[routerIndex]['routes'].push({
    path: '/admin',
    name: '课程管理',
    icon: <CrownOutlined />,
    access: 'adminRoute',
    children: [
      {
        path: '/admin',
        redirect: `/admin/course${extraRoutes.key === undefined ? 0 : extraRoutes.key}`,
      },
      ...extraRoutes,
    ],
  });
}

export function render(oldRender: any) {
  myGetCourse({ option: 2 }).then((res) => {
    console.log(res);
    if (res.status === 1) {
      extraRoutes = res.data;
      oldRender();
    } else {
      message.error('获取课程列表失败');
    }
  });
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
