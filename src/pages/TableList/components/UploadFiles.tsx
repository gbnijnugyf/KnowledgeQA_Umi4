import { IHookFunc } from '@/services/plugin/globalInter';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Upload, message } from 'antd';

const { Dragger } = Upload;

export interface IUploadFormProps {
  options?: { [key: string]: any };
  hook: {
    setFileList: IHookFunc<File[]>;
  };
}

export function UploadFiles(props: IUploadFormProps) {
  const itemRender = (
    originNode: React.ReactElement,
    file: UploadFile<any>,
    fileList: Array<UploadFile<any>>,
    actions: {
      download: () => void;
      preview: () => void;
      remove: () => void;
    },
  ) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>{file.name}</div>
        <DeleteOutlined onClick={actions.remove} />
      </div>
    );
  };

  return (
    <Dragger
      accept={'.pdf,.docx,.txt'}
      name="file"
      multiple={true}
      style={{ width: 'fit-content' }}
      // action={`http://localhost:8080/api/knowledgebase/${props.key}/file`}
      beforeUpload={(e)=>{
        if (e.type !== 'application/pdf' && e.type !== 'text/plain' && e.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // console.log("1：", e.type)
          message.error('不支持的文件类型')
          return Upload.LIST_IGNORE;
        }
      }}
      onChange={(info) => {
        // console.log(info.fileList, info.file);
        props.hook.setFileList.set(info.fileList as unknown as File[]);
        // console.log(info);
        // console.log(props.hook.setFileList.value);
        if (info.file.type === 'application/pdf' || info.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || info.file.type === 'text/plain') {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }
      }}
      onDrop={(e) => {
        console.log('Dropped files', e.dataTransfer.files);
      }}
      itemRender={itemRender}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件(pdf、txt、docx)至此上传</p>
      <p className="ant-upload-hint">支持多文件上传</p>
    </Dragger>
  );
}
