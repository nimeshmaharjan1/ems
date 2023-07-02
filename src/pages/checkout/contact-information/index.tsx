import FormControl from '@/shared/components/form-control';
import { useSession } from 'next-auth/react';
import React from 'react';

const ContactInformation = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="mb-4 shadow card bg-base-200">
      <div className="card-body">
        <div className="card-title">Contact Information</div>
        <FormControl>
          <input
            type="text"
            // {...register('name', {
            //   required: 'Category name is required.',
            // })}
            // placeholder="Category name"
            // className={classNames('input input-bordered', {
            //   'input-error': errors?.name,
            // })}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default ContactInformation;
