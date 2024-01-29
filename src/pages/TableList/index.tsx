import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { NewForm } from './components/NewForm';
import { TableList } from './components/TableList';
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
          NewForm: NewForm,
          UpdateForm: UpdateForm,
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
        }}
        data={{columns: columns}}
      />
    </PageContainer>
  );
};

export default TableForm;
