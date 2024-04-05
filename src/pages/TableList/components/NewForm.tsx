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
import { RcFile } from 'antd/es/upload';
import { UploadFiles } from './UploadFiles';
import "./NewForm.scss"

export type FormValueType<T> = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<T>;
export interface INewFormProps<T> {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  onCancel: (flag?: boolean, formVals?: FormValueType<T>) => void;
  onSubmit: (values: FormValueType<T>) => Promise<void>;
  hook: {
    open: IHookFunc<boolean>;
    setFileList?: IHookFunc<File[]>;
  };
  key?: number;
}

export function NewKnowledgeBaseForm(props: INewFormProps<API.KnowledgeBaseListItem>) {

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
          name="status"
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
        {props.hook.setFileList === undefined ? null : (
          <UploadFiles
            // key={props.key}
            hook={{
              setFileList: {
                value: props.hook.setFileList?.value,
                set: props.hook.setFileList?.set,
              },
            }}
          />
        )}
      </StepsForm.StepForm>
    </StepsForm>
  );
}

export function NewKnowledgeBaseFileForm(props: INewFormProps<API.KnowledgeBaseFileListItem>) {
  return (
    <ModalForm
      title={'上传文件'}
      // width="25vw"
      width="fit-content"
      open={props.hook.open.value}
      onOpenChange={props.hook.open.set}
      onFinish={props.onSubmit}
      modalProps={{ destroyOnClose: true }}
    >
      {props.hook.setFileList === undefined ? null : (
        <UploadFiles
          key={props.key}//已有知识库新增文件时，key为知识库的key
          hook={{
            setFileList: {
              value: props.hook.setFileList?.value,
              set: props.hook.setFileList?.set,
            },
          }}
        />
      )}
    </ModalForm>
  );
}
