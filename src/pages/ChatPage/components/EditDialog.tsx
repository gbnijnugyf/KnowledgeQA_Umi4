import { deleteDialog } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { ModalForm } from '@ant-design/pro-components';
import { Modal, message } from 'antd';

interface IEditDialogModal {
  open: IHookFunc<boolean>;
  flush: IHookFunc<boolean>;
  key_id: number;
  name: string;
  dialogs: API.DialogListItem[];
}
export function EditDialogModal(props: IEditDialogModal) {
  async function handleOk() {
    const res = await deleteDialog(props.key_id);
    // console.log(res);
    if (res.status === 1) {
      message.info('删除成功');
      props.flush.set(!props.flush.value);
      props.open.set(false);
    } else {
      message.error('删除失败');
    }
  }
  const dialog = props.dialogs.find((dialog) => dialog.key === props.key_id);
  return (
    <Modal
      // title={'配置基本信息'}
      title={'关联知识库'}
      // width="25vw"
      className='edit-modal'
      width="fit-content"
      open={props.open.value}
      onCancel={()=>props.open.set(false)}
      // onOpenChange={props.open.set}
      // initialValues={{
      //   name: props.name,
      // }}
      footer={[]}
      // onFinish={async (value) => {
      //   const value_ = { ...value, key: props.key_id };
      //   // console.log(value_);
      //   // const res = await handleUpdate(value_ as API.KnowledgeBaseListItem);
      //   // console.log(res);
      // }}
      // modalProps={{ destroyOnClose: true }}
    >
      {(dialog !==undefined && dialog?.Kbase.length>0)? dialog?.Kbase.map((kbase) => (
        <div>{kbase.name}</div>
      )):<p>暂无关联知识库，请勿使用该对话</p>}
      {/* <ProFormText
        rules={[
          {
            required: true,
            message: '名称是必须的',
          },
        ]}
        width="md"
        name="name"
        label="名称"
      /> */}
    </Modal>
  );
}
