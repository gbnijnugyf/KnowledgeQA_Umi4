import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASEURL, ILoginProps } from './globalInter';

// 返回响应中data的类型
export interface IGlobalResponse<T> {
  data: T;
  msg: string;
  status: number;
}

async function GlobalAxios<T = any, D = any>(
  method: 'post' | 'get' | 'delete' | 'put',
  url: string,
  data?: D,
): Promise<AxiosResponse<IGlobalResponse<T>, any>> {
  const config: AxiosRequestConfig<D> = {};
  config.baseURL = BASEURL;
  const parsedURL = new URL(BASEURL + url);
  const params = new URLSearchParams(parsedURL.searchParams || '');
  config.params = params;

  const regex = /\/\/(.*)/;
  const match = window.location.href.match(regex);
  let afterDoubleSlash: string[] = [];
  if (match && match.length > 1) {
    afterDoubleSlash = match[1].split('/');
  } else {
    console.log('无法截取 // 之后的字符串');
  }
  if (afterDoubleSlash[1] === 'admin' && afterDoubleSlash[2] === 'main') {
    config.headers = {
      adminCheck: 'admin',
      bloggerLoginCheck: localStorage.getItem('token') || '',
    };
  } else {
    // console.log('afterDoubleSlash:', afterDoubleSlash);
    config.headers = {
      adminCheck: 'visitor',
      bloggerLoginCheck: localStorage.getItem('token') || '',
    };
  }

  let response;
  if (method === 'post' || method === 'put') {
    //axios将data自动序列化为json格式
    response = await axios[method]<IGlobalResponse<T>>(url, data, config);
  } else {
    response = await axios[method]<IGlobalResponse<T>>(url, config);
  }
  if (response.data.msg !== '登录信息失效') {
    return response;
  } else {
    localStorage.removeItem('token');
    // 重定向到根目录，重新登录
    let redirectpos = window.location.href;
    console.log(redirectpos);
    redirectpos = redirectpos.slice(0, redirectpos.indexOf('/', 10) + 1);
    console.log(redirectpos);
    window.location.href = redirectpos + 'admin/login';
  }
  return response;
}
export const Service = {
  //登录test
  login(props: ILoginProps) {
    return GlobalAxios<string>('post', '/login', props);
  },
  //登出test
  adminLoginout() {
    return GlobalAxios('get', '/admin/logout');
  },
  //   //管理员登录
  //   adminLogin(props: ILoginProps) {
  //     return GlobalAxios<string>("post", "/admin/login", props);
  //   },
  //   //管理员登出
  //   adminLoginout() {
  //     return GlobalAxios("get", "/admin/logout");
  //   },
  //   userSearch(props: string) {
  //     return GlobalAxios<ISearchProps[]>(
  //       "get",
  //       appendParams2Path("/func/search", { word: props })
  //     );
  //   },
  //   //根据分类获取所有文章列表（仅可见）（当classname为all时获取所有）
  //   getArticleList(props: string) {
  //     return GlobalAxios<IArticleList[]>(
  //       "get",
  //       appendParams2Path("/article/vlist", { classname: props })
  //     );
  //   },
  //   //根据分类获取所有文章列表（含不可见）
  //   getArticleListByClassify(props: string) {
  //     return GlobalAxios<IArticleList[]>(
  //       "get",
  //       appendParams2Path("/article/list", { classname: props })
  //     );
  //   },
  //   //props为文章id,获取文章详情
  //   getArticleDetail(props: string) {
  //     return GlobalAxios<IArticle>(
  //       "get",
  //       appendParams2Path("/article/page", { id: props })
  //     );
  //   },
  //   //获取分类
  //   getClassify() {
  //     return GlobalAxios<IAddClassifyData[]>(
  //       "get",
  //       appendParams2Path("/func/class", {})
  //     );
  //   },
  //   //添加分类
  //   addClassify(props: IAddClassify) {
  //     return GlobalAxios<undefined>("post", "/info/addC", props);
  //   },
  //   //文章编辑保存
  //   saveArticleEdit(props: IArticle) {
  //     return GlobalAxios<ISaveArticle>("put", "/article/edit", props);
  //   },
  //   //发布文章
  //   publishArticle(props: IArticle) {
  //     return GlobalAxios<undefined>("post", "/article/publish", props);
  //   },
  //   //发布评论/留言
  //   publishComment(props: IComment) {
  //     return GlobalAxios<undefined>("post", "/comment/add", props);
  //   },
  //   //根据文章ID获取评论
  //   getComment(props: string) {
  //     return GlobalAxios<IRootComment[]>(
  //       "get",
  //       appendParams2Path("/comment/pagecom", { id: props })
  //     );
  //   },
  //   //根据评论id删除评论
  //   deleteComment(props: string) {
  //     return GlobalAxios<undefined>(
  //       "delete",
  //       appendParams2Path("/comment/delete", { id: props })
  //     );
  //   },
  //   //根据文章ID取消文章发布
  //   cancelPublisArticle(props: string) {
  //     return GlobalAxios(
  //       "get",
  //       appendParams2Path("/article/unpublish", { id: props })
  //     );
  //   },
  //   //获取留言
  //   getMessage() {
  //     return GlobalAxios<IRootComment[]>(
  //       "get",
  //       appendParams2Path("/comment/message", {})
  //     );
  //   },
  //   //获取友情链接
  //   getFriendLink() {
  //     return GlobalAxios<IFriendLink[]>(
  //       "get",
  //       appendParams2Path("/func/flink", {})
  //     );
  //   },
  //   //添加友情链接
  //   addFriendLink(props: IFriendLink) {
  //     return GlobalAxios<undefined>("post", "/info/addF", props);
  //   },
  //   //友情链接编辑保存
  //   saveFriendLinkEdit(props: IFriendLink) {
  //     return GlobalAxios<undefined>("put", "/info/editF", props);
  //   },
  //   //分类编辑保存
  //   saveClassEdit(props: IClassEdit) {
  //     return GlobalAxios<undefined>("put", "/info/editC", props);
  //   },
  //   //删除友情/分类链接
  //   deleteFriOrClas(props: IDeleteFriOrClas) {
  //     return GlobalAxios(
  //       "delete",
  //       appendParams2Path("/info/delete", { name: props.name, type: props.type })
  //     );
  //   },
  //   //订阅
  //   subscribeBlog(props: { email: string }) {
  //     return GlobalAxios<undefined>("post", "/func/subscribe", props);
  //   },
  //   //获取统计数据
  //   getStatData() {
  //     return GlobalAxios<IData>("get", appendParams2Path("/func/stat", {}));
  //   },
  //   //获取统计总数
  //   getTotalData() {
  //     return GlobalAxios<ITotalNum>("get", appendParams2Path("/func/total", {}));
  //   },
  //   //编辑个人信息
  //   editPersonInfo(props: IPersonal) {
  //     return GlobalAxios<undefined>("put", "/admin/edit", props);
  //   },
  //   //获取个人信息
  //   getPersonInfo() {
  //     return GlobalAxios<IPersonal>("get", appendParams2Path("/about/page", {}));
  //   },
  //   //修改账号密码
  //   editPwd(props: ILoginProps) {
  //     return GlobalAxios<undefined>("put", "/admin/change", props);
  //   },
};
