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
      token: token.get() || '',
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

/** 退出登录接口 POST /outLogin */
export async function myOutLogin(options?: { [key: string]: any }) {
  return request<IReturn<undefined>>(BASEURL + '/outLogin', {
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
// export async function myGetKnowledgeBaseListPart(
//   params?: {
//     // query
//     /** 可能会使用id进行身份判断（仅根据token也行吧） */
//     id?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<IReturn<API.KBList>>(BASEURL + '/getKnowledgeBasePart', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
/** 获取知识库具体文件列表 GET /getKnowledgeBaseFiles */
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
  return request<IReturn<API.KBFileList>>(BASEURL + '/getKnowledgeBaseFiles', {
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

/** 更新知识库文件 */
export async function myUpdateKnowledgeBaseFile(options?: { [key: string]: any }) {
  return request<IReturn<API.KnowledgeBaseFileListItem>>(BASEURL + '/updateKnowledgeBaseFile', {
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
export async function myRemoveBase(options?: { [key: string]: any }) {
  return request<Record<string, any>>(BASEURL + '/delKnowledgeBase', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
export async function myRemoveBaseFile(props:{basekey:number,  [key: string]: any }) {
  return request<Record<string, any>>(BASEURL + '/delKnowledgeBaseFile', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(props || {}),
    },
  });
}

export async function myUploadKnowledgeBaseFile(props: {
  fileList: any[];
  options?: { [key: string]: any };
}) {
  const formData = new FormData();
  //多文件上传，formData的append方法，对于同一个key会将新添加的key/value添加到后面，不会覆盖已经存在的key
  props.fileList.forEach((file) => {
    //originFileObj才是文件内容
    formData.append('file', file.originFileObj);
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
  // console.log(body)
  return request<IReturn<API.sendMessageType>>(BASEURL + '/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除消息 /deleteMessage */
export async function deleteMessage(key: number, options?: { [key: string]: any }) {
  return request<IReturn<undefined>>(BASEURL + '/deleteMessage', {
    method: 'POST',
    data: {
      method: 'delete',
      key: key,
      ...(options || {}),
    },
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
  return request<IReturn<API.Graph>>(BASEURL + '/getGraph', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取课程列表 /getCourses */
export async function myGetCourses(
  params: {
    // query
    /** 获取场景 */
    option: number;
    word?: string;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.KnowledgeBaseListItem[]>>(BASEURL + '/getCourses', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取特定课程 /getSingleCourse */
export async function myGetCourse(
  params: {
    // query
    /** 知识库key */
    key: number;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.KnowledgeBaseListItem>>(BASEURL + '/getSingleCourse', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取对话列表 /getDialogs */
export async function myGetDialogs(
  params: {
    // query
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.DialogListItem[]>>(BASEURL + '/getDialogs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取对话列表 /getRecommendTags */
export async function myGetRecommendTags(
  params: {
    // query
    key:number
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<string[]>>(BASEURL + '/getRecommendTags', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建对话 /addDialog */
export async function addDialog(body: API.DialogInfo, options?: { [key: string]: any }) {
  return request<IReturn<number>>(BASEURL + '/addDialog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      method: 'add',
      ...body,
    },
    ...(options || {}),
  });
}

/** 删除对话 /deleteDialog */
export async function deleteDialog(key: number, options?: { [key: string]: any }) {
  return request<IReturn<undefined>>(BASEURL + '/deleteDialog', {
    method: 'POST',
    data: {
      method: 'delete',
      key: key,
      ...(options || {}),
    },
  });
}

/** 编辑对话名称 */ //暂未实现

/** 用户输入前获取推荐输入 /getRecommendedInput */
export async function myGetRecommendedInput(
  params: {
    // query
    key: number;
    text: string;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<string[]>>(BASEURL + '/getRecommendedInput', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 学生添加课程 /addCourse */
export async function addCourse(key: number, options?: { [key: string]: any }) {
  return request<IReturn<undefined>>(BASEURL + '/addCourse', {
    method: 'POST',
    data: {
      method: 'add',
      key: key,
      ...(options || {}),
    },
  });
}

/** 学生删除课程 /deleteCourse */
export async function deleteCourse(key: number, options?: { [key: string]: any }) {
  return request<IReturn<undefined>>(BASEURL + '/deleteCourse', {
    method: 'POST',
    data: {
      method: 'delete',
      key: key,
      ...(options || {}),
    },
  });
}

/** 获取学生列表 */
export async function getStudentsList(
  params: {
    // query
    key: number;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.StudentInfo[]>>(BASEURL + '/getStudents', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 重新加载信息 */
export async function reloadMessage(
  params: {
    // query
    key: number;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<API.MessageType>>(BASEURL + '/reloadMessage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取具体推荐内容 */
export async function getRecommend(
  params: {
    // query
    key: number;
    name: string;
  },
  options?: { [key: string]: any },
) {
  return request<IReturn<string>>(BASEURL + '/getRecommend', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
