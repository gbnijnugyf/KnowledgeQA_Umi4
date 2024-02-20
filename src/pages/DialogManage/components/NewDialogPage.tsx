import { patchClientRoutes } from '@/app';
import { SelectTtile } from '@/pages/ChatPage/components/SelectTitle';
import { addDialog, myGetDialogs } from '@/services/ant-design-pro/api';
import { PageContainer, ProForm, ProFormItem, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { history } from 'umi';
import routes from '../../../../config/routes';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.KnowledgeBaseListItem>;

// export interface INewFormProps {
//   // actionRef: React.MutableRefObject<ActionType | undefined>;
//   onCancel: (flag?: boolean, formVals?: FormValueType) => void;
//   onSubmit: (values: FormValueType) => Promise<void>;
//   hook: {
//     open: IHookFunc<boolean>;
//     setFileList?: IHookFunc<(string | Blob | RcFile)[]>;
//   };
//   key?: number;
// }

export function NewDialogPage() {
  // 声明状态
  const [fileList, setFileList] = useState<(string | Blob | RcFile)[]>([]);
  const [knowledgeBaseKey, setKnowledgeBaseKey] = useState<Array<number>>([]);
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
  useEffect(() => {
    console.log('fileList:', knowledgeBaseKey);
  }, [knowledgeBaseKey]);

  const onSubmit = async (value: any) => {
    // 在这里处理提交事件
    history.push('/chat/course');
    const res = await addDialog(value);
    console.log(res);
    if (res.status === 1) {
      //TODO: 菜单刷新问题
      message.success('创建成功');
      // console.log('routes:', {routes});

      // let extraRoutes_: any;
      // await fetchUserInfoHere();
      // const urlParams = new URL(window.location.href).searchParams;
      // history.push(urlParams.get('redirect') || '/chat/course');

      // myGetDialogs({}).then(async (res) => {
      //   console.log(res);
      //   if (res.status === 1) {
      //     extraRoutes_ = res.data;
      //     await patchClientRoutes({ routes: routes, extraRoutes: extraRoutes_, auto: false });
      //   } else {
      //     message.error('获取菜单列表失败，请刷新');
      //   }
      // });

      window.location.reload();
      // window.location.href('/chat/course' + res.data);
      history.push(`/chat/course${res.data}`);
      // history.push(`/chat/course128`);
    } else {
      message.error('创建失败');
    }
  };
  return (
    <PageContainer title="新建对话">
      <Card>
        <ProForm
          onFinish={onSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ProFormText
            name="name"
            label="对话名称"
            placeholder={'创建后不可修改'}
            width="md"
            rules={[
              {
                required: true,
                message: '请输入知识库名称！',
              },
            ]}
          />
          <ProFormItem
            name="Kbase"
            label="关联课程"
            rules={[
              {
                required: true,
                message: '请选择关联课程！',
              },
            ]}
          >
            <SelectTtile<number[]> mode="multiple" width={325} />
          </ProFormItem>
        </ProForm>
      </Card>
    </PageContainer>
  );
}
