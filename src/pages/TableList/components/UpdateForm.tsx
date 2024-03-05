import { myUpdateKnowledgeBase, myUpdateKnowledgeBaseFile } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import {
  ActionType,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';

export type FormValueType<T> = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<T>;

export interface IUpdateFormProps<T> {
  // onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  // onSubmit: (values: FormValueType) => Promise<void>;
  // updateModalOpen: boolean;
  values: Partial<T>;
  key: number;
  hook: {
    open: IHookFunc<boolean>;
  };
  actionRef: React.MutableRefObject<ActionType | undefined>;
}

export function UpdateForm(props: IUpdateFormProps<API.KnowledgeBaseListItem>) {
  const handleUpdate = async (fields: FormValueType<API.KnowledgeBaseListItem>) => {
    const hide = message.loading('配置中');
    try {
      let statusTemp = 0;
      if (fields.status + '' === '1' || fields.status + '' === '仅可问答') {
        statusTemp = 1;
      }
      if (fields.status + '' === '2' || fields.status + '' === '可见知识图谱') {
        statusTemp = 2;
      }
      if (fields.status + '' === '3' || fields.status + '' === '所有可见') {
        statusTemp = 3;
      }
      const res = await myUpdateKnowledgeBase({
        name: fields.name,
        desc: fields.desc,
        //TODO:key直接获取
        key: fields.key,
        status: statusTemp,
      });
      console.log(res);
      hide();

      message.success('配置成功');
      return true;
    } catch (error) {
      hide();
      message.error('配置失败，请重试！');
      return false;
    }
  };

  return (
    <>
      <ModalForm
        title={'配置基本信息'}
        // width="25vw"
        width="fit-content"
        open={props.hook.open.value}
        onOpenChange={props.hook.open.set}
        initialValues={{
          name: props.values.name,
          desc: props.values.desc,
          status:
            props.values.status === 0
              ? '全不可见'
              : props.values.status === 1
              ? '仅可问答'
              : props.values.status === 2
              ? '可见知识图谱'
              : props.values.status === 3
              ? '所有可见'
              : '未知状态',
        }}
        onFinish={async (value) => {
          const value_ = { ...value, key: props.key };
          console.log(value_);
          const success = await handleUpdate(value_ as API.KnowledgeBaseListItem);
          if (success) {
            props.hook.open.set(false);
            if (props.actionRef.current) {
              props.actionRef.current.reload();
            }
          }
        }}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '名称是必须的',
            },
          ]}
          width="md"
          name="name"
          label="名称"
        />
        <ProFormTextArea
          width="md"
          name="desc"
          label="描述"
          rules={[
            {
              required: true,
              message: '描述是必须的',
            },
          ]}
        />
        <ProFormSelect
          name="status"
          label="可见性"
          width="md"
          valueEnum={{
            0: '全不可见',
            1: '仅可问答',
            2: '可见知识图谱',
            3: '所有可见',
          }}
          rules={[
            {
              required: true,
              message: '可见性是必须的',
            },
          ]}
        />
      </ModalForm>
    </>
  );
}

export function UpdateFileForm(props: IUpdateFormProps<API.KnowledgeBaseFileListItem>) {
  const handleUpdate = async (fields: FormValueType<API.KnowledgeBaseFileListItem>) => {
    const hide = message.loading('配置中');
    try {
      let statusTemp = 1;
      if (fields.status + '' === '0' || fields.status + '' === '不可见') {
        statusTemp = 0;
      }
      const res = await myUpdateKnowledgeBaseFile({
        name: fields.name,
        //TODO:key直接获取
        key: fields.key,
        stattus: statusTemp,
      });
      console.log(res);
      hide();

      message.success('配置成功');
      return true;
    } catch (error) {
      hide();
      message.error('配置失败，请重试！');
      return false;
    }
  };

  return (
    <>
      <ModalForm
        title={'配置基本信息'}
        width="fit-content"
        open={props.hook.open.value}
        onOpenChange={props.hook.open.set}
        initialValues={{
          name: props.values.name,
          status: props.values.status === 1 ? '可见' : '不可见',
        }}
        onFinish={async (value) => {
          const value_ = { ...value, key: props.key };
          console.log(value_);
          const success = await handleUpdate(value_ as API.KnowledgeBaseFileListItem);
          if (success) {
            props.hook.open.set(false);
            if (props.actionRef.current) {
              props.actionRef.current.reload();
            }
          }
        }}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '名称是必须的',
            },
          ]}
          width="md"
          name="name"
          label="名称"
        />
        <ProFormSelect
          name="status"
          label="可见性"
          width="md"
          valueEnum={{
            0: '不可见',
            1: '可见',
          }}
          rules={[
            {
              required: true,
              message: '可见性是必须的',
            },
          ]}
        />
      </ModalForm>
    </>
  );
}
