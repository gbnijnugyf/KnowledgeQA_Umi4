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