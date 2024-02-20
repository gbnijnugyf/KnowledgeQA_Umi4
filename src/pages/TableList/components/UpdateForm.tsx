import { myUpdateKnowledgeBase } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import {
  ActionType,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.KnowledgeBaseListItem>;

export interface IUpdateFormProps {
  // onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  // onSubmit: (values: FormValueType) => Promise<void>;
  // updateModalOpen: boolean;
  values: Partial<API.KnowledgeBaseListItem>;
  key: number;
  hook: {
    open: IHookFunc<boolean>;
  };
  actionRef: React.MutableRefObject<ActionType | undefined>;
}

export function UpdateForm(props: IUpdateFormProps) {
  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('配置中');
    try {
      const res = await myUpdateKnowledgeBase({
        name: fields.name,
        desc: fields.desc,
        //TODO:key直接获取
        key: fields.key,
        stattus: fields.status,
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
        width="25vw"
        open={props.hook.open.value}
        onOpenChange={props.hook.open.set}
        initialValues={{
          name: props.values.name,
          desc: props.values.desc,
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
    // <StepsForm
    //   stepsProps={{
    //     size: 'small',
    //   }}
    //   stepsFormRender={(dom, submitter) => {
    //     return (
    //       <Modal
    //         width={640}
    //         // styles={{padding:'32px 40px 48px'}}
    //         bodyStyle={{ padding: '32px 40px 48px' }}
    //         destroyOnClose
    //         title={
    //           <>
    //             <h1>规则配置</h1>
    //             <span style={{ fontWeight: 'lighter', color: 'rgba(128, 128, 128, 0.5)' }}>
    //               知识库文件请点击名称进行设置
    //             </span>
    //           </>
    //         }
    //         open={props.updateModalOpen}
    //         footer={submitter}
    //         onCancel={() => {
    //           props.onCancel();
    //         }}
    //       >
    //         {dom}
    //       </Modal>
    //     );
    //   }}
    //   onFinish={props.onSubmit}
    // >
    //   <StepsForm.StepForm
    //     initialValues={{
    //       name: props.values.name,
    //       desc: props.values.desc,
    //     }}
    //     title="基本信息"
    //   >
    //     <ProFormText
    //       name="name"
    //       label="规则名称"
    //       width="md"
    //       rules={[
    //         {
    //           required: true,
    //           message: '请输入规则名称！',
    //         },
    //       ]}
    //     />
    //     <ProFormTextArea
    //       name="desc"
    //       width="md"
    //       label="规则描述"
    //       placeholder="请输入至少五个字符"
    //       rules={[
    //         {
    //           required: true,
    //           message: '请输入至少五个字符的规则描述！',
    //           min: 5,
    //         },
    //       ]}
    //     />
    //   </StepsForm.StepForm>
    //   <StepsForm.StepForm
    //     initialValues={{
    //       target: '0',
    //       template: '0',
    //     }}
    //     title="配置规则属性"
    //   >
    //     <ProFormSelect
    //       name="target"
    //       width="md"
    //       label="监控对象"
    //       valueEnum={{
    //         0: '表一',
    //         1: '表二',
    //       }}
    //     />
    //     <ProFormSelect
    //       name="template"
    //       width="md"
    //       label="规则模板"
    //       valueEnum={{
    //         0: '规则模板一',
    //         1: '规则模板二',
    //       }}
    //     />
    //     <ProFormRadio.Group
    //       name="type"
    //       label="规则类型"
    //       options={[
    //         {
    //           value: '0',
    //           label: '强',
    //         },
    //         {
    //           value: '1',
    //           label: '弱',
    //         },
    //       ]}
    //     />
    //   </StepsForm.StepForm>
    //   <StepsForm.StepForm
    //     initialValues={{
    //       type: '1',
    //       frequency: 'month',
    //     }}
    //     title="设定调度周期"
    //   >
    //     <ProFormDateTimePicker
    //       name="time"
    //       width="md"
    //       label="开始时间"
    //       rules={[
    //         {
    //           required: true,
    //           message: '请选择开始时间！',
    //         },
    //       ]}
    //     />
    //     <ProFormSelect
    //       name="frequency"
    //       label="监控对象"
    //       width="md"
    //       valueEnum={{
    //         month: '月',
    //         week: '周',
    //       }}
    //     />
    //   </StepsForm.StepForm>
    // </StepsForm>
  );
}
