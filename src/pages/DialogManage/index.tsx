import { myUploadKnowledgeBaseFile } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, message, theme } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { FormValueType } from '../TableList/components/UpdateForm';
import { NewDialogPage } from './components/NewDialogPage';

export function DialogManage(props: { v: number }) {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [fileList, setFileList] = useState<(string | Blob | RcFile)[]>([]);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const submitNewForm = async (value: FormValueType) => {
    // console.log(value, fileList);
    if (Object.keys(value).length === 0) {
      message.warning('请完整填写表单');
      return;
    }
    const res = await myUploadKnowledgeBaseFile({
      options: { ...value },
      fileList: fileList,
    });
    // console.log(res);
    if (res.status === 1) {
      handleModalOpen(false);
    }
  };

  return (
    <>
      {props.v === -1 ? (
        <NewDialogPage />
      ) : (
        <PageContainer>
          <Card>{props.v === 0 ? '该对话已不可见' : '对话详情' + props.v}</Card>
        </PageContainer>
      )}
    </>
  );
}
// const mapDispatchToProps = {
//   handleModalOpen: addCourse,
// };

// export default connect(null, mapDispatchToProps)(CourseManage);
