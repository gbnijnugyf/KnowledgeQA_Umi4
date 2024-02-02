// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type KnowledgeBaseListItem = {
    key?: number; // 键，唯一标识
    disabled?: boolean; // 是否禁用，通常用于控制项目是否可以操作
    href?: string; // 链接，可能是该项目的详细信息页链接
    avatar?: string; // 头像，通常是用户或项目的头像图片链接
    name?: string; // 名称
    owner?: string; // 所有者，可能是项目的所有者或责任人
    desc?: string; // 描述，对项目的简短描述
    callNo?: number; // 可能是呼叫号码或其他数字标识
    status?: number; // 状态，通常用于表示项目的状态（如：进行中，已完成等）
    updatedAt?: string; // 更新时间，最后一次更新项目的时间
    createdAt?: string; // 创建时间，项目的创建时间
    progress?: number; // 进度，通常用于表示项目的完成进度
  };

  type KBList = {
    data?: KnowledgeBaseListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
  // type myKBListItem = {
  //   key: string; // 键，唯一标识
  //   name: string; // 名称
  // };
  type myKBList = {
    data: myKBListItem[];
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };
  type MessageBody = {
    text: string;
    key: number; //知识库标识
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
