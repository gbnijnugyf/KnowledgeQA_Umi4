import { SelectTtile } from '@/pages/ChatPage/components/SelectTitle';
import { addDialog } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { ProForm, ProFormItem, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.KnowledgeBaseListItem>;

export interface INewFormProps {
  onFlush: IHookFunc<boolean>;
}
export function NewDialogPage(props: INewFormProps) {
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
    const res = await addDialog(value);
    console.log(res);
    if (res.status === 1) {
      message.success('创建成功');
      props.onFlush.set(!props.onFlush.value);
    } else {
      message.error('创建失败');
    }
  };
  return (
    <ProForm
      onFinish={onSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>新建对话</h2>

      <ProFormText
        name="name"
        label="对话名称"
        // width="md"
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
        <SelectTtile<number[]> mode="multiple" placeholder="创建后不可修改！" />
      </ProFormItem>
    </ProForm>
  );
}
