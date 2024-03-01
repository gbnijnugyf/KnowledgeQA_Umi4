import { addRule, myRemoveRule } from '@/services/ant-design-pro/api';
import { IHookFunc } from '@/services/plugin/globalInter';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { RcFile } from 'antd/es/upload';
import React from 'react';
import { IDetailDrawerProps } from './DetailDrawer';
import { INewFormProps } from './NewForm';
import type { FormValueType, IUpdateFormProps } from './UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

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

export type ITableRequest<T> = (
  params: API.PageParams & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, (string | number)[] | null>,
) => Promise<Partial<RequestData<T>>>;
interface ITableList<T> {
  component: {
    NewForm?: (props: INewFormProps) => React.JSX.Element;
    UpdateForm?: (props: IUpdateFormProps<T>) => React.JSX.Element;
    DetailDrawer?: (props: IDetailDrawerProps) => React.JSX.Element;
  };
  hooks: {
    openCreate?: IHookFunc<boolean>;
    openUpdate?: IHookFunc<boolean>;
    openDetail?: IHookFunc<boolean>;
    setCurrentRow?: IHookFunc<T | undefined>;
    setRowState: IHookFunc<T[]>;
    ref: React.MutableRefObject<ActionType | undefined>;
    setFileList?: IHookFunc<(string | Blob | RcFile)[]>;
  };
  data: {
    title: string;
    columns: ProColumns<T>[];
  };
  request: ITableRequest<T>;
  submitNewForm?: (value: FormValueType<T>) => Promise<void>;
}

export function TableList<T extends Record<string, any>>(props: ITableList<T>) {
  // const actionRef = useRef<ActionType>();
  // const [selectedRowsState, setSelectedRows] = useState<API.KnowledgeBaseListItem[]>([]);

  // const title

  return (
    <>
      <ProTable<T, API.PageParams>
        search={{
          collapsed: false,
          collapseRender: () => false,
          labelWidth: 'auto',
        }}
        style={{ userSelect: 'none' }}
        headerTitle={props.data.title}
        tableAlertRender={false}
        actionRef={props.hooks.ref}
        rowKey="key"
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
            props.hooks.setRowState.set(selectedRows);
          },
        }}
      />
      {props.hooks.setRowState.value?.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div>
              选择 <a style={{ fontWeight: 600 }}>{props.hooks.setRowState.value.length}</a> 项
              &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <Button
              onClick={async () => {
                await handleRemove(props.hooks.setRowState.value);
                props.hooks.setRowState.set([]);
                props.hooks.ref.current?.reloadAndRest?.();
              }}
            >
              删除
            </Button>
          </div>
        </div>
      )}
      {props.component.NewForm === undefined ||
      props.hooks.openCreate === undefined ||
      props.submitNewForm === undefined ||
      props.hooks.setFileList === undefined
        ? null
        : props.component.NewForm({
            actionRef: props.hooks.ref,
            onSubmit: props.submitNewForm,
            onCancel: () => {
              props.hooks.openCreate?.set(false);
              if (!props.hooks.openDetail?.value) {
                props.hooks.setFileList?.set([]);
                props.hooks.setCurrentRow?.set(undefined);
              }
            },
            hook: {
              open: { value: props.hooks.openCreate.value, set: props.hooks.openCreate.set },
              setFileList: {
                value: props.hooks.setFileList.value,
                set: props.hooks.setFileList.set,
              },
            },
            //此处key仅用于已有知识库新增文件时使用
            key: props.hooks.setCurrentRow?.value?.key
          })}
      {props.component.UpdateForm === undefined ||
      props.hooks.openUpdate === undefined ||
      props.hooks.setCurrentRow === undefined ||
      props.hooks.openDetail === undefined
        ? null
        : props.component.UpdateForm({
            hook: {
              open: props.hooks.openUpdate,
            },
            actionRef: props.hooks.ref,
            values: props.hooks.setCurrentRow.value || {},
            key: props.hooks.setCurrentRow.value?.key || 0,
            // onSubmit: async (value) => {
            //   const success = await handleUpdate(value);
            //   if (success) {
            //     props.hooks.openUpdate?.set(false);
            //     props.hooks.setCurrentRow?.set(undefined);
            //     if (props.hooks.ref.current) {
            //       props.hooks.ref.current.reload();
            //     }
            //   }
            // },
            // onCancel: () => {
            //   props.hooks.openUpdate?.set(false);
            //   if (!props.hooks.openDetail?.value) {
            //     props.hooks.setCurrentRow?.set(undefined);
            //   }
            // },
            // updateModalOpen: props.hooks.openUpdate?.value,
            // values: props.hooks.setCurrentRow?.value || {},
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
            baseName:
              (props.hooks.setCurrentRow?.value?.name
                ? props.hooks.setCurrentRow?.value?.name
                : '') + ' 知识库文件',
          })}
    </>
  );
}
