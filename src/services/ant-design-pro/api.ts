// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { BASEURL, IReturn } from '../plugin/globalInter';
import token from '../plugin/token';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}
export async function myCurrentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>(BASEURL + '/fetchUserInfo', {
    method: 'GET',
    headers: {
      Authorization: token.get() || '',
    },
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function myLogin(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<IReturn<string>>(BASEURL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取知识库列表 GET /getKnowledgeBase */
export async function myGetKnowledgeBaseList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    /** 排序参数 */
    sorter?: any;
    /** 过滤参数 */
    filter?: any;
  },
  options?: { [key: string]: any },
) {
  //注意！需要后端返回总数total，成功success
  return request<IReturn<API.RuleList>>(BASEURL + '/getKnowledgeBase', {
    method: 'GET',
    //TODO: 看看返回参数是否有多余的
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取知识库具体信息 GET /getKnowledgeBaseFiles */
export async function myGetKnowledgeBaseFiles(
  params: {
    // query
    /** 知识库key */
    key?: number;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  //注意！需要后端返回总数total，成功success
  return request<IReturn<API.RuleList>>(BASEURL + '/getKnowledgeBaseFiles', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.KnowledgeBaseListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}
export async function myUpdateKnowledgeBase(options?: { [key: string]: any }) {
  return request<IReturn<API.KnowledgeBaseListItem>>(BASEURL+'/updateKnowledgeBaseInfo', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.KnowledgeBaseListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
export async function myRemoveRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>(BASEURL + '/delKnowledgeBase', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
