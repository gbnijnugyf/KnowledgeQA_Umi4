import { myGetKnowledgeBaseList } from '@/services/ant-design-pro/api';
import { ActionType, PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import DetailDrawer from './components/DetailDrawer';
import { NewKnowledgeBaseForm } from './components/NewForm';
import { ITableRequest, TableList } from './components/TableList';
import { UpdateForm } from './components/UpdateForm';
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

  const actionRef = React.useRef<ActionType>();
  const resquest: ITableRequest = async (p, sorter, filter) => {
    console.log(p, sorter, filter);
    let params = { ...p };
    if (Object.keys(sorter).length !== 0) {
      params = { ...params, ...sorter };
    }
    if (Object.keys(filter).length !== 0) {
      params = { ...params, ...filter };
    }

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

  return (
    <PageContainer>
      <TableList
        component={{
          NewForm: NewKnowledgeBaseForm,
          UpdateForm: UpdateForm,
          DetailDrawer: DetailDrawer,
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
        }}
        data={{ columns: columns, title: KnowledgeBase.title }}
        request={resquest}
      />
    </PageContainer>
  );
};

export default TableForm;
