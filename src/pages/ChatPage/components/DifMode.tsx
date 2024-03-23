import { IHookFunc } from '@/services/plugin/globalInter';
import { useAccess } from '@umijs/max';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { DialogList, DialogListProps } from './DialogList';

interface IDifMode {
  children: React.ReactNode;
  dialogComponent: DialogListProps;
  setMenuDisplay: IHookFunc<boolean>;
}

export function DifMode(props: IDifMode) {
  const access = useAccess(); //用于改变问答界面布局

  return (
    <>
      {access.isMobile() === false ? (
        <Allotment defaultSizes={[600, 2000]} minSize={0}>
          {/* 对话框列表 */}
          <DialogList
            dialogs={props.dialogComponent.dialogs}
            currentDialogKey={props.dialogComponent.currentDialogKey}
            handleDialogClick={props.dialogComponent.handleDialogClick}
            handleDeleteDialog={props.dialogComponent.handleDeleteDialog}
            handleEditDialog={props.dialogComponent.handleEditDialog}
          />
          {props.children}
        </Allotment>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
}
