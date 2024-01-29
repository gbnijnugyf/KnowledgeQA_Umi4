import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Drawer, Table } from 'antd';
import { useEffect } from 'react';
import {TableList} from './TableList';
import { IHookFunc } from '@/services/plugin/globalInter';

export interface IDetailDrawerProps {
  key: number; //用于请求具体数据
  hook: {
    open: IHookFunc<boolean>;
  };
}

export default function DetailDrawer(props: IDetailDrawerProps) {

    // useEffect(() => {
    //     const res = await getRule({ id: props.key });

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
        {/* <TableList /> */}
      {/* {currentRow?.name && (
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
      )} */}
    </Drawer>
  );
}
