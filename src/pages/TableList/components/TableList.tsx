import { addRule, myRemoveRule, updateRule } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-components';
import { FooterToolbar, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import { IDetailDrawerProps } from './DetailDrawer';
import { INewFormProps } from './NewForm';
import type { FormValueType, IUpdateFormProps } from './UpdateForm';

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

export type ITableRequest = (
  params: API.PageParams & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, (string | number)[] | null>,
) => Promise<Partial<RequestData<API.KnowledgeBaseListItem>>>;
interface ITableList {
  component: {
    NewForm?: (props: INewFormProps) => React.JSX.Element;
    UpdateForm?: (props: IUpdateFormProps) => React.JSX.Element;
    DetailDrawer?: (props: IDetailDrawerProps) => React.JSX.Element;
  };
  hooks: {
    openCreate?: IHookFunc<boolean>;
    openUpdate?: IHookFunc<boolean>;
    openDetail?: IHookFunc<boolean>;
    setCurrentRow?: IHookFunc<API.KnowledgeBaseListItem | undefined>;
  };
  data: {
    title: string;
    columns: ProColumns<API.KnowledgeBaseListItem>[];
  };
  request: ITableRequest;
}

export function TableList(props: ITableList) {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.KnowledgeBaseListItem[]>([]);

  return (
    <>
      <ProTable<API.KnowledgeBaseListItem, API.PageParams>
        style={{ userSelect: 'none' }}
        headerTitle={props.data.title}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          props.hooks.openCreate === undefined || props.component.NewForm === undefined ? null : (
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                props.hooks.openCreate?.set(true);
              }}
            >
              <PlusOutlined />
              新增
            </Button>
          ),
        ]}
        request={props.request}
        columns={props.data.columns}
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
      {props.component.NewForm === undefined || props.hooks.openCreate === undefined
        ? null
        : props.component.NewForm({
            actionRef: actionRef,
            hook: {
              open: { value: props.hooks.openCreate.value, set: props.hooks.openCreate.set },
            },
          })}
      {props.component.UpdateForm === undefined ||
      props.hooks.openUpdate === undefined ||
      props.hooks.setCurrentRow === undefined ||
      props.hooks.openDetail === undefined
        ? null
        : props.component.UpdateForm({
            onSubmit: async (value) => {
              const success = await handleUpdate(value);
              if (success) {
                props.hooks.openUpdate?.set(false);
                props.hooks.setCurrentRow?.set(undefined);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            },
            onCancel: () => {
              props.hooks.openUpdate?.set(false);
              if (!props.hooks.openDetail?.value) {
                props.hooks.setCurrentRow?.set(undefined);
              }
            },
            updateModalOpen: props.hooks.openUpdate?.value,
            values: props.hooks.setCurrentRow?.value || {},
          })}
      {props.component.DetailDrawer === undefined ||
      props.hooks.openDetail === undefined ||
      props.hooks.setCurrentRow === undefined
        ? null
        : props.component.DetailDrawer({
            key: props.hooks.setCurrentRow?.value?.key || 0,
            hook: {
              open: {
                value: props.hooks.openDetail.value,
                set: props.hooks.openDetail.set,
              },
            },
            baseName: (props.hooks.setCurrentRow?.value?.name
              ? props.hooks.setCurrentRow?.value?.name
              : '') + ' 知识库文件',
          })}
    </>
  );
}
