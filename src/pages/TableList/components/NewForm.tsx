import { addRule } from '@/services/ant-design-pro/api';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import { useState } from 'react';

export interface INewFormProps {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  hook: {
    open: {
      value: boolean;
      set: React.Dispatch<React.SetStateAction<boolean>>;
    };
  };
}

export function NewForm(props:INewFormProps) {
  const handleAdd = async (fields: API.KnowledgeBaseListItem) => {
    const hide = message.loading('正在添加');
    try {
      await addRule({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };
  return (
    <ModalForm
      title={'上传文件新增知识库'}
      width="50vw"
      open={props.hook.open.value}
      onOpenChange={props.hook.open.set}
      onFinish={async (value) => {
        const success = await handleAdd(value as API.KnowledgeBaseListItem);
        if (success) {
          props.hook.open.set(false);
          if (props.actionRef.current) {
            props.actionRef.current.reload();
          }
        }
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: 'Rule name is required',
          },
        ]}
        width="md"
        name="name"
      />
      <ProFormTextArea width="md" name="desc" />
    </ModalForm>
  );
}
