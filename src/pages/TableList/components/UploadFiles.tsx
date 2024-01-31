import { IHookFunc } from '@/services/plugin/globalInter';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';

const { Dragger } = Upload;

export interface IUploadFormProps {
  options?: { [key: string]: any };
  hook: {
    setFileList: IHookFunc<(string | Blob | RcFile)[]>;
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
      name="file"
      multiple={true}
      style={{ width: '100%' }}
      // action={`http://localhost:8080/api/knowledgebase/${props.key}/file`}
      onChange={(info) => {
        props.hook.setFileList.set(info.fileList as (string | Blob | RcFile)[]);
        console.log(info);
        console.log(props.hook.setFileList.value);
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
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
      <p className="ant-upload-text">点击或拖拽文件至此上传</p>
      <p className="ant-upload-hint">支持多文件上传</p>
    </Dragger>
  );
}
