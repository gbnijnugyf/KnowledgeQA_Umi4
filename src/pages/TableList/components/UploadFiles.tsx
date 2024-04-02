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

  function isAcceptType(typeStr: string | undefined) {
    return (
      typeStr === 'application/pdf' ||
      typeStr === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      typeStr === 'text/plain' ||
      typeStr === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      typeStr === 'application/vnd.ms-excel'
    );
  }

  return (
    <Dragger
      accept={'.pdf,.docx,.txt,.pptx,.xls'}
      name="file"
      multiple={true}
      maxCount={10}
      style={{ width: 'fit-content' }}
      // action={`http://localhost:8080/api/knowledgebase/${props.key}/file`}
      beforeUpload={(e) => {
        // 限制文件大小
        const isSize = e.size / 1024 / 1024;
        if (isSize > 60) {
          message.error('文件大小不可超过60M')
          return Upload.LIST_IGNORE;
        }

        if (!isAcceptType(e.type)) {
          console.log('1：', e.type);
          message.error('不支持的文件类型');
          return Upload.LIST_IGNORE;
        }
      }}
      onChange={(info) => {
        // console.log(info.fileList, info.file);
        props.hook.setFileList.set(info.fileList as unknown as File[]);
        // console.log(info);
        // console.log(props.hook.setFileList.value);
        if (isAcceptType(info.file.type)) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          // message.success(`${info.file.name} 添加成功.`);

          // if (status === 'done') {
          //   message.success(`${info.file.name} 添加成功.`);
          // } 
          // else if (status === 'error') {
          //   message.error(`${info.file.name} 添加失败.`);
          // }
          if (status === 'error') {
            message.error(`${info.file.name} 添加失败.`);
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
      <p className="ant-upload-text">点击或拖拽文件(pdf、txt、docx、pptx、xls)至此上传</p>
      <p className="ant-upload-hint">支持多文件上传</p>
    </Dragger>
  );
}
