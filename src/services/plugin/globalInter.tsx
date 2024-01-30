export const BASEURL = 'http://127.0.0.1:4523/m1/3961888-0-default';
export const titleName = '知识库问答';
export const loginPath = '/user/login';

export interface ILoginProps {
  userName: string;
  passWord: string;
  type: 0 | 1;
}

export interface IReturn<T = any> {
  data: T;
  status: number;
  msg: string;
}

export interface IHookFunc<T> {
  value: T;
  set: React.Dispatch<React.SetStateAction<T>>;
}

/**
valueEnum: {
          1: {
            text: '仅可问答',
            status: 'Default',
          },
          2: {
            text: '可见知识图谱',
            status: 'Processing',
          },
          3: {
            text: '所有可见',
            status: 'Success',
          },
          0: {
            text: '全不可见',
            status: 'Error',
          },
        },
 */
