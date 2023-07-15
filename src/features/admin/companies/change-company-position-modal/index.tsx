import FormControl from '@/shared/components/form-control';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import classNames from 'classnames';

const ChangeCompanyPosition: React.FC<{
  position: number;
  companyId: string;
  useChangePositionForm: UseFormReturn<
    {
      position: number;
    },
    any
  >;
  isChangePositionModalOpen: boolean;
  setIsChangePositionModalOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ companyId, position, useChangePositionForm, isChangePositionModalOpen, setIsChangePositionModalOpen }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(
    async () => {
      await axios.put('/api/admin/companies/update-company-position', {
        companyId,
        newPosition: Number(useChangePositionForm.getValues('position')),
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries('getCompanies');
        setIsChangePositionModalOpen(false);
      },
    }
  );
  useEffect(() => {
    useChangePositionForm.setValue('position', position);
  }, []);
  return (
    <Dialog.Root open={isChangePositionModalOpen} onOpenChange={setIsChangePositionModalOpen}>
      {/* <Dialog.Trigger asChild>
        <span className="cursor-pointer">{position}</span>
      </Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay className="AlertDialogOverlay" />
        <Dialog.Content className="AlertDialogContent">
          <Dialog.Title className="AlertDialogTitle mb-2">Change company position</Dialog.Title>
          <Dialog.Description className="AlertDialogDescription">
            <FormControl>
              <input
                disabled={isLoading}
                type="number"
                className="input"
                {...useChangePositionForm.register('position', {
                  required: 'Position is required.',
                })}
              />
            </FormControl>
          </Dialog.Description>
          <div className="items-center" style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
            <button disabled={isLoading} className="btn btn-ghost" onClick={() => setIsChangePositionModalOpen(false)}>
              Cancel
            </button>
            <button
              disabled={isLoading}
              className={classNames('btn btn-primary')}
              onClick={() => {
                mutate();
              }}>
              {isLoading && <span className="loading loading-spinner"></span>}
              Save Position
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default ChangeCompanyPosition;
