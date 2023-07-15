import React, { HTMLAttributes, ReactNode } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Modal: React.FC<{ trigger: string; title: string; children: ReactNode; triggerClassName: HTMLAttributes<HTMLButtonElement> }> = ({
  children,
  title,
  trigger,
  triggerClassName,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button className={`${triggerClassName} btn`}>{trigger}</button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="AlertDialogTitle">Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </AlertDialog.Description>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
          <AlertDialog.Cancel asChild>
            <button className="btn btn-ghost">Cancel</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className="btn btn-primary">Yes, delete account</button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default Modal;
