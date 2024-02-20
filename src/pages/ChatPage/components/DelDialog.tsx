import { deleteDialog } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { Modal, message } from 'antd';

interface IDelDialogModal {
  open: IHookFunc<boolean>;
  flush: IHookFunc<boolean>;
  key: number;
  name:string
}
export function DelDialogModal(props: IDelDialogModal) {
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
    <Modal
      title="确认操作"
      open={props.open.value}
      onOk={handleOk}
      onCancel={() => props.open.set(false)}
    >
      <p>你确定要删除该对话吗？</p>
    </Modal>
  );
}
