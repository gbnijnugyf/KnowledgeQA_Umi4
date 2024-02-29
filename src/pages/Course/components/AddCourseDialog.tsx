import { IHookFunc } from '@/services/plugin/globalInter';
import { Button, Modal } from 'antd';

interface IAddCourseDialog {
  open: IHookFunc<boolean>;
  //   flush: IHookFunc<boolean>;
  course: API.KnowledgeBaseListItem | undefined;
}
export function AddCourseDialog(props: IAddCourseDialog) {
  async function handleOk() {}

  return (
    <>
      {props.course !== undefined ? (
        <Modal
          title={props.course.name}
          open={props.open.value}
          onOk={handleOk}
          onCancel={() => props.open.set(false)}
        >
          <p>授课教师：{props.course.owner}</p>
          <div>创建于 {props.course.createdAt}</div>
          <p>简述：{props.course.desc}</p>
          <p>你确定要添加该课程？</p>
        </Modal>
      ) : (
        <Modal
          open={props.open.value}
          footer={[
            <Button key="submit" type="primary" onClick={() => props.open.set(false)}>
              确定
            </Button>,
          ]}
        >
          <p>该课程已不可见</p>
        </Modal>
      )}
    </>
  );
}
