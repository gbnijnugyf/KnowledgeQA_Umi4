// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { BASEURL, IReturn } from '../plugin/globalInter';
import token from '../plugin/token';
import { RcFile } from 'antd/es/upload';
import { API } from './typings.d';

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
  return request<IReturn<API.KBList>>(BASEURL + '/getKnowledgeBase', {
    method: 'GET',
    //TODO: 看看返回参数是否有多余的
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 根据头部token信息验证用户身份，获取对应知识库列表 */
export async function myGetKnowledgeBaseListPart(
  params?: {
    // query
    /** 可能会使用id进行身份判断（仅根据token也行吧） */
    id?: number;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.KBList>>(BASEURL + '/getKnowledgeBasePart', {
    method: 'GET',
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
  return request<IReturn<API.KBList>>(BASEURL + '/getKnowledgeBaseFiles', {
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
  return request<IReturn<API.KnowledgeBaseListItem>>(BASEURL + '/updateKnowledgeBaseInfo', {
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

export async function myUploadKnowledgeBaseFile(props:{fileList: (string | Blob | RcFile)[], options?: { [key: string]: any }}) {
  const formData = new FormData();
  props.fileList.forEach((file) => {
    formData.append('files', file);
  });
  // 如果 options 存在，将其每个属性添加到 formData 中
  if (props.options) {
    Object.entries(props.options).forEach(([key, value]) => {
      formData.append(key, String(value)); // 将值转换为字符串
    });
  }
  return request<IReturn<string>>(BASEURL + '/uploadFiles', {
    method: 'POST',
    data: formData,
    //据说不用手动设置
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    formData,
  });
}

/** 获取问答记录  GET  */
export async function getHistoryMessage(
  params: {
    // query
    /** 知识库key */
    key: number;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<Array<API.MessageType>>>(BASEURL + '/getHistory', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 发送消息 POST */
export async function sendMessage(body: API.SendMessageBody, options?: { [key: string]: any }) {
  return request<IReturn<API.MessageType>>(BASEURL + '/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取知识图谱 */
export async function myGetGraph(
  params: {
    // query
    /** 知识库key */
    key: number;
  },
  options?: { [key: string]: any },
) {
  //注意！需要后端返回总数total，成功success
  return request<IReturn<API.Graph>>(BASEURL + '/getGraph', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取课程列表 /getCourses */
export async function myGetCourse(
  params: {
    // query
    /** 知识库key */
    option: number;
  },
  options?: { [key: string]: any },
) {
  //注意！需要后端返回总数total，成功success
  return request<IReturn<API.KnowledgeBaseListItem[]>>(BASEURL + '/getCourses', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}