import { myGetKnowledgeBaseList, myUploadKnowledgeBaseFile } from '@/services/ant-design-pro/api';
import { ActionType, PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import { NewKnowledgeBaseForm } from './components/NewForm';
import { ITableRequest, TableList } from './components/TableList';
import { FormValueType, UpdateForm } from './components/UpdateForm';
import { KnowledgeBase } from './tableData';

const TableForm: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<API.KnowledgeBaseListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.KnowledgeBaseListItem[]>([]);
  const [fileList, setFileList] = useState<(File)[]>([]);

  const actionRef = React.useRef<ActionType>();
  const resquest: ITableRequest<API.KnowledgeBaseListItem> = async (p, sorter, filter) => {
    console.log(p, sorter, filter);
    let params = { ...p };
    if (Object.keys(sorter).length !== 0) {
      params = { ...params, ...sorter };
    }
    if (Object.keys(filter).length !== 0) {
      params = { ...params, ...filter };
    }
    console.log('params', typeof((params as any).updatedAt||''));
    console.log('params', params);
    //参数p是分页参数
    const res = await myGetKnowledgeBaseList({
      ...params,
    });
    // console.log('1', res.data);
    return res.data;
  };
  const columns = KnowledgeBase.getColumns({
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
  const submitNewForm = async (value: FormValueType<API.KnowledgeBaseListItem>) => {
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
      setCurrentRow(undefined);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <PageContainer header={{
      title:null
    }}
    >
      <TableList
        component={{
          NewForm: NewKnowledgeBaseForm,
          UpdateForm: UpdateForm,
          // DetailDrawer: DetailDrawer,
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
        data={{ columns: columns, title: KnowledgeBase.title }}
        request={resquest}
        submitNewForm={submitNewForm}
      />
    </PageContainer>
  );
};

export default TableForm;
