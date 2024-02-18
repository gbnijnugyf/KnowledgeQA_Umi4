import { addCourse } from '@/action';
import { myUploadKnowledgeBaseFile } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, message, theme } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { connect } from 'react-redux';
import { NewKnowledgeBaseForm } from '../TableList/components/NewForm';
import { FormValueType } from '../TableList/components/UpdateForm';

export function CourseManage(props: { v: number }) {
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

  if (props.v === -1) {
    console.log('课程不存在');
    handleModalOpen(true);
    // return (
    //   <PageContainer>
    //     <NewKnowledgeBaseForm
    //       hook={{
    //         open: { value: createModalOpen, set: handleModalOpen },
    //         setFileList: { value: fileList, set: setFileList },
    //       }}
    //       onSubmit={submitNewForm}
    //       onCancel={() => {
    //         handleModalOpen(false);
    //       }}
    //     />
    //   </PageContainer>
    // );
  } 
//   else {
    return (
      <PageContainer>
        <Card>{props.v === 0 ? '该课程已不可见' : '课程详情' + props.v}</Card>
        <NewKnowledgeBaseForm
          hook={{
            open: { value: createModalOpen, set: handleModalOpen },
            setFileList: { value: fileList, set: setFileList },
          }}
          onSubmit={submitNewForm}
          onCancel={() => {
            handleModalOpen(false);
          }}
        />
      </PageContainer>
    );
//   }
}
// const mapDispatchToProps = {
//   handleModalOpen: addCourse,
// };

// export default connect(null, mapDispatchToProps)(CourseManage);