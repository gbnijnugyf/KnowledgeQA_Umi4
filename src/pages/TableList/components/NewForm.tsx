import { IHookFunc } from '@/services/plugin/globalInter';
import {
  ActionType,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import { IUpdateFormProps } from './UpdateForm';
import { UploadFiles } from './UploadFiles';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.KnowledgeBaseListItem>;
export interface INewFormProps {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  hook: {
    open: IHookFunc<boolean>;
  };
}

export function NewKnowledgeBaseForm(props: INewFormProps) {
  // const handleAdd = async (fields: API.KnowledgeBaseListItem) => {
  //   const hide = message.loading('正在添加');
  //   try {
  //     await addRule({ ...fields });
  //     hide();
  //     message.success('Added successfully');
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('Adding failed, please try again!');
  //     return false;
  //   }
  // };

  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            destroyOnClose
            title={
              <>
                <h1>知识库配置</h1>
                <span style={{ fontWeight: 'lighter', color: 'rgba(128, 128, 128, 0.5)' }}>
                  知识库文件请点击名称进行设置
                </span>
              </>
            }
            open={props.hook.open.value}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm title="基本信息">
        <ProFormText
          name="name"
          label="知识库名称"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入知识库名称！',
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label="知识库描述"
          placeholder="请输入至少五个字符"
          rules={[
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 5,
            },
          ]}
        />
        <ProFormSelect
          name="template"
          width="md"
          label="知识库可见性"
          valueEnum={{
            0: '全不可见',
            1: '仅可问答',
            2: '可见知识图谱',
            3: '所有可见',
          }}
          rules={[
            {
              required: true,
              message: '请选择知识库可见性！',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm title="上传知识库文件">
        <UploadFiles />
      </StepsForm.StepForm>
    </StepsForm>
  );
}

export function NewKnowledgeBaseFileForm(props: INewFormProps) {
  return (
    <ModalForm
      title={'上传文件'}
      width="25vw"
      open={props.hook.open.value}
      onOpenChange={props.hook.open.set}
      onFinish={async (value) => {
        // const value_ = { ...value, key: props.key };
        // console.log(value_);
        // const success = await handleUpdate(value_ as API.KnowledgeBaseListItem);
        console.log(value);
        //TODO: 记得把判断条件改回来
        if (true) {
          props.hook.open.set(false);
          if (props.actionRef.current) {
            props.actionRef.current.reload();
          }
        }
      }}
      modalProps={{ destroyOnClose: true }}
    >
      <UploadFiles />
    </ModalForm>
  );
}
