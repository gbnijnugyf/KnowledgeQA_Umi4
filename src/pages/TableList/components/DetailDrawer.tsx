import { myGetKnowledgeBaseFiles, myUploadKnowledgeBaseFile } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { ActionType } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useEffect, useRef, useState } from 'react';
import { KnowledgeBaseFile } from '../tableData';
import { NewKnowledgeBaseFileForm } from './NewForm';
import { ITableRequest, TableList } from './TableList';
import { FormValueType, UpdateFileForm, UpdateForm } from './UpdateForm';

export interface IDetailDrawerProps {
  key: number; //用于请求具体数据
  baseName: string; //知识库名称
  hook: {
    open: IHookFunc<boolean>;
  };
}

export default function DetailDrawer(props: IDetailDrawerProps) {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.KnowledgeBaseFileListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.KnowledgeBaseFileListItem[]>([]);
  const [fileList, setFileList] = useState<(string | Blob | RcFile)[]>([]);

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    // 当 key 改变时，重新加载 ProTable 的数据
    handleModalOpen(false);
    handleUpdateModalOpen(false);
    setShowDetail(false);
    setCurrentRow(undefined);
    setSelectedRows([]);
    actionRef.current?.reload();
  }, [props.key]);

  const resquest: ITableRequest<API.KnowledgeBaseFileListItem> = async (p, sorter, filter) => {
    console.log(p, sorter, filter);
    //参数p是分页参数
    let params = { ...p, key: props.key };
    if (Object.keys(sorter).length !== 0) {
      params = { ...params, ...sorter };
    }
    if (Object.keys(filter).length !== 0) {
      params = { ...params, ...filter };
    }
    console.log('params', params);
    const res = await myGetKnowledgeBaseFiles({ ...params });
    console.log('1', res.data);
    return res.data;
  };
  const columns = KnowledgeBaseFile.getColumns({
    hooks: {
      openUpdate: {
        value: updateModalOpen,
        set: handleUpdateModalOpen,
      },
      openDetail: {
        value: showDetail,
        set: setShowDetail,
      },
      setCurrentRow: {
        value: currentRow,
        set: setCurrentRow,
      },
    },
  });
  const submitNewForm = async (value: FormValueType<API.KnowledgeBaseFileListItem>) => {
    // console.log(props.key, fileList);
    const res = await myUploadKnowledgeBaseFile({
      options: { key: props.key },
      fileList: fileList,
    });
    // console.log(res);
    if (res.status === 1) {
      handleUpdateModalOpen(false);
      setCurrentRow(undefined);
      handleModalOpen(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };
  return (
    <Drawer
      width={'80vw'}
      open={props.hook.open.value}
      onClose={() => {
        // setCurrentRow(undefined);
        props.hook.open.set(false);
      }}
      closable={false}
    >
      <TableList<API.KnowledgeBaseFileListItem>
        component={{
          NewForm: NewKnowledgeBaseFileForm,
          UpdateForm: UpdateFileForm,
        }}
        hooks={{
          openCreate: {
            value: createModalOpen,
            set: handleModalOpen,
          },
          openUpdate: {
            value: updateModalOpen,
            set: handleUpdateModalOpen,
          },
          openDetail: {
            value: showDetail,
            set: setShowDetail,
          },
          setCurrentRow: {
            value: currentRow,
            set: setCurrentRow,
          },
          setRowState: {
            value: selectedRowsState,
            set: setSelectedRows,
          },
          ref: actionRef,
          setFileList: {
            value: fileList,
            set: setFileList,
          },
        }}
        data={{ columns: columns, title: props.baseName }}
        request={resquest}
        submitNewForm={submitNewForm}
      />
    </Drawer>
  );
}
