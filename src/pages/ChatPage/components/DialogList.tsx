import { EllipsisOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { throttle } from 'lodash';
import { CSSProperties, Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';

// 定义 DialogList 组件的 props 类型
export interface DialogListProps {
  dialogs: API.DialogListItem[];
  currentDialogKey: number | null;
  handleDialogClick: (key: number) => void;
  handleDeleteDialog: (key: number, name: string) => void;
  handleEditDialog: (key: number, name: string) => void;
}

// DialogList 组件
export function DialogList({
  dialogs,
  currentDialogKey,
  handleDialogClick,
  handleDeleteDialog,
  handleEditDialog,
}: DialogListProps) {
  return (
    <Menu
      onClick={({ key }: { key: string }) => handleDialogClick(Number(key))}
      style={{ width: '100%' , borderRight: 'none'}}
      mode="inline"
    >
      {dialogs.map((dialog) => (
        <Menu.Item key={dialog.key} icon={dialog.key === -1 ? <PlusCircleOutlined /> : undefined}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {dialog.name}
            {dialog.key !== -1 ? (
              <Dropdown
                menu={{
                  onClick: ({ key }) => {
                    switch (key) {
                      case 'delete':
                        handleDeleteDialog(dialog.key, dialog.name);
                        break;
                      case 'edit':
                        handleEditDialog(dialog.key, dialog.name);
                        break;
                      default:
                        break;
                    }
                  },
                  items: [
                    { key: 'delete', label: '删除' },
                    // { key: 'edit', label: '编辑' },
                  ],
                }}
                trigger={['hover']}
              >
                <Button type="link" icon={<EllipsisOutlined />} />
              </Dropdown>
            ) : null}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
}
