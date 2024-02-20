import { deleteDialog } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

interface IEditDialogModal {
  open: IHookFunc<boolean>;
  flush: IHookFunc<boolean>;
  key: number;
  name: string;
}
export function EditDialogModal(props: IEditDialogModal) {
  async function handleOk() {
    const res = await deleteDialog(props.key);
    console.log(res);
    if (res.status === 1) {
      message.info('删除成功');
      props.flush.set(!props.flush.value);
      props.open.set(false);
    } else {
      message.error('删除失败');
    }
  }

  return (
    <ModalForm
      title={'配置基本信息'}
      width="25vw"
      open={props.open.value}
      onOpenChange={props.open.set}
      initialValues={{
        name: props.name,
      }}
      onFinish={async (value) => {
        const value_ = { ...value, key: props.key };
        console.log(value_);
        // const res = await handleUpdate(value_ as API.KnowledgeBaseListItem);
        // console.log(res);
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
    </ModalForm>
  );
}
