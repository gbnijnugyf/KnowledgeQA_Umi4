import {
  addRule,
  myGetKnowledgeBaseList,
  myRemoveRule,
  updateRule,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, ProTable } from '@ant-design/pro-components';
import { Button, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import DetailDrawer from './DetailDrawer';
import NewForm from './NewForm';
import type { FormValueType } from './UpdateForm';
import UpdateForm from './UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.KnowledgeBaseListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.KnowledgeBaseListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const res = await myRemoveRule({
      key: selectedRows.map((row) => row.key),
    });
    console.log(res);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const TableList: React.FC = () => {
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

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.KnowledgeBaseListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.KnowledgeBaseListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.KnowledgeBaseListItem>[] = [
    //TODO: 表格修改
    {
      title: '名称',
      dataIndex: 'name',
      tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        // console.log(dom, entity);
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    // {
    //   title: '描述',
    //   dataIndex: 'desc',
    //   valueType: 'textarea',
    // },
    {
      title: '可见性',
      dataIndex: 'status',
      hideInForm: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '仅可问答',
          status: 'Default',
        },
        1: {
          text: '可见知识图谱',
          status: 'Processing',
        },
        2: {
          text: '所有可见',
          status: 'Success',
        },
        3: {
          text: '全不可见',
          status: 'Error',
        },
      },
    },
    {
      title: '最近更新时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder={'Please enter the reason for the exception!'} />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          配置基本信息
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          订阅
        </a>,
      ],
    },
  ];

  return (
    // <PageContainer>
    <>
      <ProTable<API.KnowledgeBaseListItem, API.PageParams>
        headerTitle={'Enquiry form'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined />
            新增
          </Button>,
        ]}
        // request={rule}
        //TODO: 修改请求方法
        request={async (p, sorter, filter) => {
          console.log(p, sorter, filter);
          //参数p是分页参数
          const res = await myGetKnowledgeBaseList(p);
          // const res = await rule(p)
          console.log(res.data);
          return res.data;
          // return res
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            删除
          </Button>
        </FooterToolbar>
      )}
      <NewForm
        actionRef={actionRef}
        hook={{ open: { value: createModalOpen, set: handleModalOpen } }}
      />
      {/* <ModalForm
          title={'New rule'}
          width="400px"
          open={createModalOpen}
          onOpenChange={handleModalOpen}
          onFinish={async (value) => {
            const success = await handleAdd(value as API.KnowledgeBaseListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: 'Rule name is required',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" />
        </ModalForm> */}
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />
      <DetailDrawer
        key={0}
        hook={{
          open: {
            value: showDetail,
            set: setShowDetail,
          },
        }}
      />
      {/* <Drawer
          width={600}
          open={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
            console.log(currentRow)
          }}
          closable={false}
        >
          {currentRow?.name && (
            <ProDescriptions<API.KnowledgeBaseListItem>
              column={2}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<API.KnowledgeBaseListItem>[]}
            />
          )}
        </Drawer> */}
    </>
    // </PageContainer>
  );
};
